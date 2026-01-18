import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { toPng } from 'html-to-image'
import toast from 'react-hot-toast'
import CropModal from '../components/CropModal.jsx'
import GalleryGrid from '../components/GalleryGrid.jsx'
import Preview from '../components/Preview.jsx'

const FRAME_COLORS = [
  { name: 'Black', value: '#111827' },
  { name: 'White', value: '#F9FAFB' },
  { name: 'Walnut', value: '#5B3A29' },
  { name: 'Natural', value: '#C9A57A' },
]

function createSlots(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `slot-${i + 1}`,
    originalUrl: null,
    editedUrl: null,
    cropData: null,
  }))
}

function isBlobUrl(url) {
  return typeof url === 'string' && url.startsWith('blob:')
}

export default function Gallery() {
  const params = useParams()
  const parsed = Number(params.count)
  const count = parsed === 5 || parsed === 6 ? parsed : null

  const [slots, setSlots] = useState(() => (count ? createSlots(count) : []))

  const [frameColor, setFrameColor] = useState(() => {
    const saved = localStorage.getItem('frameColor')
    return saved || FRAME_COLORS[0].value
  })

  useEffect(() => {
    localStorage.setItem('frameColor', frameColor)
  }, [frameColor])

  useEffect(() => {
    if (!count) return
    setSlots(createSlots(count))
  }, [count])

  const [cropOpen, setCropOpen] = useState(false)
  const [activeId, setActiveId] = useState(null)
  const [pngGenerated, setPngGenerated] = useState(false)
  const previewRef = useRef(null)

  const activeSlot = useMemo(() => slots.find((s) => s.id === activeId) || null, [slots, activeId])

  if (!count) return <Navigate to="/" replace />

  const openCropForId = (id) => {
    const slot = slots.find((s) => s.id === id)
    if (!slot?.originalUrl) return
    setActiveId(id)
    setCropOpen(true)
  }

  const onUploadForId = (id, file) => {
    const objectUrl = URL.createObjectURL(file)

    setSlots((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s

        if (isBlobUrl(s.originalUrl)) URL.revokeObjectURL(s.originalUrl)

        return {
          ...s,
          originalUrl: objectUrl,
          editedUrl: null,
          cropData: null,
        }
      }),
    )

    setActiveId(id)
    setCropOpen(true)
  }

  const onRemoveId = (id) => {
    setSlots((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s
        if (isBlobUrl(s.originalUrl)) URL.revokeObjectURL(s.originalUrl)
        return { ...s, originalUrl: null, editedUrl: null, cropData: null }
      }),
    )
  }

  const handleExportPNG = async () => {
    if (!previewRef.current) {
      toast.error('Önizleme bulunamadı.')
      return
    }

    try {
      toast.loading('PNG oluşturuluyor...')
      
      const dataUrl = await toPng(previewRef.current, {
        quality: 1.0,
        pixelRatio: 2,
      })

      // Convert to blob and download
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = 'galeri-siparis.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.dismiss()
      toast.success('PNG indirildi. WhatsApp açılacak, lütfen görseli ekleyip gönderin.', {
        duration: 5000,
      })
      setPngGenerated(true)
    } catch (error) {
      toast.dismiss()
      toast.error('PNG oluşturulurken hata oluştu.')
      console.error('Export error:', error)
    }
  }

  const filledCount = slots.filter((s) => s.originalUrl).length

  const frameColorName = FRAME_COLORS.find((c) => c.value === frameColor)?.name || 'Black'

  const whatsappUrl = useMemo(() => {
    const message = `Merhaba, ${count}'lı galeri siparişi vermek istiyorum.\nÇerçeve rengi: ${frameColorName}\nPNG'yi ek olarak gönderiyorum.`
    return `https://wa.me/905387730177?text=${encodeURIComponent(message)}`
  }, [count, frameColorName])

  return (
    <div className="grid gap-8 md:grid-cols-[45%_55%]">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{count}'lı Galeri Builder</h1>
            <p className="mt-2 text-sm text-gray-600 md:text-base">
              Fotoğrafları yükleyin, kırpın/düzenleyin ve sürükleyerek sıralayın.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                Dolu: {filledCount}/{count}
              </span>
            </div>
          </div>
          <Link
            to="/"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50"
          >
            Şablon Değiştir
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-base font-semibold text-gray-900">Çerçeve Rengi</div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {FRAME_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setFrameColor(color.value)}
                className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition ${
                  frameColor === color.value
                    ? 'border-gray-900 bg-gray-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div
                  className="h-7 w-7 rounded border border-gray-300 shadow-sm"
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-gray-900">{color.name}</span>
              </button>
            ))}
          </div>
        </div>

        <GalleryGrid
          slots={slots}
          setSlots={setSlots}
          frameColor={frameColor}
          onUploadForId={onUploadForId}
          onEditId={openCropForId}
          onRemoveId={onRemoveId}
        />

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-base font-semibold text-gray-900">Sipariş</div>
          <p className="mt-2 text-sm text-gray-600">
            Önce PNG'yi indirin, sonra WhatsApp'tan sipariş verin ve görseli ekleyin.
          </p>
          <button
            type="button"
            onClick={handleExportPNG}
            className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            📥 Önizlemeyi PNG İndir
          </button>
          <button
            type="button"
            onClick={() => {
              if (!pngGenerated) {
                toast.error('Lütfen önce PNG dosyasını indirin!', { duration: 3000 })
                return
              }
              window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
            }}
            className="mt-3 w-full rounded-xl bg-green-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
          >
            💬 WhatsApp'tan Sipariş Ver
          </button>
        </div>
      </div>

      <div className="md:sticky md:top-6 md:self-start">
        <Preview ref={previewRef} count={count} slots={slots} frameColor={frameColor} />
      </div>

      <CropModal
        open={cropOpen}
        imageUrl={activeSlot?.originalUrl || null}
        initialData={activeSlot?.cropData || null}
        onClose={() => setCropOpen(false)}
        onSave={({ dataUrl, cropData }) => {
          if (!activeId) return
          setSlots((prev) => prev.map((s) => (s.id === activeId ? { ...s, editedUrl: dataUrl, cropData } : s)))
          setCropOpen(false)
        }}
      />
    </div>
  )
}
