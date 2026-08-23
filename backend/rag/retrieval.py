class Retriever:
    def __init__(self, top_k=5):
        self.top_k = top_k

    def index(self, embeddings):
        pass

    def search(self, query_embedding):
        return []


if __name__ == "__main__":
    retriever = Retriever()
    print(retriever.search([]))
