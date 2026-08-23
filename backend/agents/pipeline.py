from agents.research_agent import ResearchAgent
from agents.extraction_agent import ExtractionAgent
from agents.enrichment_agent import EnrichmentAgent
from agents.validation_agent import ValidationAgent
from agents.quality_agent import QualityAgent


class AnalysisPipeline:
    def __init__(self):
        self.research_agent = ResearchAgent()
        self.extraction_agent = ExtractionAgent()
        self.enrichment_agent = EnrichmentAgent()
        self.validation_agent = ValidationAgent()
        self.quality_agent = QualityAgent()

    def run(self, product_name):
        research = self.research_agent.run(product_name)
        extraction = self.extraction_agent.run(research)
        enrichment = self.enrichment_agent.run(extraction)
        validation = self.validation_agent.run(enrichment)
        quality = self.quality_agent.run(validation)

        product = quality["product"]
        product["quality_score"] = quality["quality_score"]
        product["is_valid"] = validation["is_valid"]
        product["errors"] = validation["errors"]
        product["issues"] = validation["issues"]
        product["sources"] = [
            r.get("source") for r in research.get("results", [])
        ]

        return {
            "product": product,
            "pipeline": {
                "research_status": research.get("status"),
                "extraction_status": extraction.get("status"),
                "enrichment_added": enrichment.get("added", []),
                "validation_status": validation.get("status"),
                "quality_status": quality.get("status"),
            },
        }
