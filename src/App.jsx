import { Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import Gallery from './pages/Gallery.jsx'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:py-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery/:count" element={<Gallery />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
