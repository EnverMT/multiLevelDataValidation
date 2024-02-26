"use strict";
class MultiLevelCategory {
    constructor(active_sheet_name, active_range, category_sheet_name, category_range, show_toast_message = true) {
        this.config = {
            ACTIVE_SHEET_NAME: active_sheet_name,
            ACTIVE_RANGE: active_range,
            CATEGORY_SHEET_NAME: category_sheet_name,
            CATEGORY_RANGE: category_range,
            SHOW_TOAST_MESSAGE: show_toast_message
        };
        this.categories = this.getCategories(this.config.CATEGORY_SHEET_NAME, this.config.CATEGORY_RANGE);
    }
    onEdit(e) {
        this.event = {
            source: e.source,
            range: e.range,
            value: e.value
        };
        if (this.isRangeModified(this.config.ACTIVE_SHEET_NAME, this.config.ACTIVE_RANGE)) {
            return this.setDataValidations(this.config.ACTIVE_SHEET_NAME, this.config.ACTIVE_RANGE);
        }
        if (this.isRangeModified(this.config.CATEGORY_SHEET_NAME, this.config.CATEGORY_RANGE)) {
            this.event.range = this.event.source.getRange(this.config.ACTIVE_RANGE);
            this.categories = this.getCategories(this.config.CATEGORY_SHEET_NAME, this.config.CATEGORY_RANGE);
            return this.setDataValidations(this.config.ACTIVE_SHEET_NAME, this.config.ACTIVE_RANGE);
        }
    }
    isRangeModified(sheet_name, sheet_range) {
        const sheet = this.event.source.getActiveSheet();
        if (sheet.getName() !== sheet_name)
            return false;
        // check if edited cell in observing range
        const aRange = sheet.getRange(sheet_range);
        if (this.event.range.getRow() < aRange.getRow() || this.event.range.getRow() > aRange.getLastRow())
            return false;
        if (this.event.range.getColumn() < aRange.getColumn() || this.event.range.getLastColumn() > aRange.getLastColumn())
            return false;
        // check column counts
        if (this.event.source.getSheetByName(this.config.CATEGORY_SHEET_NAME)?.getRange(this.config.CATEGORY_RANGE).getNumColumns() !=
            this.event.source.getSheetByName(this.config.ACTIVE_SHEET_NAME)?.getRange(this.config.ACTIVE_RANGE).getNumColumns()) {
            this.event.source.toast(`ERROR: Column count of Category table and Active table is not equal`);
            return false;
        }
        // show toast message
        if (this.config.SHOW_TOAST_MESSAGE)
            this.event.source.toast(`value=${this.event.value} row=${this.event.range.getRow()} col=${this.event.range.getColumn()}`);
        return true;
    }
    // get hierarhial object from given sheet and range
    getCategories(sheet_name, range) {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name);
        if (!sheet)
            throw new Error("Sheet not found");
        const catArray = sheet.getRange(range).getValues();
        return this.arrayToHierarchy(catArray);
    }
    // Transforms two dimensional array to hierarhial object
    arrayToHierarchy(arr) {
        const hierarchy = {};
        arr.forEach(innerArray => {
            if (!innerArray)
                return;
            let currentLevel = hierarchy;
            innerArray.forEach((key, index) => {
                if (!key)
                    return;
                if (!currentLevel[key]) {
                    currentLevel[key] = {};
                }
                currentLevel = currentLevel[key];
            });
        });
        return hierarchy;
    }
    hierarhyToArrArr(categories, arr) {
        let current = categories;
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            result.push(Object.keys(current));
            if (!current[arr[i]])
                break;
            current = current[arr[i]];
        }
        return result;
    }
    // clears previous DataValidations and set new DataValidation
    setDataValidations(sheet_name, sheet_range) {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name);
        if (!sheet)
            throw new Error("Sheet not found");
        const activeRange = sheet.getRange(sheet_range);
        const activRange = sheet.getRange(this.event.range.getRow(), activeRange.getColumn(), this.event.range.getNumRows(), activeRange.getNumColumns());
        const rangeValues = activRange.getValues();
        activRange.clearDataValidations();
        const rules = [];
        rangeValues.forEach((row, rowIndex, rowArr) => {
            const rowRules = [];
            if (!row)
                return false;
            const arr2 = this.hierarhyToArrArr(this.categories, row);
            row.forEach((cell, colIndex, colArr) => {
                if (!arr2[colIndex]) {
                    rowRules.push(null);
                    return false;
                }
                const rule = SpreadsheetApp.newDataValidation()
                    .requireValueInList(arr2[colIndex])
                    .setAllowInvalid(false)
                    .build();
                rowRules.push(rule);
            });
            rules.push(rowRules);
        });
        return activRange.setDataValidations(rules);
    }
}
