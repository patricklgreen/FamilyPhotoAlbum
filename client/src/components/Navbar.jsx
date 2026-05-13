import { Link, NavLink } from 'react-router-dom';
import { signIn, signOut } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link to="/" className="text-xl font-semibold text-brand-700 tracking-tight">
        Family Album
      </Link>
      <div className="flex items-center gap-6">
        <NavLink
          to="/albums"
          className={({ isActive }) =>
            `text-sm font-medium ${isActive ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'}`
          }
        >
          Albums
        </NavLink>
        {user ? (
          <div className="flex items-center gap-4">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-8 h-8 rounded-full"
                referrerPolicy="no-referrer"
              />
            )}
            <button
              onClick={signOut}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={signIn}
            className="text-sm bg-brand-500 text-white px-4 py-1.5 rounded-full hover:bg-brand-600 transition-colors"
          >
            Sign in with Google
          </button>
        )}
      </div>
    </nav>
  );
}
