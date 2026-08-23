class IngestionPipeline:
    def __init__(self, chunk_size=1000, chunk_overlap=200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def load_documents(self, source):
        return []

    def chunk_documents(self, documents):
        return []

    def run(self, source):
        documents = self.load_documents(source)
        return self.chunk_documents(documents)


if __name__ == "__main__":
    pipeline = IngestionPipeline()
    print(pipeline.run("example_source"))
