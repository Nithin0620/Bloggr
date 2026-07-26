# Bloggr Revamp 2.0 — AI-Powered Platform

## Vision

Transform Bloggr from a standard blog platform into an AI-powered writing, discovery, and analytics platform. Every article is processed through an AI publishing pipeline, chunked, embedded, and stored in a vector database. That single vector index powers semantic search, RAG chat, reader assistance, recommendations, trending, analytics, and podcast generation.

---

## Tech Stack Additions

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Vector DB | **Qdrant** (self-hosted, Docker) | Store article embeddings, power search/RAG/recommendations |
| Job Queue | **BullMQ** + Redis | Background AI processing (grammar, SEO, embedding, etc.) |
| Embeddings | **Gemini text-embedding-004** (3072 dims) or **Groq + open-source** | Convert text chunks to vectors |
| AI Generation | **Gemini 2.5 Flash** (primary) + **Groq Llama 3.3 70B** (fallback) | All text generation tasks |
| TTS | **ElevenLabs** or **Google TTS** | Podcast generation |
| Analytics | **MongoDB Aggregation** + Redis cache | Author dashboards, trend detection |

### Updated docker-compose.yml

```
services:
  backend, frontend, mongo, redis (existing)
  + qdrant (new — vector database, port 6333)
  + bullmq-board (optional — job monitoring UI)
```

---

## Feature Breakdown

### Feature 1: Vector DB Setup + Embedding Pipeline
**Priority: P0 — Foundation for everything else**
**Depends on: Nothing**
**Estimated effort: Medium**

#### What
Set up Qdrant, create the embedding pipeline that runs on every publish, and establish the chunking + storage flow.

#### Backend Changes
- `docker-compose.yml` — add Qdrant service
- `backend/configuration/qdrant.js` — Qdrant client setup
- `backend/models/post.js` — add fields: `embeddingStatus`, `difficulty`, `seo`, `readingGrade`, `tags[]` (enhanced from current)
- `backend/services/chunker.js` — split article into ~500-token chunks with overlap
- `backend/services/embedder.js` — call Gemini embedding API, get 3072-dim vectors
- `backend/services/vectorStore.js` — upsert chunks + metadata into Qdrant
- `backend/workers/embeddingWorker.js` — BullMQ worker that processes embedding jobs

#### Qdrant Collection Schema
```
Collection: "bloggr_articles"
Vector: 3072 dimensions (Gemini embedding-004)
Payload:
  - articleId (string)
  - chunkIndex (int)
  - chunkText (string)
  - title (string)
  - authorId (string)
  - authorName (string)
  - tags (string[])
  - categories (string[])
  - createdAt (datetime)
```

#### Flow
```
User clicks Publish
  → BullMQ job queued: "embedding-job"
  → Worker picks up job
  → Chunk article (500 tokens, 50 token overlap)
  → Generate embeddings via Gemini API
  → Upsert chunks into Qdrant
  → Update Post.embeddingStatus = "completed"
```

#### Files to Create/Modify
- Create: `backend/configuration/qdrant.js`
- Create: `backend/services/chunker.js`
- Create: `backend/services/embedder.js`
- Create: `backend/services/vectorStore.js`
- Create: `backend/workers/embeddingWorker.js`
- Create: `backend/queues/embeddingQueue.js`
- Modify: `backend/models/post.js` — add embedding/difficulty/seo fields
- Modify: `backend/controllers/Post.js` — trigger embedding on publish
- Modify: `backend/index.js` — start BullMQ worker
- Modify: `docker-compose.yml` — add Qdrant

---

### Feature 2: AI Publishing Pipeline
**Priority: P0 — Core workflow**
**Depends on: Feature 1**
**Estimated effort: Large**

#### What
When a user clicks Publish, the article goes through a chain of AI agents before being saved. Each agent enriches the post metadata.

#### Agents (run in sequence via BullMQ)

**1. Grammar Agent**
- Input: article content (plain text)
- Output: `grammarScore` (0-100), `grammarIssues[]` (array of `{ paragraph, original, suggestion, type }`)
- Does NOT auto-correct — only reports

**2. SEO Agent**
- Input: title, content, tags, categories
- Output: `seo` object: `{ score, metaTitle, metaDescription, slug, keywords[], ogTitle, ogDescription, issues[] }`
- Issues: "Missing keyword X", "Meta description too short", etc.

**3. Tag Generator**
- Input: content, existing tags from DB
- Output: `generatedTags[]` (picks from existing + suggests new), `difficulty` (beginner/intermediate/advanced), `keywords[]`

