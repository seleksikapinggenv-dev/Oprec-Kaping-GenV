/**
 * Module Integrasi Google Sheets (SpreadsheetApp)
 */
const SheetsService = {
  /**
   * Mengambil instance Spreadsheet (Container-bound / Standalone)
   */
  getSpreadsheet() {
    if (CONFIG.SPREADSHEET_ID) {
      return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    }
    return SpreadsheetApp.getActiveSpreadsheet();
  },

  /**
   * Membaca data dari tab sheet dan mengembalikannya dalam bentuk Array of Objects
   */
  readData(sheetName) {
    try {
      const ss = this.getSpreadsheet();
      const sheet = ss.getSheetByName(sheetName);
      if (!sheet) throw new Error(`Sheet '${sheetName}' tidak ditemukan.`);

      const values = sheet.getDataRange().getValues();
      if (values.length <= 1) return []; // Hanya ada header atau kosong

      const headers = values[0];
      const dataRows = values.slice(1);

      return dataRows.map(row => {
        let rowObj = {};
        headers.forEach((header, index) => {
          rowObj[header] = row[index];
        });
        return rowObj;
      });
    } catch (error) {
      Utils.logToSheet("ERROR", "readData failed", error.message);
      throw error;
    }
  },

  /**
   * Menambahkan data baru atau memperbarui data berdasarkan Unique ID
   */
  upsertData(sheetName, dataObject, keyColumn = "ID") {
    try {
      const ss = this.getSpreadsheet();
      const sheet = ss.getSheetByName(sheetName);
      if (!sheet) throw new Error(`Sheet '${sheetName}' tidak ditemukan.`);

      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const dataValues = sheet.getDataRange().getValues();

      const keyIndex = headers.indexOf(keyColumn);
      if (keyIndex === -1) throw new Error(`Kolom acuan '${keyColumn}' tidak ditemukan.`);

      const newRow = headers.map(header => dataObject[header] !== undefined ? dataObject[header] : "");

      let existingRowIndex = -1;
      for (let i = 1; i < dataValues.length; i++) {
        if (String(dataValues[i][keyIndex]) === String(dataObject[keyColumn])) {
          existingRowIndex = i + 1;
          break;
        }
      }

      if (existingRowIndex > 0) {
        sheet.getRange(existingRowIndex, 1, 1, newRow.length).setValues([newRow]);
        return { action: "updated", row: existingRowIndex };
      } else {
        sheet.appendRow(newRow);
        return { action: "created", row: sheet.getLastRow() };
      }
    } catch (error) {
      Utils.logToSheet("ERROR", "upsertData failed", error.message);
      throw error;
    }
  }
};
