CORE_FIELDS = ["name", "brand", "category", "description", "price"]


class QualityAgent:
    def __init__(self, name="quality_agent"):
        self.name = name

    def run(self, stage_data):
        if isinstance(stage_data, dict) and "product" in stage_data:
            product = dict(stage_data["product"])
        else:
            product = dict(stage_data or {})

        filled = sum(1 for field in CORE_FIELDS if product.get(field) not in (None, "", []))
        score = filled / len(CORE_FIELDS)

        if product.get("ingredients"):
            score = min(1.0, score + 0.1)
        if product.get("tags"):
            score = min(1.0, score + 0.05)

        issues = stage_data.get("issues", []) if isinstance(stage_data, dict) else []
        score -= 0.05 * len(issues)

        quality_score = round(max(0.0, min(1.0, score)), 2)

        return {
            "agent": self.name,
            "quality_score": quality_score,
            "issues": issues,
            "product": product,
            "status": "ok",
        }


if __name__ == "__main__":
    agent = QualityAgent()
    print(agent.run({"product": {"name": "Test"}, "issues": []}))
