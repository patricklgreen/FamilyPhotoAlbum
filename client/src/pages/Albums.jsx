import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAlbums } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import CreateAlbumModal from '../components/CreateAlbumModal';

export default function Albums() {
  const { user, loading: authLoading } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setAlbums([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    fetchAlbums()
      .then(setAlbums)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  function handleAlbumCreated(album) {
    setAlbums((prev) => [album, ...prev]);
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
        Failed to load albums: {error.message ?? String(error)}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Albums</h2>
        {user && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
          >
            <span className="text-lg">+</span>
            New Album
          </button>
        )}
      </div>

      {albums.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📷</div>
          <p className="text-gray-500 mb-4">No albums yet.</p>
          {user && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-brand-600 hover:text-brand-700 font-medium"
            >
              Create your first album
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {albums.map((album) => (
            <Link
              key={album.id}
              to={`/albums/${album.id}`}
              className="group block rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="bg-gray-100 aspect-square flex items-center justify-center text-gray-400">
                {album.coverUrl ? (
                  <img
                    src={album.coverUrl}
                    alt={album.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-4xl">📷</span>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {album.name ?? 'Untitled'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateAlbumModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleAlbumCreated}
        />
      )}
    </div>
  );
}