**4. Summary Generator**
- Input: content
- Output: `summary` object: `{ tldr, bulletPoints[], summary100, oneLiner }`
- Multiple summary formats for different use cases

**5. Difficulty Detector**
- Input: content
- Output: `difficulty`, `readingGrade`, `vocabularyComplexity`, `technicalDensity`

**6. Reading Time**
- Already exists — recalculate based on final content

#### Backend Changes
- `backend/services/aiPipeline.js` — orchestrates the chain of agents
- `backend/workers/pipelineWorker.js` — BullMQ worker for the full pipeline
- `backend/queues/pipelineQueue.js` — job queue
- `backend/models/post.js` — add nested schema for `grammar`, `seo`, `difficulty`, `summaries`

#### Post Model additions
```javascript
embeddingStatus: { type: String, enum: ["pending", "processing", "completed", "failed"], default: "pending" },
grammar: {
  score: Number,
  issues: [{ paragraph: Number, original: String, suggestion: String, type: String }]
},
seo: {
  score: Number,
  metaTitle: String,
  metaDescription: String,
  slug: String,
  keywords: [String],
  ogTitle: String,
  ogDescription: String,
  issues: [String]
},
difficulty: {
  level: { type: String, enum: ["beginner", "intermediate", "advanced"] },
  readingGrade: Number,
  vocabularyComplexity: String,
  technicalDensity: String
},
summaries: {
  tldr: String,
  bulletPoints: [String],
  summary100: String,
  oneLiner: String
}
```

#### Flow
```
User clicks Publish
  → BullMQ job queued: "pipeline-job"
  → Worker runs agents in sequence:
    1. Grammar Agent → grammar score + issues
    2. SEO Agent → SEO score + metadata
    3. Tag Generator → tags + difficulty
    4. Summary Generator → multi-format summaries
    5. Difficulty Detector → difficulty level + metrics
  → All results saved to Post document
  → Then embedding job triggered (Feature 1)
  → Post published
```

#### Frontend Changes
- `CreatePostHandler.jsx` — after publish, show "Processing article..." indicator
- `ReadMorePost.jsx` — show grammar score badge, SEO score badge, difficulty badge
- New component: `ArticleInsights.jsx` — shows grammar issues, SEO suggestions, difficulty info

---

### Feature 3: Semantic Search
**Priority: P1 — High impact, uses existing embeddings**
**Depends on: Feature 1**
**Estimated effort: Medium**

#### What
Replace keyword-based search with vector similarity search. User types "How do I deploy Node on AWS" and gets results about Docker on EC2, Nginx config, AWS setup — even if those words aren't exact matches.

#### Backend Changes
- `backend/controllers/Search.js` — new controller
  - `semanticSearch(query)` — embed query → search Qdrant → return top 20 articles with scores
- `backend/routes/Search.routes.js` — new route file
- `backend/services/searchService.js` — orchestrates embed → search → deduplicate → format

#### Flow
```
User types query
  → Embed query text via Gemini
  → Search Qdrant for top 20 similar chunks
  → Deduplicate by articleId (keep highest scoring chunk per article)
  → Populate article metadata from MongoDB
  → Return ranked articles with match scores
```

#### API
```
GET /api/v1/search/semantic?q=how+to+deploy+node+on+aws
Response: {
  results: [
    { article: {...}, score: 0.89, matchedChunk: "..." }
  ]
}
```

#### Frontend Changes
- `Home.jsx` — add toggle between "Keyword" and "AI Search" modes
- Search results show match score badge
- Highlight matched chunks in results

---

### Feature 4: Multi-Document RAG Chat
**Priority: P1 — Platform-wide AI assistant**
**Depends on: Feature 1, Feature 3**
**Estimated effort: Large**

#### What
A chat interface where users can ask questions and get answers sourced from across all published articles on the platform, with citations.

#### Backend Changes
- `backend/controllers/RagChat.js` — new controller
  - `askQuestion(userId, question)` — embed question → vector search → build context → generate answer with Gemini → return answer + citations
- `backend/routes/RagChat.routes.js` — new route file
- `backend/services/ragService.js` — orchestrates the RAG pipeline
- `backend/models/chatHistory.js` — store chat sessions

#### Chat History Model
```javascript
{
  user: ObjectId (ref: User),
  sessions: [{
    title: String,
    messages: [{
      role: String (enum: "user" | "assistant"),
      content: String,
      citations: [{
        articleId: ObjectId,
        articleTitle: String,
        chunkText: String,
        score: Number
      }],
      createdAt: Date
    }],
    createdAt: Date
  }]
}
```

