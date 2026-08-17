import React, { useEffect, useState } from 'react'
import { usePostStore } from '../store/PostStore'
import { useNavigate } from 'react-router-dom'
import { usePageStore } from '../store/PageStore'
// eslint-disable-next-line no-unused-vars
import { Loader } from 'lucide-react'
// eslint-disable-next-line no-unused-vars
import { truncateContent } from '../lib/utils'

const RelatedBlogs = ({ postId }) => {
  const { getRelatedPosts } = usePostStore()
  const { setCurrentPage } = usePageStore()
  const navigate = useNavigate()
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!postId || (typeof postId === "string" && postId.startsWith("seed-"))) {
      setRelated([]);
      return;
    }
    const fetchRelated = async () => {
      setLoading(true);
      const posts = await getRelatedPosts(postId);
      setRelated(Array.isArray(posts) ? posts : []);
      setLoading(false);
    };
    fetchRelated();
  }, [postId, getRelatedPosts]);

  const handleReadMore = (id) => {
    setCurrentPage("ReadMore")
    navigate(`/readmore/${id}`)
  }

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-lg font-bold accent-text mb-4">
          <span className="accent-underline">More Similar Blogs</span> you may like
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scroll">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[260px] h-[180px] rounded-xl accent-border border animate-pulse accent-bg-mode" />
          ))}
        </div>
      </div>
    )
  }

  if (related.length === 0) return null

  return (
    <div className="py-8">
      <h2 className="text-lg font-bold accent-text mb-4">
        <span className="accent-underline">More Similar Blogs</span> you may like
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scroll">
        {related.map((post) => (
          <div
            key={post._id}
            onClick={() => handleReadMore(post._id)}
            className="min-w-[260px] max-w-[260px] rounded-xl overflow-hidden border accent-border shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer accent-bg-mode flex flex-col"
          >
            <div className="h-32 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 flex flex-col flex-1">
              <div className="flex gap-1 mb-1.5 flex-wrap">
                {(post.categoryData || []).slice(0, 2).map((cat, i) => (
                  <span
                    key={i}
                    className="text-[0.55rem] uppercase tracking-wide border accent-border rounded-md px-1 py-[0.1rem] font-medium"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
              <h3 className="text-sm font-semibold accent-text line-clamp-2 leading-snug">
                {post.title}
              </h3>
              <div className="mt-auto pt-2 flex items-center justify-between text-[0.7rem] accent-text-mode opacity-70">
                <span>{post.authorData?.firstName} {post.authorData?.lastName}</span>
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RelatedBlogs
