import { useState, useEffect } from 'react'
import { X, Share } from 'lucide-react'

export default function IOSInstallPrompt() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Wykryj iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone

    // Pokaż prompt tylko na iOS w trybie przeglądarkowym
    if (isIOS && !isInStandaloneMode) {
      const hasSeenPrompt = localStorage.getItem('hasSeenIOSPrompt')
      if (!hasSeenPrompt) {
        setShow(true)
      }
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem('hasSeenIOSPrompt', 'true')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="card bg-blue-50 border-2 border-blue-200 relative">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 hover:bg-blue-100 rounded"
      >
        <X className="w-5 h-5 text-blue-600" />
      </button>

      <div className="flex items-start gap-3">
        <Share className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-2">
            Dodaj aplikację do ekranu głównego
          </h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Kliknij przycisk "Udostępnij" <Share className="w-4 h-4 inline" /> na dole ekranu</li>
            <li>Przewiń w dół i wybierz "Dodaj do ekranu głównego"</li>
            <li>Kliknij "Dodaj" w prawym górnym rogu</li>
          </ol>
          <p className="text-xs text-blue-700 mt-2">
            Dzięki temu otrzymasz powiadomienia o dyżurach!
          </p>
        </div>
      </div>
    </div>
  )
}
