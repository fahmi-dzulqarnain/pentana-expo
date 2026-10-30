# PENTANA Expo

A React Native (Expo) client for the [PENTANA](https://github.com/fahmi-dzulqarnain/pentana-system) membership API: sign in, see what you owe, and open each monthly bill.

It's a companion to the native PENTANA apps (SwiftUI on iOS, Jetpack Compose on Android), built to show the same product in React Native and TypeScript.

## Features

- **Sign in** with email and password against the Laravel Sanctum API; the token is kept in the Keychain / Android Keystore with `expo-secure-store`.
- **Bills list** with the outstanding total, pull to refresh, and loading, empty and error states.
- **Bill detail** with amount due, paid so far and outstanding.
- **Session handling**: any `401` signs the user out and clears cached data; signing out also revokes the token on the server.

## Stack

| | |
|---|---|
| App | Expo SDK 58 · React Native 0.88 · TypeScript (strict) |
| Navigation | Expo Router, with `Stack.Protected` guarding signed-in screens |
| Data | TanStack Query for fetching, caching and refetching |
| Storage | `expo-secure-store` |
| Tests | Jest (`jest-expo`) · React Native Testing Library |
| CI | GitHub Actions: typecheck, lint, tests |

## Structure

```
src/
  app/                  routes (Expo Router): login, bills list, bills/[id]
  api/                  fetch client with typed errors, API response types
  auth/                 AuthProvider (session state), secure token storage
  features/bills/       hooks (useBills, useBill, useBillSummary), formatting, row and badge
  components/           shared loading / error / empty states, theme
  __tests__/            screen tests
```

Design notes:

- **Money stays a string.** The API sends fixed 2-dp strings, and `formatMoney` formats them without converting to floats, so amounts never drift.
- **One API client, one place for auth.** Screens never touch tokens; they call hooks, and the hooks use the client from `useAuth()`.
- **No detail endpoint.** The API has no `GET /bills/{id}`, so the detail screen reads the bill from the cached list.

## Run it

```bash
cp .env.example .env    # point EXPO_PUBLIC_API_URL at your PENTANA API
npm install
npx expo start          # then press i (iOS simulator), a (Android) or scan the QR code with Expo Go
```

## Checks

```bash
npm run typecheck
npm run lint
npm test
```

## Build for Android

```bash
npx eas-cli@latest build --platform android --profile preview
```
