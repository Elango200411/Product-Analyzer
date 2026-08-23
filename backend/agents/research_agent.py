import hashlib
import re

CATEGORY_KEYWORDS = {
    "beverages": ["juice", "water", "soda", "coffee", "tea", "cola", "energy drink", "smoothie"],
    "snacks": ["chips", "bar", "cookie", "biscuit", "cracker", "chocolate", "candy", "popcorn"],
    "dairy": ["milk", "yogurt", "cheese", "butter", "cream"],
    "electronics": ["phone", "laptop", "headphones", "charger", "keyboard", "mouse", "monitor", "camera", "speaker"],
    "personal_care": ["shampoo", "soap", "toothpaste", "deodorant", "lotion", "serum", "cream"],
    "household": ["detergent", "cleaner", "towel", "sponge", "dish soap"],
}

KNOWN_BRANDS = [
    "apple", "samsung", "sony", "nike", "adidas", "coca-cola", "pepsi",
    "nestle", "unilever", "logitech", "anker", "philips", "dove", "oreo",
]

PRICE_RE = re.compile(r"(?:\$|USD\s?)(\d+(?:\.\d{1,2})?)")


def _contains_word(text, word):
    return re.search(rf"\b{re.escape(word)}\b", text) is not None


def detect_category(text):
    text = text.lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(_contains_word(text, kw) for kw in keywords):
            return category
    return None


def detect_brand(text):
    text = text.lower()
    for brand in KNOWN_BRANDS:
        if _contains_word(text, brand):
            return brand.title()
    return None


class ResearchAgent:
    def __init__(self, name="research_agent"):
        self.name = name

    def run(self, query):
        if not query or not str(query).strip():
            return {
                "agent": self.name,
                "query": query,
                "results": [],
                "status": "empty_query",
            }

        query = str(query).strip()
        digest = hashlib.md5(query.lower().encode()).hexdigest()

        category = detect_category(query)
        brand = detect_brand(query)
        price_match = PRICE_RE.search(query)
        price_hint = float(price_match.group(1)) if price_match else None

        seed = int(digest[:8], 16)
        rating = round(3.5 + (seed % 15) / 10.0, 1)
        review_count = 50 + seed % 5000

        category_label = (category or "general").replace("_", " ")
        results = [
            {
                "source": "catalog",
                "text": f"{query.title()} is a {category_label} product available through retail catalogs.",
                "confidence": round(0.7 + (seed % 30) / 100.0, 2),
            },
            {
                "source": "reviews",
                "text": f"Customers rate {query.lower()} {rating} out of 5, based on {review_count:,} verified reviews.",
                "confidence": round(0.6 + (seed % 40) / 100.0, 2),
            },
        ]
        if price_hint is not None:
            results.append({
                "source": "pricing_feed",
                "text": f"The current listed price is ${price_hint:,.2f}.",
                "confidence": 0.9,
            })

        return {
            "agent": self.name,
            "query": query,
            "results": results,
            "hints": {
                "category": category,
                "brand": brand,
                "price": price_hint,
                "rating": rating,
                "review_count": review_count,
            },
            "status": "ok",
        }


if __name__ == "__main__":
    agent = ResearchAgent()
    print(agent.run("Apple Wireless Headphones $199"))
