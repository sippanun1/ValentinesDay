import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface Image {
  id: string
  image_url: string
  file_path: string
}

interface GalleryFullViewProps {
  uploaderName: string
  images: Image[]
  galleryId: string
  onBack: () => void
  onImageAdded: () => void
}

const backgroundOptions = [
  { name: 'Purple Gradient', class: 'bg-purple-gradient' },
  { name: 'Red Gradient', class: 'bg-red-gradient' },
  { name: 'Pink Gradient', class: 'bg-pink-gradient' },
  { name: 'Blue Gradient', class: 'bg-blue-gradient' },
  { name: 'White', class: 'bg-white' },
  { name: 'Black', class: 'bg-black' },
  { name: 'Gold', class: 'bg-gold' },
]

export default function GalleryFullView({
  uploaderName,
  images,
  galleryId,
  onBack,
  onImageAdded,
}: GalleryFullViewProps) {
  const [selectedBg, setSelectedBg] = useState('bg-purple-gradient')
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const files = Array.from(e.target.files)
    setUploading(true)

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${galleryId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('valentine-images')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('valentine-images')
          .getPublicUrl(fileName)

        await supabase.from('images').insert({
          gallery_id: galleryId,
          image_url: data.publicUrl,
          file_path: fileName,
        })
      }

      onImageAdded()
    } catch (error) {
      console.error('Error adding images:', error)
      alert('Error adding images')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDeleteImage = async (imageId: string, filePath: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    setDeleting(imageId)
    try {
      // Delete from storage
      await supabase.storage.from('valentine-images').remove([filePath])

      // Delete from database
      await supabase.from('images').delete().eq('id', imageId)

      onImageAdded()
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Error deleting image')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className={`gallery-fullview ${selectedBg}`}>
      <div className="gallery-header-top">
        <button onClick={onBack} className="back-button">
          ← Back
        </button>
        <h1 className="gallery-title">💝 {uploaderName}'s Gallery 💝</h1>
      </div>

      <div className="bg-selector">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <p style={{ margin: 0 }}>Pick a background:</p>
          <label className="add-images-btn">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleAddImages}
              disabled={uploading}
              style={{ display: 'none' }}
            />
            <span>+ Add More Images</span>
          </label>
        </div>
        <div className="bg-options">
          {backgroundOptions.map((bg) => (
            <button
              key={bg.class}
              className={`bg-option ${selectedBg === bg.class ? 'active' : ''}`}
              onClick={() => setSelectedBg(bg.class)}
              title={bg.name}
            >
              {bg.name}
            </button>
          ))}
        </div>
      </div>

      <div className="gallery-images-grid">
        {images.map((image) => (
          <div
            key={image.id}
            className="gallery-grid-item-wrapper"
            onClick={() => setSelectedImageId(image.id)}
          >
            <div className="gallery-grid-item">
              <img src={image.image_url} alt="Gallery" className="grid-image" />
              <button
                className="delete-image-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteImage(image.id, image.file_path)
                }}
                disabled={deleting === image.id}
                title="Delete image"
              >
                {deleting === image.id ? '...' : '✕'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedImageId && (
        <div
          className="image-lightbox"
          onClick={() => setSelectedImageId(null)}
        >
          <button
            className="lightbox-close"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedImageId(null)
            }}
          >
            ✕
          </button>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images.find((i) => i.id === selectedImageId)?.image_url}
              alt="Full view"
              className="lightbox-image"
            />
          </div>
        </div>
      )}
    </div>
  )
}
