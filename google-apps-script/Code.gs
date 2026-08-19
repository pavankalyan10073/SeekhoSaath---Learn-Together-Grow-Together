/**
 * Google Apps Script — SeekhoSaath Lead Logger
 *
 * 1. Open https://script.google.com and create a new project.
 * 2. Replace the default `Code.gs` content with this file.
 * 3. Create a Google Sheet and copy its ID from the URL.
 *    Example URL: https://docs.google.com/spreadsheets/d/1A2b3C4d5E6f7G8h9I0j/edit#gid=0
 *    Sheet ID = 1A2b3C4d5E6f7G8h9I0j
 * 4. In Apps Script, click Deploy > New deployment > Select type: Web app.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Click Deploy and copy the webhook URL into VITE_GOOGLE_SHEET_WEBHOOK.
 */

const SHEET_ID = "REPLACE_WITH_YOUR_SHEET_ID";
const SHEET_NAME = "Bookings";

function doPost(e) {
  try {
    const payload = typeof e.postData.contents === "string" ? JSON.parse(e.postData.contents) : e.postData.contents || {};
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME) || SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    const timestamp = new Date();

    let row = [
      timestamp,
      payload.type || "",
      payload.fullName || "",
      payload.phone || "",
      payload.email || "",
      payload.mode || "",
      payload.tuitionType || "",
      payload.date || "",
      payload.time || "",
      payload.tutorName || "",
      payload.tutorSubject || "",
      JSON.stringify(payload),
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Saved to Google Sheet" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ success: true, message: "SeekhoSaath webhook is active" }))
    .setMimeType(ContentService.MimeType.JSON);
}
