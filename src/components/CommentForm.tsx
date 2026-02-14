import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface CommentFormProps {
  imageId: string
  onCommentAdded: () => void
}

export default function CommentForm({ imageId, onCommentAdded }: CommentFormProps) {
  const [comment, setComment] = useState('')
  const [name, setName] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!comment.trim()) {
      alert('Please enter a comment')
      return
    }

    if (!isAnonymous && !name.trim()) {
      alert('Please enter your name or choose anonymous')
      return
    }

    setLoading(true)
    try {
      await supabase.from('comments').insert({
        image_id: imageId,
        comment_text: comment,
        commenter_name: isAnonymous ? 'Anonymous' : name,
        is_anonymous: isAnonymous,
      })

      setComment('')
      setName('')
      setIsAnonymous(false)
      onCommentAdded()
    } catch (error) {
      console.error('Error adding comment:', error)
      alert('Error adding comment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      {!isAnonymous && (
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading || isAnonymous}
          className="input-field"
        />
      )}
      <textarea
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={loading}
        className="comment-textarea"
        rows={3}
      />
      <div className="comment-form-footer">
        <label className="anonymous-checkbox">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            disabled={loading}
          />
          <span>Post as Anonymous</span>
        </label>
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  )
}
