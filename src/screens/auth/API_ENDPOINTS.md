# Dokumentasi Endpoint SDMS — Mobile Auth

Dokumen ini mencatat endpoint autentikasi SDMS untuk Mobile App.

---

## 1. Login Mobile Kredensial SDMS

- **Path**: `/api/v1/auth/login`
- **Method**: `POST`
- **Auth Required**: Tidak
- **Request Body**:
  ```json
  {
    "email": "sa@suzuki.co.id",
    "password": "••••••••",
    "role": "ServiceAdvisor"
  }
  ```
- **Response**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "name": "Service Advisor",
      "role": "ServiceAdvisor"
    }
  }
  ```