#### Flow
```
User asks: "How do I deploy NodeJS on AWS?"
  → Embed question via Gemini
  → Search Qdrant for top 10 relevant chunks
  → Build context prompt with chunks + metadata
  → Call Gemini: "Answer based on these sources. Cite them."
  → Parse response for answer + citation references
  → Save to chat history
  → Return { answer, citations[] }
```

#### API
```
POST /api/v1/ragchat/ask
Body: { question, sessionId? }
Response: {
  answer: "According to [Deploy Node on EC2](/readmore/xxx)...",
  citations: [{ articleId, title, chunk, score }],
  sessionId: "..."
}

GET /api/v1/ragchat/history/:sessionId
GET /api/v1/ragchat/sessions
```

#### Frontend
- New page: `RagChat.jsx` — chat interface with message bubbles
- Citations are clickable → open article at exact paragraph
- New component: `CitationCard.jsx` — compact article preview shown inline

---

### Feature 5: AI Reader Assistant
**Priority: P1 — Per-article AI**
**Depends on: Feature 1**
**Estimated effort: Medium**

#### What
While reading an article, users can ask AI questions about that specific article. Uses only the current article's chunks.

#### Backend Changes
- `backend/controllers/ReaderAssistant.js` — new controller
  - `askAboutArticle(articleId, question)` — fetch article chunks from Qdrant → build context → generate answer
- `backend/routes/ReaderAssistant.routes.js`

#### Flow
```
User clicks "Ask AI" on article page
  → Types: "Explain this code block"
  → Fetch article's chunks from Qdrant (filter by articleId)
  → Build context: article chunks + user question
  → Call Gemini with article-specific system prompt
  → Return answer
```

#### API
```
POST /api/v1/reader/ask
Body: { articleId, question }
Response: { answer: "..." }

POST /api/v1/reader/summarize
Body: { articleId, type: "bullet" | "100word" | "oneliner" | "eli5" }
Response: { summary: "..." }
```

#### Frontend
- `ReadMorePost.jsx` — add "Ask AI" button in the article area
- New component: `ReaderAssistant.jsx` — floating chat panel on the right side (below comments)
- Preset actions: "Summarize", "Explain like I'm 12", "Key takeaways", "Find code examples"

---

### Feature 6: AI Trend Detection
**Priority: P2 — Replaces current trending**
**Depends on: Feature 1**
**Estimated effort: Medium**

#### What
Replace simple like+view counting with a multi-signal trending algorithm that considers engagement depth, read completion, sentiment, and freshness.

#### Signals to Collect
- Views, Likes, Comments, Bookmarks
- Reading completion % (how far users read)
- Average read time vs estimated read time
- Share count
- Search appearances
- Comment sentiment (positive/neutral/negative)

#### Trending Score Formula
```
TrendingScore =
  0.35 × Engagement     (likes + bookmarks + comments weighted)
+ 0.20 × ReadCompletion (% of readers who finished)
+ 0.20 × GrowthRate     (velocity of new engagement in last 24h vs previous)
+ 0.15 × Sentiment      (positive comment ratio)
+ 0.10 × Freshness      (time decay function)
```

#### Backend Changes
- `backend/services/trendCalculator.js` — calculates trending score per post
- `backend/workers/trendWorker.js` — scheduled BullMQ job (runs every hour)
- `backend/controllers/Post.js` — `getTrendingPosts` uses new score
- `backend/models/post.js` — add `trendingScore`, `readCompletionRate`, `engagementVelocity`
- `backend/models/analytics.js` — new model for tracking granular events

#### Analytics Event Model
```javascript
{
  post: ObjectId,
  user: ObjectId,
  events: [{
    type: String (enum: "view" | "like" | "bookmark" | "comment" | "share" | "read_progress"),
    value: Number,      // e.g., read_completion percentage
    sentiment: String,  // for comments: "positive" | "neutral" | "negative"
    createdAt: Date
  }]
}
```

#### API
```
GET /api/v1/post/trending
  → Returns posts sorted by TrendingScore
  → Cached in Redis for 5 minutes
```

---

### Feature 7: AI Analytics Dashboard
**Priority: P2 — Author value**
**Depends on: Feature 1, Feature 6**
**Estimated effort: Large**

#### What
Every author gets a personal analytics dashboard with AI-generated insights about their content performance.

#### Dashboard Cards
- Views (total + unique)
- Followers gained
- Bookmarks
- Comments
- Read completion rate
- Average read time
- Growth rate (week over week)
- Returning readers

