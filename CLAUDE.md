# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A family photo album web app that integrates with **Firebase** for authentication, database, and storage. The frontend is in the `client/` workspace:

- `client/` — Vite + React 18 + Tailwind CSS (port 5173)

## Commands

```bash
# Run the dev server with live reload
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Environment variables

Before running, copy and fill in the `.env.example` file:

```bash
cp client/.env.example client/.env
```

`client/.env` needs Firebase configuration values from the [Firebase Console](https://console.firebase.google.com/) > Project Settings > Your apps.

## Architecture

### Firebase integration

Firebase SDK is imported as an npm package in `client/src/lib/firebase.js`. This module initializes the Firebase app and exports:
- `auth` — Firebase Auth instance
- `db` — Firestore instance
- `storage` — Firebase Storage instance
- `signIn()` / `signOut()` — Google authentication functions
- `fetchAlbums()` / `fetchPhotosInAlbum()` — Firestore query functions
- `createAlbum()` / `uploadPhoto()` / `updateAlbumCover()` — Write operations

All Firebase operations are handled client-side using the Firebase JavaScript SDK.

### Client routing

React Router v6, three routes: `/` (Home), `/albums` (album grid), `/albums/:albumId` (photo grid + lightbox).

### Firebase data model

Two Firestore collections are expected:

| Collection | Key fields |
|---|---|
| `albums` | `name` (string), `coverUrl` (string), `createdAt` (timestamp), `userId` (string) |
| `photos` | `url` (string), `albumId` (string), `storagePath` (string), `fileName` (string), `createdAt` (timestamp), `userId` (string) |

Photos are stored in Firebase Storage and their download URLs are saved in the `photos` collection.

### State and auth

Authentication state lives in `useAuth` (`client/src/hooks/useAuth.js`), which subscribes to Firebase auth state changes on mount. The `Navbar` reads this hook to show Sign In / Sign Out. No global state library is used — auth is passed via the hook wherever needed.

Access is restricted to email addresses listed in `VITE_ALLOWED_EMAILS` (comma-separated). Leave empty to allow any authenticated user.
