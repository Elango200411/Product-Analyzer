import re

PRICE_RE = re.compile(r"(?:\$|USD\s?)(\d+(?:\.\d{1,2})?)")
INGREDIENTS_RE = re.compile(r"ingredients?:\s*([^.;]+)", re.IGNORECASE)


class ExtractionAgent:
    def __init__(self, name="extraction_agent"):
        self.name = name

    def run(self, raw_data):
        if not raw_data or raw_data.get("status") != "ok":
            return {
                "agent": self.name,
                "product": {},
                "status": "no_data",
            }

        query = raw_data.get("query", "")
        hints = raw_data.get("hints", {})
        snippets = [r.get("text", "") for r in raw_data.get("results", [])]

        product = {
            "name": query.title() if query else "",
            "brand": hints.get("brand"),
            "category": hints.get("category"),
            "price": hints.get("price"),
            "currency": "USD",
            "rating": hints.get("rating"),
            "review_count": hints.get("review_count"),
            "description": snippets[0] if snippets else None,
            "ingredients": [],
        }

        for snippet in snippets:
            match = INGREDIENTS_RE.search(snippet)
            if match:
                product["ingredients"] = [
                    item.strip().lower()
                    for item in match.group(1).split(",")
                    if item.strip()
                ]
                break

        if product["price"] is None:
            for snippet in snippets:
                price_match = PRICE_RE.search(snippet)
                if price_match:
                    product["price"] = float(price_match.group(1))
                    break

        return {
            "agent": self.name,
            "product": product,
            "status": "ok",
        }


if __name__ == "__main__":
    agent = ExtractionAgent()
    print(agent.run({"query": "Dove Soap $2.50", "status": "ok", "results": [], "hints": {}}))
