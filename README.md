# Family Photo Album

A private family photo album web app built with React and Firebase. Organize photos into albums, upload new images, and share memories with family members.

## Features

- **Google Authentication** — Sign in with Google, restricted to allowed email addresses
- **Album Management** — Create albums and organize photos
- **Photo Upload** — Upload photos directly to Firebase Storage
- **Responsive UI** — Built with Tailwind CSS for a modern, mobile-friendly experience

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6
- **Backend**: Firebase (Authentication, Firestore, Storage)

## Project Structure

```
client/
├── src/
│   ├── components/     # Reusable UI components (Navbar, modals)
│   ├── hooks/          # Custom React hooks (useAuth)
│   ├── lib/            # Firebase configuration and API functions
│   └── pages/          # Route components (Home, Albums, AlbumDetail)
├── index.html
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 20+
- A Firebase project with Authentication, Firestore, and Storage enabled

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd FamilyPhotoAlbum
   ```

2. **Install dependencies**

   ```bash
   cd client
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `client/.env` with your Firebase configuration from the [Firebase Console](https://console.firebase.google.com/) > Project Settings > Your apps:

   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_ALLOWED_EMAILS=email1@gmail.com,email2@gmail.com
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Firebase Setup

### Firestore Collections

The app expects two collections:

| Collection | Fields |
|------------|--------|
| `albums` | `name` (string), `coverUrl` (string), `createdAt` (timestamp), `userId` (string) |
| `photos` | `url` (string), `albumId` (string), `storagePath` (string), `fileName` (string), `createdAt` (timestamp), `userId` (string) |

### Security Rules

Configure Firestore and Storage security rules to restrict access to authenticated users. Example Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /albums/{albumId} {
      allow read, write: if request.auth != null;
    }
    match /photos/{photoId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Authentication

Enable Google Sign-In in the Firebase Console under Authentication > Sign-in method.

## Access Control

The app restricts access to specific email addresses configured in `VITE_ALLOWED_EMAILS`. Leave this empty to allow any authenticated Google user.

## License

Private project for family use.
