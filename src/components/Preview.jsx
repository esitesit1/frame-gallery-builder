import { forwardRef, useMemo } from 'react'
import wallImage from '../assets/wall.png.png'

// Frame positions for 6-frame "Graceful Six" layout (percentage-based)
const FRAME_POSITIONS_6 = [
  { x: 14, y: 13, w: 19, h: 19 }, // TL - top-left small
  { x: 36, y: 9, w: 28, h: 24 }, // TC - top-center large
  { x: 67, y: 13, w: 19, h: 19 }, // TR - top-right small
  { x: 14, y: 40, w: 19, h: 19 }, // BL - bottom-left small
  { x: 36, y: 37, w: 28, h: 22 }, // BC - bottom-center wide
  { x: 67, y: 40, w: 19, h: 19 }, // BR - bottom-right small
]

// Frame positions for 5-frame layout (2 equal medium frames on bottom row, centered)
const FRAME_POSITIONS_5 = [
  { x: 16, y: 13, w: 19, h: 19 }, // TL - top-left small
  { x: 38, y: 9, w: 28, h: 24 }, // TC - top-center large
  { x: 69, y: 13, w: 19, h: 19 }, // TR - top-right small
  { x: 32, y: 40, w: 20, h: 18 }, // BL - bottom-left medium
  { x: 54, y: 40, w: 20, h: 18 }, // BR - bottom-right medium
]

function Frame({ position, imageUrl, frameColor, isEmpty }) {
  return (
    <div
      className="absolute z-10 pointer-events-none"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${position.w}%`,
        height: `${position.h}%`,
      }}
    >
      {/* Outer frame border */}
      <div
        className="relative h-full w-full rounded-sm shadow-md"
        style={{
          borderWidth: 'clamp(6px, 1vw, 9px)',
          borderColor: frameColor,
          borderStyle: 'solid',
          padding: 'clamp(10px, 1.2vw, 14px)',
          backgroundColor: '#F3F4F6',
        }}
      >
        {/* Photo area */}
        <div className="relative h-full w-full overflow-hidden bg-gray-100">
          {imageUrl ? (
            <img src={imageUrl} alt="Frame" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-gray-400">
              <svg
                className="h-1/3 w-1/3 opacity-30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-[0.6rem] opacity-50">Fotoğraf yok</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const Preview = forwardRef(function Preview({ count, slots, frameColor }, ref) {
  const positions = count === 6 ? FRAME_POSITIONS_6 : FRAME_POSITIONS_5
  const sources = useMemo(
    () => slots.map((s) => s.editedUrl || s.originalUrl || null),
    [slots],
  )

  return (
    <div ref={ref} className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg md:text-xl font-bold text-gray-900">Canlı Önizleme</div>
          <div className="mt-1 text-sm md:text-base text-gray-500">Şablon: {count}'lı</div>
        </div>
      </div>

      <div className="mt-5 md:mt-6 overflow-hidden rounded-xl border border-gray-200 shadow-md">
        {/* Wall mockup container (landscape aspect ratio) */}
        <div className="relative w-full aspect-[41/29] bg-gray-900">
          {/* Wall background */}
          <img
            src={wallImage}
            alt="Wall"
            className="absolute inset-0 z-0 h-full w-full rounded-xl object-cover"
          />

          {/* Frames overlay */}
          {positions.map((position, index) => (
            <Frame
              key={index}
              position={position}
              imageUrl={sources[index]}
              frameColor={frameColor}
              isEmpty={!sources[index]}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 md:mt-5 text-xs md:text-sm text-gray-500">
        Not: Önizleme duvar maketi ile gösterilir; gerçek baskı ölçüleri farklı olabilir.
      </div>
    </div>
  )
})

export default Preview
