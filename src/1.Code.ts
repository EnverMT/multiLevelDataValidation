// Configure here your variables
const active_sheet_name = "Plan"
const active_range = "C2:D"
const category_sheet_name = "Категории v2"
const category_range = "A:B"

const mlc = new MultiLevelCategory(active_sheet_name, active_range, category_sheet_name, category_range)

function onEdit(e:GoogleAppsScript.Events.SheetsOnEdit) {
  mlc.onEdit(e)
}