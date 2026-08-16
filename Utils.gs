/**
 * Utility Services: Helper untuk Logging dan Formatting Respons HTTP
 */
const Utils = {
  /**
   * Format respons standar JSON untuk HTTP Response
   */
  createJsonResponse(success, message, data = null, statusCode = 200) {
    const payload = {
      status: success ? "success" : "error",
      code: statusCode,
      message: message,
      data: data,
      timestamp: new Date().toISOString()
    };

    return ContentService.createTextOutput(JSON.stringify(payload))
      .setMimeType(ContentService.MimeType.JSON);
  },

  /**
   * Catat log error/aktivitas ke tab System_Logs di Google Sheets
   */
  logToSheet(level, message, details = "") {
    try {
      const ss = SheetsService.getSpreadsheet();
      let logSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.LOGS);
      
      // Buat tab System_Logs jika belum tersedia
      if (!logSheet) {
        logSheet = ss.insertSheet(CONFIG.SHEET_NAMES.LOGS);
        logSheet.appendRow(["Timestamp", "Level", "Message", "Details"]);
      }

      logSheet.appendRow([
        new Date(),
        level.toUpperCase(),
        message,
        typeof details === "object" ? JSON.stringify(details) : details
      ]);
    } catch (err) {
      Logger.log("Gagal menulis log ke sheet: " + err.message);
    }
  }
};
