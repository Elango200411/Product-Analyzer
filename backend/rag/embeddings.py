class EmbeddingModel:
    def __init__(self, model_name="default"):
        self.model_name = model_name

    def embed_text(self, text):
        return []

    def embed_batch(self, texts):
        return [[] for _ in texts]


if __name__ == "__main__":
    model = EmbeddingModel()
    print(model.embed_text("hello world"))