#### AI Insights (generated weekly via cron job)
- "Your readers mostly stop reading after paragraph 6"
- "Posts with code examples perform 42% better"
- "React articles receive more bookmarks than Docker"
- "Weekend posts perform worse than weekday posts"
- "Your average article is too long for your audience"

#### Backend Changes
- `backend/controllers/Analytics.js` — new controller
  - `getAuthorDashboard(authorId)` — aggregated stats
  - `getAIInsights(authorId)` — generate insights from analytics data
  - `getPostAnalytics(postId)` — per-post deep dive
- `backend/routes/Analytics.routes.js`
- `backend/services/analyticsAggregator.js` — MongoDB aggregation pipelines
- `backend/workers/insightWorker.js` — weekly cron job to generate insights
- `backend/models/insight.js` — store generated insights

#### API
```
GET /api/v1/analytics/dashboard
Response: {
  stats: { views, uniqueReaders, followers, bookmarks, ... },
  weeklyTrend: [...],
  topPosts: [...],
  insights: ["...", "..."]
}

GET /api/v1/analytics/post/:postId
Response: {
  stats: { views, readCompletion, avgReadTime, ... },
  engagementTimeline: [...],
  readerDropoff: [{ paragraph: 1, completionRate: 100 }, ...]
}
```

#### Frontend
- New page: `Analytics.jsx` — dashboard with charts (use recharts or chart.js)
- New component: `StatCard.jsx` — individual metric card
- New component: `InsightCard.jsx` — AI insight with sparkle icon
- New component: `EngagementChart.jsx` — line/bar chart for trends
- Sidebar nav: add "Analytics" link (visible to logged-in users)

---

### Feature 8: AI Podcast
**Priority: P2 — Portfolio showcase**
**Depends on: Feature 1**
**Estimated effort: Large**

#### What
Convert any article into a two-person podcast conversation. Generate a natural dialogue between a Host and Guest, then convert to audio via TTS.

#### Backend Changes
- `backend/services/podcastGenerator.js` — orchestrates the pipeline
- `backend/services/conversationGenerator.js` — uses Gemini to create Host/Guest dialogue
- `backend/services/ttsService.js` — calls TTS API (ElevenLabs/Google)
- `backend/workers/podcastWorker.js` — BullMQ worker
- `backend/models/post.js` — add `podcast: { status, audioUrl, duration }`

#### Conversation Generation
```
Input: article content + summary
System prompt: "You are creating a podcast conversation between two speakers.
  Host: leads the discussion, asks questions, keeps it engaging.
  Guest: explains technical concepts, gives examples.

  Rules:
  - 5-10 minutes of dialogue (1000-2000 words)
  - Natural conversational tone
  - Cover all major points from the article
  - Include banter and personality
  - Format: [Host]: text / [Guest]: text"

Output: [
  { speaker: "Host", text: "Today we're discussing Docker..." },
  { speaker: "Guest", text: "Great topic! So containers are basically..." },
  ...
]
```

#### TTS Options
1. **ElevenLabs** — best quality, two distinct voices, costs money
2. **Google Cloud TTS** — cheaper, decent quality
3. **OpenAI TTS** — good quality, supports multiple voices

#### API
```
POST /api/v1/podcast/generate
Body: { articleId }
Response: { jobId: "...", status: "processing" }

GET /api/v1/podcast/:articleId
Response: { status, audioUrl, duration, transcript[] }

GET /api/v1/podcast/status/:jobId
Response: { status, progress }
```

#### Frontend
- `ReadMorePost.jsx` — add "Listen as Podcast" button
- New component: `PodcastPlayer.jsx` — audio player with transcript, speaker labels, timestamps
- New page: `Podcast.jsx` — standalone podcast player page

---

### Feature 9: Enhanced Recommendations
**Priority: P1**
**Depends on: Feature 1**
**Estimated effort: Medium**

#### What
Replace the current category/tag overlap recommendation with vector-similarity-based recommendations.

#### Backend Changes
- `backend/services/recommendationService.js`
  - `getRelatedArticles(articleId)` — fetch article embedding → search Qdrant for similar → return top 5
  - `getPersonalizedFeed(userId)` — combine user's reading history embeddings with article embeddings
- `backend/controllers/Post.js` — update `getRelatedPosts` to use vector search

#### API
```
GET /api/v1/post/related/:id
  → Now uses vector similarity instead of category/tag overlap
  → Falls back to category/tag if embedding not available
```

---

## Implementation Order

