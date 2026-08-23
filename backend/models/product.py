from dataclasses import dataclass, field
from typing import Optional


@dataclass
class Product:
    id: Optional[str] = None
    name: str = ""
    brand: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    currency: str = "USD"
    source_url: Optional[str] = None
    ingredients: list = field(default_factory=list)
    tags: list = field(default_factory=list)
    quality_score: Optional[float] = None

    def to_dict(self):
        return self.__dict__.copy()

    @classmethod
    def from_dict(cls, data):
        return cls(**{k: v for k, v in data.items() if k in cls.__dataclass_fields__})


if __name__ == "__main__":
    product = Product(name="Sample Product", price=9.99)
    print(product.to_dict())
