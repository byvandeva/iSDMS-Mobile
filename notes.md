# Mobile App

## Install & Run

```bash
cd mobile
npm install
npm run dev
```

## Mode Per Platform

```bash
# Browser
npm run web

# Android (Emulator / HP)
npm run android

# iOS Simulator (macOS)
npm run ios
```

## Config Backend (Opsional)

Jika mau ubah URL API, copy `.env.example` ke `.env`:
```bash
cp .env.example .env
```
Isi `EXPO_PUBLIC_SDMS_API_URL=http://localhost:5000/api`
