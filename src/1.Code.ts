// Configure here your variables
const active_sheet_name = "Active_sheet";
const active_range = "B2:E";
const category_sheet_name = "category_sheet";
const category_range = "A2:D";
const show_toast_message = true;

const mlc = new MultiLevelDataValidation(active_sheet_name, active_range, category_sheet_name, category_range, show_toast_message)

function onEdit(e: GoogleAppsScript.Events.SheetsOnEdit) {
  mlc.onEdit(e)
}