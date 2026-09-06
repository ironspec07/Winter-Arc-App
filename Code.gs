/**
 * Winter Arc 2026 Google Sheets sync backend.
 * 1) Create a blank Google Sheet.
 * 2) Extensions -> Apps Script, paste this file.
 * 3) Set SECRET below to a private value.
 * 4) Deploy -> New deployment -> Web app -> Execute as Me -> Who has access: Anyone.
 * 5) Put the deployment URL and the same secret in the app.
 */
const SECRET = 'CHANGE_THIS_TO_A_PRIVATE_SECRET';
const SHEET_NAME = 'Winter Arc Data';

function getSheet_(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) sh.appendRow(['Date','JSON','Updated At']);
  return sh;
}
function doPost(e){
  try{
    const body = JSON.parse(e.postData.contents || '{}');
    if (body.secret !== SECRET) return ContentService.createTextOutput('Unauthorized');
    if (body.action !== 'upsert') return ContentService.createTextOutput('Unknown action');
    const sh = getSheet_();
    const payload = body.payload && body.payload.data ? body.payload.data : {};
    const rows = sh.getDataRange().getValues();
    const rowByDate = {};
    for (let i=1;i<rows.length;i++) rowByDate[String(rows[i][0])] = i+1;
    Object.keys(payload).forEach(date=>{
      const row = [date, JSON.stringify(payload[date]), new Date()];
      if (rowByDate[date]) sh.getRange(rowByDate[date],1,1,3).setValues([row]);
      else sh.appendRow(row);
    });
    return ContentService.createTextOutput('OK');
  }catch(err){ return ContentService.createTextOutput('ERROR: '+err.message); }
}
function doGet(e){
  const secret = e.parameter.secret || '';
  const callback = e.parameter.callback || '';
  let out;
  try{
    if (secret !== SECRET) throw new Error('Unauthorized');
    const sh = getSheet_();
    const rows = sh.getDataRange().getValues();
    const data = {};
    for (let i=1;i<rows.length;i++) if (rows[i][0]) data[String(rows[i][0])] = JSON.parse(String(rows[i][1] || '{}'));
    out = {ok:true,data:data};
  }catch(err){ out = {ok:false,error:err.message}; }
  const json = JSON.stringify(out);
  if (callback) return ContentService.createTextOutput(callback+'('+json+');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}
