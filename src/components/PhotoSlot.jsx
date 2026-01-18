import { useRef } from 'react'

export default function PhotoSlot({
  index,
  imageUrl,
  hasSource,
  frameColor,
  onUpload,
  onEdit,
  onRemove,
  dragHandleProps,
}) {
  const inputRef = useRef(null)

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div
        className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2.5"
        {...dragHandleProps}
      >
        <div className="text-sm font-medium text-gray-800">Slot {index + 1}</div>
        <div className="text-xs text-gray-500">Sürükle-bırak</div>
      </div>

      <div className="p-4">\n        {/* Frame + Mat + Photo */}
        <div
          className="relative aspect-[4/3] w-full overflow-hidden rounded shadow-md"
          style={{
            border: `12px solid ${frameColor}`,
            padding: '22px',
            backgroundColor: '#F3F4F6',
          }}
        >
          <div className="relative h-full w-full overflow-hidden bg-gray-100">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`Slot ${index + 1}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                Fotoğraf yok
              </div>
            )}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            onUpload(file)
            e.target.value = ''
          }}
        />

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-lg bg-gray-900 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
          >
            Yükle
          </button>

          <button
            type="button"
            disabled={!hasSource}
            onClick={onEdit}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Kırp / Düzenle
          </button>

          <button
            type="button"
            disabled={!hasSource}
            onClick={onRemove}
            className="col-span-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Kaldır
          </button>
        </div>
      </div>
    </div>
  )
}
