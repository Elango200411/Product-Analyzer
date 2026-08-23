import json
import os
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter
from pydantic import BaseModel

from agents.pipeline import AnalysisPipeline


router = APIRouter()

DATA_DIR = Path(os.getenv("DATA_DIR", "data"))
UPLOAD_DIR = DATA_DIR / os.getenv("UPLOAD_DIR_NAME", "documents")
PRODUCT_DIR = DATA_DIR / os.getenv("PRODUCTS_DIR_NAME", "products")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
PRODUCT_DIR.mkdir(parents=True, exist_ok=True)

pipeline = AnalysisPipeline()


class AnalyzeRequest(BaseModel):
    name: str


def _slugify(text):
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug or "product"


@router.post("/analyze")
async def analyze_product(request: AnalyzeRequest):
    result = pipeline.run(request.name)
    product = result["product"]

    product_id = f"{_slugify(product.get('name') or request.name)}-{uuid.uuid4().hex[:8]}"
    product["id"] = product_id
    product["analyzed_at"] = datetime.now(timezone.utc).isoformat()

    output_path = PRODUCT_DIR / f"{product_id}.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(product, f, indent=2)

    return {
        "success": True,
        "product_id": product_id,
        "product": product,
        "pipeline": result["pipeline"],
    }


@router.get("/products")
async def list_products():
    products = []
    for path in sorted(PRODUCT_DIR.glob("*.json")):
        try:
            with open(path, encoding="utf-8") as f:
                products.append(json.load(f))
        except (json.JSONDecodeError, OSError):
            continue
    return {"products": products}


@router.get("/products/{product_id}")
async def get_product(product_id: str):
    path = PRODUCT_DIR / f"{_slugify(product_id)}.json"
    matches = sorted(PRODUCT_DIR.glob(f"{_slugify(product_id)}*.json"))
    target = path if path.exists() else (matches[0] if matches else None)
    if target is None:
        return {"success": False, "error": "not found"}
    with open(target, encoding="utf-8") as f:
        return {"success": True, "product": json.load(f)}


@router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    slug = _slugify(product_id)
    exact = PRODUCT_DIR / f"{product_id}.json"
    targets = [exact] if exact.exists() else sorted(PRODUCT_DIR.glob(f"{slug}*.json"))
    if not targets:
        return {"success": False, "error": "not found"}
    removed = 0
    for target in targets[:1]:
        try:
            target.unlink()
            removed += 1
        except OSError:
            pass
    return {"success": removed > 0, "removed": removed}


@router.get("/stats")
async def get_stats():
    products = []
    for path in sorted(PRODUCT_DIR.glob("*.json")):
        try:
            with open(path, encoding="utf-8") as f:
                products.append(json.load(f))
        except (json.JSONDecodeError, OSError):
            continue

    total = len(products)
    avg_quality = (
        sum(float(p.get("quality_score") or 0) for p in products) / total
        if total else 0.0
    )
    valid = sum(1 for p in products if p.get("is_valid"))
    categories = {}
    for p in products:
        cat = p.get("category") or "general"
        categories[cat] = categories.get(cat, 0) + 1

    return {
        "total": total,
        "avg_quality": round(avg_quality, 2),
        "valid": valid,
        "categories": categories,
    }
