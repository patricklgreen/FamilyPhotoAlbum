import { useState, useRef } from 'react';
import { uploadPhoto, updateAlbumCover } from '../lib/firebase';

export default function UploadPhotosModal({ albumId, onClose, onUploaded }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    setError(null);
  }

  function handleDrop(e) {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    );
    setFiles(droppedFiles);
    setError(null);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  async function handleUpload() {
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    setProgress({ current: 0, total: files.length });

    const uploadedPhotos = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const photo = await uploadPhoto(albumId, files[i]);
        uploadedPhotos.push(photo);
        setProgress({ current: i + 1, total: files.length });

        if (i === 0) {
          await updateAlbumCover(albumId, photo.url);
        }
      }

      onUploaded(uploadedPhotos);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Photos</h2>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-brand-500 hover:bg-brand-50 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="text-4xl mb-2">📸</div>
          <p className="text-gray-600">
            {files.length > 0
              ? `${files.length} photo${files.length > 1 ? 's' : ''} selected`
              : 'Drop photos here or click to browse'}
          </p>
          {files.length > 0 && (
            <p className="text-sm text-gray-400 mt-1">
              {files.map((f) => f.name).join(', ')}
            </p>
          )}
        </div>

        {uploading && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Uploading...</span>
              <span>
                {progress.current} / {progress.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-brand-500 h-2 rounded-full transition-all"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        <div className="flex gap-3 justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            className="px-4 py-2 text-sm font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Uploading...' : `Upload ${files.length || ''} Photo${files.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}
