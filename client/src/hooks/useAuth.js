import { useState, useEffect } from 'react';
import { subscribeToAuthChanges, isEmailAllowed, signOut } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      try {
        if (firebaseUser && !isEmailAllowed(firebaseUser.email)) {
          await signOut();
          setError(new Error('Access denied. Your email is not authorized to use this app.'));
          setUser(null);
        } else {
          setUser(firebaseUser);
          setError(null);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, error };
}
