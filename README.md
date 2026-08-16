# Oprec-Kaping-GenV - Google Apps Script (Sheets & Drive API)

Sistem otomatisasi dan REST API ringan menggunakan **Google Apps Script (GAS)** yang terintegrasi secara *seamless* dengan **Google Sheets** dan **Google Drive**.

## 📌 Fitur Utama
- **Google Sheets Integration:** Membaca data sheet menjadi Array of Objects dan mendukung operasi *upsert* (insert/update) berbasis Unique Key.
- **Google Drive Integration:** Otomatisasi pembuatan file, penyimpanan backup (JSON/Text), serta pengelolaan folder.
- **REST Web App Endpoint:** Menyediakan handler `doGet` dan `doPost` untuk integrasi dengan frontend/service eksternal.
- **System Logging:** Mencatat error dan log aktivitas secara otomatis ke tab `System_Logs` di Spreadsheet.

---

## 🚀 Panduan Deployment (Google Apps Script)

1. Buka [Google Apps Script](https://script.google.com/) atau buat melalui Google Sheets (*Extensions > Apps Script*).
2. Salin seluruh isi file di folder `src/` ke dalam editor Apps Script.
3. Buka file `src/Config.gs` dan atur `DRIVE_FOLDER_ID` serta `SPREADSHEET_ID` (jika menggunakan standalone script).
4. Klik tombol **Deploy > New deployment**.
5. Pilih tipe **Web app**:
   - **Execute as:** `Me (email_anda@gmail.com)`
   - **Who has access:** `Anyone`
6. Klik **Deploy** dan jalankan proses otorisasi (*Authorize access*).
7. Salin URL Web App yang dihasilkan untuk digunakan sebagai endpoint API.

---

## 📡 API Endpoints

### 1. Read Data (HTTP GET)
```http
GET https://script.google.com/macros/s/DEPLOYMENT_ID/exec?action=read&sheet=Data
```

### 2. Upsert Data ke Sheets (HTTP POST)
```json
POST /exec
{
  "action": "upsert_data",
  "sheet": "Data",
  "keyColumn": "ID",
  "data": {
    "ID": "USR-001",
    "Nama": "Stefan",
    "Peran": "Admin",
    "Status": "Aktif"
  }
}
```

### 3. Backup Data ke Google Drive (HTTP POST)
```json
POST /exec
{
  "action": "backup_to_drive",
  "sheet": "Data"
}
```
