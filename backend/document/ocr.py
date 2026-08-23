class OCREngine:
    def __init__(self, language="eng"):
        self.language = language

    def extract_text_from_image(self, image_path):
        return ""

    def extract_text_from_pdf(self, pdf_path):
        return ""


if __name__ == "__main__":
    engine = OCREngine()
    print(engine.extract_text_from_image("sample.png"))
