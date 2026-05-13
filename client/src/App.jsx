import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Albums from './pages/Albums';
import AlbumDetail from './pages/AlbumDetail';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/albums/:albumId" element={<AlbumDetail />} />
      </Routes>
    </div>
  );
}
