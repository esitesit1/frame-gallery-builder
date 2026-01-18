import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Galeri Duvarınızı Oluşturun
        </h1>
        <p className="mt-4 text-base text-gray-600 md:text-lg">
          Bir şablon seçin, fotoğraflarınızı yükleyin, kırpın ve canlı önizlemede son halini görün.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate('/gallery/5')}
            className="group relative overflow-hidden rounded-xl bg-gray-900 px-6 py-8 text-left text-white transition hover:bg-gray-800"
          >
            <div className="relative z-10">
              <div className="text-lg font-semibold md:text-xl">5'li Galeri</div>
              <div className="mt-2 text-sm text-gray-300">5 çerçeveli şablon</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/gallery/6')}
            className="group relative overflow-hidden rounded-xl bg-gray-900 px-6 py-8 text-left text-white transition hover:bg-gray-800"
          >
            <div className="relative z-10">
              <div className="text-lg font-semibold md:text-xl">6'lı Galeri</div>
              <div className="mt-2 text-sm text-gray-300">6 çerçeveli şablon</div>
            </div>
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        Not: Tüm işlemler tarayıcıda yapılır. Fotoğraflarınız sunucuya gönderilmez.
      </div>
    </div>
  )
}
