import { useState, useEffect } from 'react'
import './App.css'
import ImageUpload from './components/ImageUpload'
import Gallery from './components/Gallery'

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [bgClass, setBgClass] = useState(() => {
    return localStorage.getItem('selectedBg') || ''
  })

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('selectedBg')
      if (saved) {
        setBgClass(saved)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    const interval = setInterval(handleStorageChange, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const handleUploadComplete = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className={`app ${bgClass}`}>
      <header className="app-header">
        <h1>💝 Valentine's Day Gallery 💝</h1>
        <p>Share your memories and spread the love!</p>
      </header>
      <main className="app-main">
        <ImageUpload onUploadComplete={handleUploadComplete} />
        <Gallery refreshTrigger={refreshTrigger} />
      </main>
    </div>
  )
}

export default App
