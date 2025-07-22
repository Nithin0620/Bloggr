import React, { useEffect,useState } from 'react'
import DevToPostCard from './DevToPostCard'
import { usePostStore } from '../store/PostStore'

const ArroundTheWorld = () => {

  const [blogs, setBlogs] = useState([]);
  const [ loading,setLoading] = useState(false);

  const fetchTechArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://dev.to/api/articles?tag=technology&per_page=100");
      if (!response.ok) throw new Error("Failed to fetch articles");

      const data = await response.json();
      setBlogs(data); 
    } catch (error) {
      console.error("Error fetching tech articles:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTechArticles();
  }, []);

  if(loading) return <div className='flex h-[70vh] justify-center items-center'><div className='spinner'></div></div>
  
  return (
    <div>
      <div className="w-full px-2">
      {blogs.map((post) => (
        <DevToPostCard key={post.id} post={post} />
      ))}
    </div>
    </div>
  )
}

export default ArroundTheWorld
