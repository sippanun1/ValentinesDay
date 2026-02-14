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
  const [collapsedGalleries, setCollapsedGalleries] = useState<Set<string>>(new Set())

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

  const toggleCollapsed = (galleryId: string) => {
    const newCollapsed = new Set(collapsedGalleries)
    if (newCollapsed.has(galleryId)) {
      newCollapsed.delete(galleryId)
    } else {
      newCollapsed.add(galleryId)
    }
    setCollapsedGalleries(newCollapsed)
  }

  const handleDeleteGallery = async (galleryId: string, uploaderName: string) => {
    if (!confirm(`Are you sure you want to delete ${uploaderName}'s entire gallery? This will delete all images and comments.`)) {
      return
    }

    try {
      // Get all images in the gallery to delete from storage
      const { data: images } = await supabase
        .from('images')
        .select('file_path')
        .eq('gallery_id', galleryId)

      // Delete files from storage
      if (images && images.length > 0) {
        const filePaths = images.map((img: { file_path: string }) => img.file_path)
        await supabase.storage
          .from('valentine-images')
          .remove(filePaths)
      }

      // Delete gallery (cascade will delete images and comments)
      const { error } = await supabase
        .from('galleries')
        .delete()
        .eq('id', galleryId)

      if (error) throw error

      alert('Gallery deleted successfully!')
      fetchGalleries()
    } catch (error) {
      console.error('Error deleting gallery:', error)
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      alert(`Error deleting gallery: ${errorMsg}`)
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
        <div key={gallery.id} className={`gallery-section ${collapsedGalleries.has(gallery.id) ? 'collapsed' : ''}`}>
          <div className="gallery-header">
            <h2>📸 {gallery.uploader_name}'s Gallery</h2>
            <div className="gallery-header-actions">
              <button
                className="view-all-btn"
                onClick={() => setSelectedGallery(gallery)}
              >
                View All ({gallery.images.length})
              </button>
              <button
                className="collapse-gallery-btn"
                onClick={() => toggleCollapsed(gallery.id)}
                title={collapsedGalleries.has(gallery.id) ? 'Expand' : 'Collapse'}
              >
                {collapsedGalleries.has(gallery.id) ? '▲' : '▼'}
              </button>
              <button
                className="delete-gallery-btn"
                onClick={() => handleDeleteGallery(gallery.id, gallery.uploader_name)}
                title="Delete entire gallery"
              >
                🗑️
              </button>
            </div>
          </div>
          {!collapsedGalleries.has(gallery.id) && (
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
          )}
        </div>
      ))}
    </div>
  )
}
