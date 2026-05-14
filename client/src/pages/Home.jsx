import { Link } from 'react-router-dom';
import { signIn } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Family Photo Album</h1>
      <p className="text-gray-500 text-base sm:text-lg max-w-md mb-8">
        Privately store and share your family memories, synced securely with Firebase.
      </p>
      {loading ? null : user ? (
        <Link
          to="/albums"
          className="bg-brand-500 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-brand-600 transition-colors"
        >
          View Albums
        </Link>
      ) : (
        <button
          onClick={signIn}
          className="bg-brand-500 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-brand-600 transition-colors"
        >
          Sign in with Google to get started
        </button>
      )}
    </main>
  );
}
