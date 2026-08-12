# API Endpoints & Data Model Document — Modul WAB Mobile

Dokumentasi endpoint API SDMS dan skema data tabel `Booking` SDMS yang dikonsumsi oleh modul WAB Mobile App.

---

## 1. Skema Data Tabel Booking SDMS

```sql
CompanyCode	BranchCode	BookingNo	ReservasiDate	ReservasiTime	StallCode	BookingSource	CustomerName	TelponNo	PoliceRegNo	GroupCode	Odometer	JobType	JobTime	AdditionalTime	FinishJobTime	FinishTime	ServiceRequest	Remark	ServiceAdvisor	ForemanID	MechanicID	CreatedBy	CreatedDate	UpdatedBy	UpdatedDate
```

### Pemetaan Kolom SDMS Raw ke Property Client Mobile

| Kolom SDMS Raw | Property Client | Contoh Nilai |
|---|---|---|
| `CompanyCode` | `companyCode` | `"6006406"` |
| `BranchCode` | `branchCode` | `"6006401"` |
| `BookingNo` | `bookingNo` / `sdmsBookingId` | `"BO401/25/002479"` |
| `ReservasiDate` | `reservasiDate` | `"2026-02-26 00:00:00.000"` |
| `ReservasiTime` | `reservasiTime` / `bookingTime` | `"09:30"` |
| `StallCode` | `stallCode` | `"STALL-01"` |
| `CustomerName` | `customerName` | `"ANANTYA NALA PRABATA"` |
| `TelponNo` | `telponNo` / `customerPhone` | `"08118207657"` |
| `PoliceRegNo` | `policeRegNo` / `licensePlate` | `"B1697TYK"` |
| `GroupCode` | `groupCode` / `vehicleModel` | `"SWIFT (CBU)"` |
| `Odometer` | `odometer` | `2222222` |
| `JobType` | `jobType` / `serviceType` | `"PAKET 10.000 KM"` |
| `ServiceAdvisor` | `serviceAdvisor` | `"58970"` |
