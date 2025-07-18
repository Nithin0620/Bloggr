import { create } from "zustand";

export const usePostStore = create((get,set)=>({
   currentPostForReadMore : {
  "title": "Mastering React in 2025: New Patterns and Best Practices",
  "categories": ["React", "Frontend", "JavaScript"],
  "author": "Nithin KS",
  "updatedTime": 1721272800000,
  "readTime": 1721271000000,
  "image": "https://images.unsplash.com/photo-1603570418360-7b2cc4c6c179?auto=format&fit=crop&w=1000&q=80",
  "description": "React in 2025 introduces powerful patterns like Server Components, Concurrent Rendering, and optimized bundling techniques. This article walks you through these innovations with code samples, real-world use cases, and a side-by-side comparison with legacy patterns.\n\n## Highlights\n- ✅ Server-side rendering with React Server Components\n- 🚀 Optimized lazy loading strategies\n- 🧠 Understanding Suspense boundaries and transition APIs\n\n> “React is not just a library anymore; it's a full ecosystem.”\n\n### Code Sample\n```jsx\nconst App = () => {\n  return (\n    <div className=\"p-4\">\n      <h1 className=\"text-2xl font-bold\">Welcome to React 2025</h1>\n    </div>\n  );\n};\n```\n\n### Tags\n#React #SSR #Frontend #JavaScript",
  "likes": [
    {
      "userId": "user_01",
      "userName": "Alice Dev"
    },
    {
      "userId": "user_02",
      "userName": "Bob Coder"
    },
    {
      "userId": "user_03",
      "userName": "Charlie UI"
    }
  ],
  "comments": [
    {
      "user": {
        "name": "Alice Dev",
        "profilePic": "https://i.pravatar.cc/40?img=5"
      },
      "text": "This article is super insightful 🔥",
      "updatedTime": 1721274600000
    },
    {
      "user": {
        "name": "Bob UI",
        "profilePic": "https://i.pravatar.cc/40?img=8"
      },
      "text": "Loved the explanation of Server Components!",
      "updatedTime": 1721275000000
    },
    {
      "user": {
        "name": "Charlie UX",
        "profilePic": "https://i.pravatar.cc/40?img=12"
      },
      "text": "Thanks for breaking this down clearly. Helped a lot.",
      "updatedTime": 1721276000000
    }
  ]
}

,
   setPost : async(postId)=>{
      const response = 
      set({currentPostForReadMore:response})
   }
}))   