from agents.research_agent import detect_brand, detect_category

STOPWORDS = {
    "the", "and", "with", "for", "from", "pack", "new", "set", "large",
    "small", "premium", "organic", "fresh",
}


class EnrichmentAgent:
    def __init__(self, name="enrichment_agent"):
        self.name = name

    def run(self, stage_data):
        if isinstance(stage_data, dict) and "product" in stage_data:
            product = dict(stage_data["product"])
        else:
            product = dict(stage_data or {})

        added = []
        text_blob = " ".join(
            str(part) for part in [product.get("name"), product.get("description")] if part
        )

        if not product.get("category"):
            category = detect_category(text_blob)
            if category:
                product["category"] = category
                added.append("category")

        if not product.get("brand"):
            brand = detect_brand(text_blob)
            if brand:
                product["brand"] = brand
                added.append("brand")

        tags = []
        seen = set()

        def add_tag(value):
            token = str(value).strip().strip(".$#").lower()
            if not token or token in STOPWORDS or token in seen:
                return
            if token.isdigit() or len(token) < 2:
                return
            seen.add(token)
            if len(tags) < 5:
                tags.append(token)

        if product.get("category"):
            add_tag(product["category"])
        for ingredient in product.get("ingredients", []):
            add_tag(ingredient)
        words = (product.get("name") or "").split()
        for word in words:
            if len(tags) >= 5:
                break
            add_tag(word)
        product["tags"] = tags

        return {
            "agent": self.name,
            "product": product,
            "added": added,
            "status": "ok",
        }


if __name__ == "__main__":
    agent = EnrichmentAgent()
    print(agent.run({"product": {"name": "Wireless Headphones"}}))
