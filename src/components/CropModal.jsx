import { useEffect, useMemo, useRef, useState } from 'react'
import { Cropper } from 'react-cropper'
import 'cropperjs/dist/cropper.css'

export default function CropModal({ open, imageUrl, initialData, onClose, onSave }) {
  const cropperRef = useRef(null)
  const [zoom, setZoom] = useState(0)

  const hasImage = Boolean(imageUrl)

  const defaultOptions = useMemo(
    () => ({
      viewMode: 1,
      dragMode: 'move',
      background: false,
      responsive: true,
      autoCropArea: 1,
      guides: true,
      center: true,
      highlight: false,
      modal: true,
      rotatable: true,
      scalable: false,
      zoomOnWheel: true,
      aspectRatio: 4 / 3,
    }),
    [],
  )

  useEffect(() => {
    if (!open) return
    setZoom(0)
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="text-sm font-semibold text-gray-900">Fotoğrafı Kırp / Düzenle (4:3)</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Kapat
          </button>
        </div>

        <div className="grid gap-0 md:grid-cols-[1fr_280px]">
          <div className="min-h-[320px] bg-gray-50">
            {hasImage ? (
              <Cropper
                ref={cropperRef}
                src={imageUrl}
                style={{ height: 420, width: '100%' }}
                {...defaultOptions}
                ready={() => {
                  const cropper = cropperRef.current?.cropper
                  if (!cropper) return
                  if (initialData) {
                    try {
                      cropper.setData(initialData)
                      if (typeof initialData.rotate === 'number') cropper.rotateTo(initialData.rotate)
                    } catch {
                      // ignore bad restore data
                    }
                  }
                }}
                zoom={() => {
                  const cropper = cropperRef.current?.cropper
                  if (!cropper) return
                  const currentZoom = cropper.getImageData()?.scaleX
                  if (typeof currentZoom === 'number') setZoom(currentZoom)
                }}
              />
            ) : (
              <div className="flex h-[420px] items-center justify-center text-sm text-gray-500">
                Görsel yok
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-4 md:border-l md:border-t-0">
            <div className="space-y-3">
              <div>
                <div className="text-xs font-medium text-gray-700">Zoom</div>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => cropperRef.current?.cropper?.zoom(-0.1)}
                  >
                    -
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => cropperRef.current?.cropper?.zoom(0.1)}
                  >
                    +
                  </button>
                  <div className="ml-auto text-xs text-gray-500">{Number.isFinite(zoom) ? zoom.toFixed(2) : ''}</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-gray-700">Rotate</div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => cropperRef.current?.cropper?.rotate(-90)}
                  >
                    -90°
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => cropperRef.current?.cropper?.rotate(90)}
                  >
                    +90°
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
                onClick={() => cropperRef.current?.cropper?.reset()}
              >
                Reset
              </button>

              <button
                type="button"
                className="w-full rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                onClick={() => {
                  const cropper = cropperRef.current?.cropper
                  if (!cropper) return

                  const canvas = cropper.getCroppedCanvas({
                    imageSmoothingEnabled: true,
                    imageSmoothingQuality: 'high',
                  })
                  if (!canvas) return

                  const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
                  const data = cropper.getData(true)
                  onSave({ dataUrl, cropData: data })
                }}
              >
                Kaydet
              </button>

              <div className="text-xs text-gray-500">
                İpucu: Görseli sürükleyerek konumlandırabilir, zoom ile yakınlaştırabilirsiniz.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
