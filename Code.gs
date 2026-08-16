/**
 * API Endpoint / Entry Point Web App
 */

// Handler HTTP GET Request
function doGet(e) {
  try {
    const action = e.parameter.action || "read";
    const sheetName = e.parameter.sheet || CONFIG.SHEET_NAMES.DATA;

    if (action === "read") {
      const data = SheetsService.readData(sheetName);
      return Utils.createJsonResponse(true, "Data berhasil diambil", data);
    }

    return Utils.createJsonResponse(false, "Aksi GET tidak valid", null, 400);
  } catch (error) {
    return Utils.createJsonResponse(false, error.message, null, 500);
  }
}

// Handler HTTP POST Request
function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return Utils.createJsonResponse(false, "Payload JSON kosong", null, 400);
    }

    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    // Aksi 1: Simpan / Update Data ke Google Sheets
    if (action === "upsert_data") {
      const sheetName = payload.sheet || CONFIG.SHEET_NAMES.DATA;
      const result = SheetsService.upsertData(sheetName, payload.data, payload.keyColumn || "ID");
      
      Utils.logToSheet("INFO", "Data Berhasil Di-upsert", result);
      return Utils.createJsonResponse(true, "Data berhasil disimpan ke Sheets", result);
    }

    // Aksi 2: Ekspor Data ke File JSON di Google Drive
    if (action === "backup_to_drive") {
      const sheetName = payload.sheet || CONFIG.SHEET_NAMES.DATA;
      const data = SheetsService.readData(sheetName);
      
      const fileName = `Backup_${sheetName}_${new Date().getTime()}.json`;
      const fileContent = JSON.stringify(data, null, 2);
      
      const fileInfo = DriveService.saveFile(fileName, fileContent, MimeType.PLAIN_TEXT);
      
      Utils.logToSheet("INFO", "Backup Drive Berhasil", fileInfo);
      return Utils.createJsonResponse(true, "Data berhasil dibackup ke Drive", fileInfo);
    }

    return Utils.createJsonResponse(false, "Aksi POST tidak dikenali", null, 400);

  } catch (error) {
    Utils.logToSheet("ERROR", "doPost Execution Error", error.message);
    return Utils.createJsonResponse(false, error.message, null, 500);
  }
}
