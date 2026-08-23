class ValidationAgent:
    REQUIRED_FIELDS = ["name", "category"]

    def __init__(self, name="validation_agent"):
        self.name = name

    def run(self, stage_data):
        if isinstance(stage_data, dict) and "product" in stage_data:
            product = dict(stage_data["product"])
        else:
            product = dict(stage_data or {})

        errors = []
        issues = []

        if not product.get("name") or not str(product.get("name")).strip():
            errors.append("name is required")

        for field in self.REQUIRED_FIELDS:
            if not product.get(field):
                issues.append(f"missing field: {field}")

        price = product.get("price")
        if price is not None and (not isinstance(price, (int, float)) or price < 0):
            errors.append("price must be a non-negative number")

        rating = product.get("rating")
        if rating is not None and not 0 <= rating <= 5:
            issues.append("rating out of expected range 0-5")

        return {
            "agent": self.name,
            "is_valid": len(errors) == 0,
            "errors": errors,
            "issues": issues,
            "product": product,
            "status": "ok",
        }


if __name__ == "__main__":
    agent = ValidationAgent()
    print(agent.run({}))
