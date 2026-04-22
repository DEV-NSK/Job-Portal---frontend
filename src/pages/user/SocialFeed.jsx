import { useState, useEffect, useRef } from 'react'
import { postsAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { FiHeart, FiMessageCircle, FiSend, FiTrash2, FiImage, FiX } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'
import { getImageUrl } from '../../utils/imageUtils'

function PostCard({ post, currentUser, onDelete, onLike }) {
  const [comments, setComments] = useState([])
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [liked, setLiked] = useState(post.likes?.includes(currentUser?._id))
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0)
  const [loadingComments, setLoadingComments] = useState(false)

  const toggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true)
      try {
        const res = await postsAPI.getComments(post._id)
        setComments(res.data)
      } catch {} finally { setLoadingComments(false) }
    }
    setShowComments(!showComments)
  }

  const handleLike = async () => {
    try {
      const res = await postsAPI.like(post._id)
      setLiked(res.data.liked)
      setLikeCount(res.data.likes)
    } catch {}
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    try {
      const res = await postsAPI.addComment(post._id, { content: commentText })
      setComments(prev => [...prev, res.data])
      setCommentText('')
    } catch { toast.error('Failed to add comment') }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await postsAPI.deleteComment(commentId)
      setComments(prev => prev.filter(c => c._id !== commentId))
    } catch {}
  }

  return (
    <div className="card animate-slide-up">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold text-sm overflow-hidden flex-shrink-0">
            {post.author?.avatar ? <img src={getImageUrl(post.author.avatar)} alt="" className="w-full h-full object-cover" /> : post.author?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{post.author?.name}</p>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${post.author?.role === 'employer' ? 'text-accent-400' : 'text-primary-400'}`}>
                {post.author?.role === 'employer' ? '🏢 Employer' : '👤 Job Seeker'}
              </span>
              <span className="text-gray-600 text-xs">·</span>
              <span className="text-gray-500 text-xs">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
        {(currentUser?._id === post.author?._id || currentUser?.role === 'admin') && (
          <button onClick={() => onDelete(post._id)} className="text-gray-600 hover:text-red-400 transition-colors p-1">
            <FiTrash2 size={15} />
          </button>
        )}
      </div>

      <p className="mt-4 text-gray-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
      {post.image && (
        <img src={getImageUrl(post.image)} alt="" className="mt-4 rounded-xl w-full object-cover max-h-80 border border-gray-800" />
      )}

      <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-4">
        <button onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-all hover:scale-110 ${liked ? 'text-red-400' : 'text-gray-500 hover:text-red-400'}`}>
          <FiHeart size={16} className={liked ? 'fill-current' : ''} /> {likeCount}
        </button>
        <button onClick={toggleComments}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-400 transition-colors">
          <FiMessageCircle size={16} /> {post.commentsCount || 0}
        </button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-3 animate-fade-in">
          {loadingComments ? (
            <div className="flex justify-center py-4">
              <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            comments.map(c => (
              <div key={c._id} className="flex items-start gap-2.5 group">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-600/50 to-accent-600/50 flex items-center justify-center text-xs font-bold flex-shrink-0 overflow-hidden">
                  {c.author?.avatar ? <img src={getImageUrl(c.author.avatar)} alt="" className="w-full h-full object-cover" /> : c.author?.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 bg-gray-800/50 rounded-xl px-3 py-2">
                  <p className="text-xs font-semibold text-gray-300">{c.author?.name}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{c.content}</p>
                </div>
                {(currentUser?._id === c.author?._id || currentUser?.role === 'admin') && (
                  <button onClick={() => handleDeleteComment(c._id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all p-1">
                    <FiTrash2 size={12} />
                  </button>
                )}
              </div>
            ))
          )}
          <form onSubmit={handleComment} className="flex gap-2 mt-3">
            <input className="input-field text-sm py-2" placeholder="Write a comment..."
              value={commentText} onChange={e => setCommentText(e.target.value)} />
            <button type="submit" className="btn-primary py-2 px-3">
              <FiSend size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default function SocialFeed() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [posting, setPosting] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    postsAPI.getAll().then(res => setPosts(res.data.posts)).finally(() => setLoading(false))
  }, [])

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handlePost = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setPosting(true)
    try {
      const fd = new FormData()
      fd.append('content', content)
      if (imageFile) fd.append('image', imageFile)
      const res = await postsAPI.create(fd)
      setPosts(prev => [res.data, ...prev])
      setContent('')
      setImageFile(null)
      setImagePreview(null)
      toast.success('Post created!')
    } catch { toast.error('Failed to create post') }
    finally { setPosting(false) }
  }

  const handleDelete = async (id) => {
    try {
      await postsAPI.delete(id)
      setPosts(prev => prev.filter(p => p._id !== id))
      toast.success('Post deleted')
    } catch {}
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-2xl mx-auto">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-white">Community Feed</h1>
          <p className="text-gray-400 mt-1">Connect with professionals</p>
        </div>

        {/* Create Post */}
        <div className="card mb-6">
          <form onSubmit={handlePost}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold text-sm overflow-hidden flex-shrink-0">
                {user?.avatar ? <img src={getImageUrl(user.avatar)} alt="" className="w-full h-full object-cover" /> : user?.name?.[0]?.toUpperCase()}
              </div>
              <textarea rows={3} placeholder="Share something with the community..."
                className="input-field resize-none flex-1"
                value={content} onChange={e => setContent(e.target.value)} />
            </div>
            {imagePreview && (
              <div className="relative mt-3 ml-13">
                <img src={imagePreview} alt="" className="rounded-xl max-h-48 object-cover border border-gray-700" />
                <button type="button" onClick={() => { setImageFile(null); setImagePreview(null) }}
                  className="absolute top-2 right-2 w-6 h-6 bg-gray-900/80 rounded-full flex items-center justify-center text-gray-300 hover:text-white">
                  <FiX size={12} />
                </button>
              </div>
            )}
            <div className="flex items-center justify-between mt-3">
              <button type="button" onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors text-sm">
                <FiImage size={16} /> Photo
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              <button type="submit" disabled={posting || !content.trim()} className="btn-primary py-2 px-5 text-sm flex items-center gap-2">
                {posting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSend size={14} />}
                Post
              </button>
            </div>
          </form>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="skeleton h-40 rounded-2xl" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
            <p className="text-gray-400">Be the first to share something!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard key={post._id} post={post} currentUser={user} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
