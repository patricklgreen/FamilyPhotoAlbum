import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const ALLOWED_EMAILS = (import.meta.env.VITE_ALLOWED_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function isEmailAllowed(email) {
  if (ALLOWED_EMAILS.length === 0) return true;
  return ALLOWED_EMAILS.includes(email?.toLowerCase());
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, 'familyphotoalbum');
export const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();

export async function signIn() {
  const result = await signInWithPopup(auth, googleProvider);
  const email = result.user.email?.toLowerCase();

  if (!isEmailAllowed(email)) {
    await firebaseSignOut(auth);
    throw new Error('Access denied. Your email is not authorized to use this app.');
  }

  return result;
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function fetchAlbums() {
  const q = query(collection(db, 'albums'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function fetchPhotosInAlbum(albumId) {
  const q = query(
    collection(db, 'photos'),
    where('albumId', '==', albumId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function createAlbum(name) {
  const docRef = await addDoc(collection(db, 'albums'), {
    name,
    coverUrl: null,
    createdAt: serverTimestamp(),
    userId: auth.currentUser?.uid,
  });
  return { id: docRef.id, name, coverUrl: null };
}

export async function uploadPhoto(albumId, file) {
  const fileName = `${Date.now()}-${file.name}`;
  const storagePath = `photos/${albumId}/${fileName}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  const docRef = await addDoc(collection(db, 'photos'), {
    albumId,
    url,
    storagePath,
    fileName: file.name,
    createdAt: serverTimestamp(),
    userId: auth.currentUser?.uid,
  });

  return { id: docRef.id, url, storagePath };
}

export async function updateAlbumCover(albumId, coverUrl) {
  const albumRef = doc(db, 'albums', albumId);
  await updateDoc(albumRef, { coverUrl });
}
