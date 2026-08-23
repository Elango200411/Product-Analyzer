class PDFProcessor:
    def __init__(self):
        pass

    def extract_text(self, pdf_path):
        return ""

    def extract_metadata(self, pdf_path):
        return {}

    def extract_pages(self, pdf_path):
        return []


if __name__ == "__main__":
    processor = PDFProcessor()
    print(processor.extract_text("sample.pdf"))
