/**
 * Module Integrasi Google Drive (DriveApp)
 */
const DriveService = {
  /**
   * Mengambil folder target, atau membuat folder baru di Drive jika belum ada
   */
  getOrCreateFolder(folderName, parentFolderId = CONFIG.DRIVE_FOLDER_ID) {
    try {
      let parentFolder = parentFolderId ? DriveApp.getFolderById(parentFolderId) : DriveApp.getRootFolder();
      const folders = parentFolder.getFoldersByName(folderName);
      
      if (folders.hasNext()) {
        return folders.next();
      } else {
        return parentFolder.createFolder(folderName);
      }
    } catch (error) {
      Utils.logToSheet("ERROR", "getOrCreateFolder failed", error.message);
      throw error;
    }
  },

  /**
   * Menyimpan konten (Teks / JSON) menjadi file di Google Drive
   */
  saveFile(fileName, content, mimeType = MimeType.PLAIN_TEXT, folderId = CONFIG.DRIVE_FOLDER_ID) {
    try {
      const folder = DriveApp.getFolderById(folderId);
      const file = folder.createFile(fileName, content, mimeType);
      
      return {
        id: file.getId(),
        name: file.getName(),
        url: file.getUrl(),
        downloadUrl: file.getDownloadUrl()
      };
    } catch (error) {
      Utils.logToSheet("ERROR", "saveFile failed", error.message);
      throw error;
    }
  },

  /**
   * Mengatur hak akses file di Google Drive
   */
  setFilePublic(fileId) {
    try {
      const file = DriveApp.getFileById(fileId);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      return file.getUrl();
    } catch (error) {
      Utils.logToSheet("ERROR", "setFilePublic failed", error.message);
      throw error;
    }
  }
};
