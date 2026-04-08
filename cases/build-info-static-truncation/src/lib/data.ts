export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  hasReviews: boolean;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
};

const products: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 79.99,
    description:
      "Premium noise-canceling wireless headphones with 30-hour battery life.",
    category: "Electronics",
    image: "🎧",
    hasReviews: false,
  },
  {
    id: "2",
    name: "Mechanical Keyboard",
    price: 129.99,
    description:
      "Compact 75% layout with hot-swappable switches and RGB backlighting.",
    category: "Electronics",
    image: "⌨️",
    hasReviews: false,
  },
  {
    id: "3",
    name: "Desk Lamp",
    price: 49.99,
    description:
      "Adjustable LED desk lamp with multiple brightness and color temperature settings.",
    category: "Home",
    image: "💡",
    hasReviews: false,
  },
  {
    id: "4",
    name: "Running Shoes",
    price: 119.99,
    description:
      "Lightweight running shoes with responsive cushioning and breathable mesh upper.",
    category: "Sports",
    image: "👟",
    hasReviews: false,
  },
  {
    id: "5",
    name: "Coffee Maker",
    price: 89.99,
    description:
      "Programmable drip coffee maker with thermal carafe and brew strength control.",
    category: "Kitchen",
    image: "☕",
    hasReviews: false,
  },
];

const reviews: Record<string, Review[]> = {
  "4": [
    {
      id: "r1",
      author: "Alex",
      rating: 5,
      comment: "Best running shoes I've ever owned!",
      date: "2026-03-01",
    },
    {
      id: "r2",
      author: "Sam",
      rating: 4,
      comment: "Great comfort, runs a bit narrow.",
      date: "2026-03-10",
    },
  ],
  "5": [
    {
      id: "r3",
      author: "Jordan",
      rating: 5,
      comment: "Makes perfect coffee every morning.",
      date: "2026-02-15",
    },
  ],
  "6": [
    {
      id: "r4",
      author: "Taylor",
      rating: 4,
      comment: "Very sturdy and fits my 16-inch laptop.",
      date: "2026-01-20",
    },
    {
      id: "r5",
      author: "Morgan",
      rating: 5,
      comment: "Love the water-resistant fabric!",
      date: "2026-03-05",
    },
    {
      id: "r6",
      author: "Casey",
      rating: 3,
      comment: "Good quality but a bit bulky.",
      date: "2026-03-12",
    },
  ],
};

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProduct(id: string): Promise<Product | undefined> {
  return products.find((p) => p.id === id);
}

export async function getReviews(productId: string): Promise<Review[]> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return reviews[productId] ?? [];
}
