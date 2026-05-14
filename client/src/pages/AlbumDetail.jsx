import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPhotosInAlbum } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import UploadPhotosModal from '../components/UploadPhotosModal';

export default function AlbumDetail() {
  const { albumId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setPhotos([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    fetchPhotosInAlbum(albumId)
      .then(setPhotos)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [albumId, user, authLoading]);

  function handlePhotosUploaded(newPhotos) {
    setPhotos((prev) => [...newPhotos, ...prev]);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load photos: {error.message ?? String(error)}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="flex items-center justify-between mb-4 gap-4">
        <Link to="/albums" className="text-sm text-brand-600 hover:underline min-h-[44px] flex items-center">
          ← Back to Albums
        </Link>
        {user && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-brand-500 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors min-h-[44px] shrink-0"
          >
            <span className="text-lg">+</span>
            <span className="hidden sm:inline">Upload Photos</span>
            <span className="sm:hidden">Upload</span>
          </button>
        )}
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🖼</div>
          <p className="text-gray-500 mb-4">No photos in this album yet.</p>
          {user && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="text-brand-600 hover:text-brand-700 font-medium"
            >
              Upload your first photos
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((photo) => {
            const url = photo.url;
            return (
              <button
                key={photo.id}
                onClick={() => setSelected(url)}
                className="aspect-square overflow-hidden rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {url ? (
                  <img src={url} alt="" className="object-cover w-full h-full hover:opacity-90 transition-opacity" />
                ) : (
                  <span className="text-3xl">🖼</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <img src={selected} alt="" className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl" />
        </div>
      )}

      {showUploadModal && (
        <UploadPhotosModal
          albumId={albumId}
          onClose={() => setShowUploadModal(false)}
          onUploaded={handlePhotosUploaded}
        />
      )}
    </div>
  );
}