| Phase | Feature | Depends On | Priority |
|-------|---------|------------|----------|
| **Phase 1** | Feature 1: Vector DB + Embedding Pipeline | — | P0 |
| **Phase 2** | Feature 2: AI Publishing Pipeline | Feature 1 | P0 |
| **Phase 3** | Feature 3: Semantic Search | Feature 1 | P1 |
| **Phase 3** | Feature 9: Enhanced Recommendations | Feature 1 | P1 |
| **Phase 4** | Feature 5: AI Reader Assistant | Feature 1 | P1 |
| **Phase 4** | Feature 4: Multi-Document RAG Chat | Feature 1, 3 | P1 |
| **Phase 5** | Feature 6: AI Trend Detection | Feature 1 | P2 |
| **Phase 6** | Feature 7: AI Analytics Dashboard | Feature 1, 6 | P2 |
| **Phase 6** | Feature 8: AI Podcast | Feature 1 | P2 |

### Phase 1 (Start Here)
Set up the foundation. Once this is done, every subsequent feature can be built on top.

```
Qdrant Docker container
  → Chunker service
  → Embedder service (Gemini)
  → Vector store service
  → BullMQ job queue + Redis
  → Embedding worker
  → Trigger on publish
```

### Phase 2
The publishing pipeline. Articles get enriched with grammar, SEO, tags, summaries, difficulty scores.

### Phase 3
Search and discovery. Semantic search replaces keyword search. Recommendations use vectors.

### Phase 4
AI interaction features. Reader can chat with articles. Platform-wide RAG chat.

### Phase 5-6
Intelligence layer. Trending, analytics, podcast.

---

## Key Architecture Decisions

1. **Qdrant over Pinecone/Chroma** — Open source, Docker-friendly, self-hosted, great for portfolio
2. **BullMQ over cron-only** — Job queue gives retries, monitoring, concurrency control, delayed jobs
3. **Gemini for embeddings** — Free tier available, 3072 dimensions, good quality
4. **Groq as fallback** — Already integrated, use for tasks where Gemini is overkill
5. **All pipeline results on Post model** — Avoids extra lookups, keeps reads fast
6. **Chunk size: 500 tokens** — Good balance between context and precision for retrieval

---

## Environment Variables to Add

```env
# Qdrant
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your-qdrant-api-key

# Gemini (for embeddings + generation)
GEMINI_API_KEY=your-gemini-api-key

# TTS (for podcast)
ELEVENLABS_API_KEY=your-elevenlabs-key

# BullMQ (uses existing Redis)
BULLMQ_CONNECTION=redis://localhost:6379
```

---

## File Structure (New)

```
backend/
├── configuration/
│   └── qdrant.js                    # Qdrant client
├── services/
│   ├── chunker.js                   # Text chunking
│   ├── embedder.js                  # Gemini embedding API
│   ├── vectorStore.js               # Qdrant CRUD
│   ├── aiPipeline.js                # Publishing pipeline orchestrator
│   ├── searchService.js             # Semantic search
│   ├── ragService.js                # RAG chat pipeline
│   ├── recommendationService.js     # Vector recommendations
│   ├── trendCalculator.js           # Trending score calculation
│   ├── analyticsAggregator.js       # Analytics aggregation
│   ├── podcastGenerator.js          # Podcast pipeline
│   ├── conversationGenerator.js     # Host/Guest dialogue
│   └── ttsService.js                # Text-to-speech
├── workers/
│   ├── embeddingWorker.js
│   ├── pipelineWorker.js
│   ├── trendWorker.js
│   ├── insightWorker.js
│   └── podcastWorker.js
├── queues/
│   ├── embeddingQueue.js
│   ├── pipelineQueue.js
│   ├── trendQueue.js
│   └── podcastQueue.js
├── controllers/
│   ├── Search.js
│   ├── RagChat.js
│   ├── ReaderAssistant.js
│   └── Analytics.js
├── models/
│   ├── chatHistory.js
│   ├── insight.js
│   └── analytics.js
└── routes/
    ├── Search.routes.js
    ├── RagChat.routes.js
    ├── ReaderAssistant.routes.js
    └── Analytics.routes.js

frontend/
├── src/
│   ├── pages/
│   │   ├── Analytics.jsx
│   │   ├── RagChat.jsx
│   │   └── Podcast.jsx
│   └── components/
│       ├── ArticleInsights.jsx
│       ├── ReaderAssistant.jsx
│       ├── PodcastPlayer.jsx
│       ├── CitationCard.jsx
│       ├── StatCard.jsx
│       ├── InsightCard.jsx
│       └── EngagementChart.jsx
```
