import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface ImageUploadProps {
  onUploadComplete: () => void
}

export default function ImageUpload({ onUploadComplete }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploaderName, setUploaderName] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const uploadImages = async () => {
    if (!uploaderName.trim()) {
      alert('Please enter your name')
      return
    }

    if (files.length === 0) {
      alert('Please select at least one image')
      return
    }

    setUploading(true)
    try {
      // Create a gallery entry
      const { data: gallery, error: galleryError } = await supabase
        .from('galleries')
        .insert({ uploader_name: uploaderName })
        .select()

      if (galleryError) throw galleryError

      const galleryId = gallery[0].id

      // Upload images
      for (const file of files) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${galleryId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('valentine-images')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        // Get public URL
        const { data } = supabase.storage
          .from('valentine-images')
          .getPublicUrl(fileName)

        // Add image record
        await supabase.from('images').insert({
          gallery_id: galleryId,
          image_url: data.publicUrl,
          file_path: fileName,
        })
      }

      setFiles([])
      setUploaderName('')
      alert('Images uploaded successfully!')
      onUploadComplete()
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading images. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="upload-container">
      <h2>Share Your Valentine's Photos</h2>
      <div className="upload-form">
        <input
          type="text"
          placeholder="Enter your name"
          value={uploaderName}
          onChange={(e) => setUploaderName(e.target.value)}
          disabled={uploading}
          className="input-field"
        />
        <label className="file-input-label">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <span>{files.length > 0 ? `${files.length} file(s) selected` : 'Choose images'}</span>
        </label>
        <button
          onClick={uploadImages}
          disabled={uploading || files.length === 0 || !uploaderName.trim()}
          className="upload-btn"
        >
          {uploading ? 'Uploading...' : 'Upload Photos'}
        </button>
      </div>
    </div>
  )
}
