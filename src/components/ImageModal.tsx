interface ImageModalProps {
  imageUrl: string
  uploaderName: string
  isOpen: boolean
  onClose: () => void
}

export default function ImageModal({
  imageUrl,
  uploaderName,
  isOpen,
  onClose,
}: ImageModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <div className="modal-image-container">
          <img src={imageUrl} alt={`Full view - ${uploaderName}`} className="modal-image" />
        </div>
        <div className="modal-footer">
          <p className="modal-uploader">📸 {uploaderName}</p>
        </div>
      </div>
    </div>
  )
}
