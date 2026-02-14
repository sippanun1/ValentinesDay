import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ImageCard from './ImageCard'
import GalleryFullView from './GalleryFullView'

interface Image {
  id: string
  image_url: string
  gallery_id: string
  file_path: string
}

interface Gallery {
  id: string
  uploader_name: string
  created_at: string
}

interface GalleryWithImages extends Gallery {
  images: Image[]
}

interface GalleryProps {
  refreshTrigger: number
}

export default function Gallery({ refreshTrigger }: GalleryProps) {
  const [galleries, setGalleries] = useState<GalleryWithImages[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGallery, setSelectedGallery] = useState<GalleryWithImages | null>(null)

  useEffect(() => {
    fetchGalleries()
  }, [refreshTrigger])

  const fetchGalleries = async () => {
    setLoading(true)
    try {
      const { data: galleriesData } = await supabase
        .from('galleries')
        .select('*')
        .order('created_at', { ascending: false })

      if (galleriesData) {
        const galleriesWithImages = await Promise.all(
          galleriesData.map(async (gallery: Gallery) => {
            const { data: images } = await supabase
              .from('images')
              .select('*')
              .eq('gallery_id', gallery.id)
              .order('created_at', { ascending: false })

            return {
              ...gallery,
              images: images || [],
            }
          })
        )

        setGalleries(galleriesWithImages)
      }
    } catch (error) {
      console.error('Error fetching galleries:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading galleries...</div>
  }

  if (selectedGallery) {
    return (
      <GalleryFullView
        uploaderName={selectedGallery.uploader_name}
        images={selectedGallery.images}
        galleryId={selectedGallery.id}
        onBack={() => setSelectedGallery(null)}
        onImageAdded={fetchGalleries}
      />
    )
  }

  if (galleries.length === 0) {
    return (
      <div className="empty-state">
        <p>No galleries yet. Be the first to share your Valentine's photos! ❤️</p>
      </div>
    )
  }

  return (
    <div className="gallery-container">
      {galleries.map((gallery) => (
        <div key={gallery.id} className="gallery-section">
          <div className="gallery-header">
            <h2>📸 {gallery.uploader_name}'s Gallery</h2>
            <button
              className="view-all-btn"
              onClick={() => setSelectedGallery(gallery)}
            >
              View All ({gallery.images.length})
            </button>
          </div>
          <div className="gallery-grid">
            {gallery.images.map((image) => (
              <ImageCard
                key={image.id}
                imageId={image.id}
                imageUrl={image.image_url}
                galleryUploaderName={gallery.uploader_name}
                onCommentAdded={fetchGalleries}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
