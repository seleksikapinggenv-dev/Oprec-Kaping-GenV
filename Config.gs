/**
 * Global Configuration & Environment Variables
 */
const CONFIG = {
  // Kosongkan atau set null jika script ini Container-Bound (menempel pada Spreadsheet langsung)
  SPREADSHEET_ID: null, // Contoh Standalone: "1abc1234567890XYZ..."
  
  // ID Folder Google Drive tempat menyimpan backup / ekspor file
  DRIVE_FOLDER_ID: "PASTE_ID_FOLDER_GOOGLE_DRIVE_DI_SINI",
  
  // Pemetaan Nama Sheet / Tab
  SHEET_NAMES: {
    DATA: "Data",
    LOGS: "System_Logs"
  }
};
