import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { FiTrash2, FiHeart, FiMessageCircle, FiCalendar } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'

export default function AdminManagePosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.getPosts().then(res => setPosts(res.data)).finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this post and all its comments?')) return
    try {
      await adminAPI.deletePost(id)
      setPosts(prev => prev.filter(p => p._id !== id))
      toast.success('Post deleted')
    } catch { toast.error('Failed to delete') }
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-white">Manage Posts</h1>
          <p className="text-gray-400 mt-1">{posts.length} posts</p>
        </div>

        {loading ? (
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-36 rounded-2xl" />)}</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white">No posts found</h3>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post._id} className="card animate-slide-up">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center font-bold text-sm overflow-hidden flex-shrink-0">
                      {post.author?.avatar ? <img src={post.author.avatar} alt="" className="w-full h-full object-cover" /> : post.author?.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-white text-sm">{post.author?.name}</p>
                        <span className={`badge text-xs ${post.author?.role === 'employer' ? 'badge-purple' : 'badge-blue'}`}>
                          {post.author?.role}
                        </span>
                        <span className="text-gray-500 text-xs flex items-center gap-1">
                          <FiCalendar size={10} />{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mt-2 line-clamp-3">{post.content}</p>
                      {post.image && (
                        <img src={post.image} alt="" className="mt-2 rounded-lg max-h-32 object-cover border border-gray-800" />
                      )}
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><FiHeart size={11} />{post.likes?.length || 0} likes</span>
                        <span className="flex items-center gap-1"><FiMessageCircle size={11} />{post.commentsCount || 0} comments</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(post._id)}
                    className="p-2.5 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
