import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import CommentForm from './CommentForm'
import CommentList from './CommentList'
import LikeButton from './LikeButton'

interface Comment {
  id: string
  commenter_name: string
  comment_text: string
  created_at: string
  is_anonymous: boolean
}

interface ImageCardProps {
  imageId: string
  imageUrl: string
  galleryUploaderName: string
  onCommentAdded: () => void
}

export default function ImageCard({
  imageId,
  imageUrl,
  galleryUploaderName,
  onCommentAdded,
}: ImageCardProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [likes, setLikes] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComments()
    fetchLikes()
  }, [imageId])

  const fetchComments = async () => {
    try {
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('image_id', imageId)
        .order('created_at', { ascending: false })

      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLikes = async () => {
    try {
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact' })
        .eq('image_id', imageId)

      setLikes(count || 0)
    } catch (error) {
      console.error('Error fetching likes:', error)
    }
  }

  const handleCommentAdded = () => {
    fetchComments()
    onCommentAdded()
  }

  return (
    <div className="image-card">
      <div className="image-wrapper">
        <img src={imageUrl} alt="Valentine photo" className="card-image" />
      </div>
      <div className="card-content">
        <div className="card-header">
          <span className="uploader-name">📸 {galleryUploaderName}</span>
        </div>
        <div className="card-actions">
          <LikeButton imageId={imageId} initialLikes={likes} onLikesUpdate={fetchLikes} />
          <button
            onClick={() => setShowComments(!showComments)}
            className="comments-toggle"
          >
            💬 {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </button>
        </div>
        {showComments && (
          <div className="comments-section">
            <CommentForm imageId={imageId} onCommentAdded={handleCommentAdded} />
            {!loading && <CommentList comments={comments} />}
          </div>
        )}
      </div>
    </div>
  )
}
