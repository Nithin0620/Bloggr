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
    description:
      "Explore modern software architecture patterns, microservices vs monoliths, and building resilient full-stack web applications.",
    category: "Technology",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60",
    author: {
      _id: "seed-author-1",
      name: "Bloggr Team",
      profilePhoto: "https://api.dicebear.com/7.x/bottts/svg?seed=bloggr",
    },
    createdAt: new Date().toISOString(),
    likes: 24,
    views: 180,
    tags: ["Tech", "Architecture", "Engineering"],
  },
  {
    _id: "seed-post-2",
    title: "The Rise of AI Agents and Retrieval-Augmented Generation (RAG)",
    description:
      "A deep dive into how vector databases, embeddings, and autonomous agent frameworks are transforming modern software development.",
    category: "Artificial Intelligence",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
    author: {
      _id: "seed-author-2",
      name: "AI Insights",
      profilePhoto: "https://api.dicebear.com/7.x/bottts/svg?seed=ai",
    },
    createdAt: new Date().toISOString(),
    likes: 42,
    views: 310,
    tags: ["AI", "RAG", "LLM"],
  },
  {
    _id: "seed-post-3",
    title: "Clean Code & Production CI/CD Pipelines: A Practical Guide",
    description:
      "How to set up automated test suites, Docker containers, and seamless deployment workflows without downtime.",
    category: "DevOps",
    thumbnail: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=60",
    author: {
      _id: "seed-author-3",
      name: "DevOps Daily",
      profilePhoto: "https://api.dicebear.com/7.x/bottts/svg?seed=devops",
    },
    createdAt: new Date().toISOString(),
    likes: 19,
    views: 145,
    tags: ["DevOps", "Docker", "CI/CD"],
  },
];
