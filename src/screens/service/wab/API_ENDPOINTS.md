# Dokumentasi Endpoint SDMS — Mobile WAB System

Dokumen ini mencatat endpoint WAB System yang dipanggil oleh Mobile app.

---

## 1. Get List Booking

- **Path**: `/api/v1/services/wab/bookings`
- **Method**: `GET`
- **Auth Required**: Ya (`Bearer <token>`)

## 2. Get List Tickets (Daftar Tamu)

- **Path**: `/api/v1/services/wab/tickets`
- **Method**: `GET`
- **Auth Required**: Ya (`Bearer <token>`)

## 3. Submit Check-In Gerbang (Security)

- **Path**: `/api/v1/services/wab/check-in`
- **Method**: `POST`
- **Auth Required**: Ya (`Bearer <token>`)

## 4. Submit Form WAB (Service Advisor)

- **Path**: `/api/v1/services/wab/form`
- **Method**: `POST`
- **Auth Required**: Ya (`Bearer <token>`)
