// Default seed data for brand-new users before their first API response or when backend is waking up

export const SEED_CATEGORIES = [
  "Technology",
  "Web Development",
  "Artificial Intelligence",
  "DevOps",
  "Design",
  "Productivity",
  "Career",
];

export const SEED_POSTS = [
  {
    _id: "seed-post-1",
    title: "Getting Started with Modern Web Architecture & Scalable Systems",
    content:
      "Explore modern software architecture patterns, microservices vs monoliths, and building resilient full-stack web applications. Learn how caching layers, edge distribution, and asynchronous queues can keep your platform running lightning fast.",
    categories: [{ _id: "cat-1", name: "Technology" }],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60",
    author: {
      _id: "seed-author-1",
      firstName: "Bloggr",
      lastName: "Team",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=bloggr",
    },
    createdAt: new Date().toISOString(),
    likes: [],
    comments: [],
    views: 180,
    readTime: "4",
    tags: [{ _id: "tag-1", name: "Tech", slug: "tech" }],
  },
  {
    _id: "seed-post-2",
    title: "The Rise of AI Agents and Retrieval-Augmented Generation (RAG)",
    content:
      "A deep dive into how vector databases, embeddings, and autonomous agent frameworks are transforming modern software development. Build smarter contextual search and automated reasoning pipelines.",
    categories: [{ _id: "cat-2", name: "Artificial Intelligence" }],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
    author: {
      _id: "seed-author-2",
      firstName: "AI",
      lastName: "Insights",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=ai",
    },
    createdAt: new Date().toISOString(),
    likes: [],
    comments: [],
    views: 310,
    readTime: "5",
    tags: [{ _id: "tag-2", name: "AI", slug: "ai" }],
  },
  {
    _id: "seed-post-3",
    title: "Clean Code & Production CI/CD Pipelines: A Practical Guide",
    content:
      "How to set up automated test suites, Docker containers, and seamless deployment workflows without downtime. Master progressive rollout and continuous integration best practices.",
    categories: [{ _id: "cat-3", name: "DevOps" }],
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=60",
    author: {
      _id: "seed-author-3",
      firstName: "DevOps",
      lastName: "Daily",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=devops",
    },
    createdAt: new Date().toISOString(),
    likes: [],
    comments: [],
    views: 145,
    readTime: "3",
    tags: [{ _id: "tag-3", name: "DevOps", slug: "devops" }],
  },
];
