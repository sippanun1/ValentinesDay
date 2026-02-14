interface Comment {
  id: string
  commenter_name: string
  comment_text: string
  created_at: string
  is_anonymous: boolean
}

interface CommentListProps {
  comments: Comment[]
}

export default function CommentList({ comments }: CommentListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (comments.length === 0) {
    return <div className="no-comments">No comments yet. Be the first to comment!</div>
  }

  return (
    <div className="comments-list">
      {comments.map((comment) => (
        <div key={comment.id} className="comment-item">
          <div className="comment-header">
            <span className="commenter-name">
              {comment.is_anonymous ? '👤 ' : ''}{comment.commenter_name}
            </span>
            <span className="comment-date">{formatDate(comment.created_at)}</span>
          </div>
          <p className="comment-text">{comment.comment_text}</p>
        </div>
      ))}
    </div>
  )
}
