import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface LikeButtonProps {
  imageId: string
  initialLikes: number
  onLikesUpdate: () => void
}

export default function LikeButton({ imageId, initialLikes, onLikesUpdate }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [hasLiked, setHasLiked] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    setLoading(true)
    try {
      if (hasLiked) {
        // Unlike
        await supabase.from('likes').delete().eq('image_id', imageId).eq('ip_hash', getIPHash())
        setLikes((prev) => Math.max(0, prev - 1))
        setHasLiked(false)
      } else {
        // Like
        await supabase.from('likes').insert({
          image_id: imageId,
          ip_hash: getIPHash(),
        })
        setLikes((prev) => prev + 1)
        setHasLiked(true)
      }
      onLikesUpdate()
    } catch (error) {
      console.error('Error updating like:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`like-button ${hasLiked ? 'liked' : ''}`}
    >
      <span className="like-icon">❤️</span>
      <span className="like-count">{likes}</span>
    </button>
  )
}

// Simple IP hash for tracking unique likes (without storing actual IPs)
function getIPHash() {
  let hash = localStorage.getItem('valentine-ip-hash')
  if (!hash) {
    hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    localStorage.setItem('valentine-ip-hash', hash)
  }
  return hash
}
