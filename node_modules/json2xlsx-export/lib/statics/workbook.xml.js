'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var DEFAULT = '<sheet state="visible" name="Sheet1" sheetId="1" r:id="rId3"/>';

var createSheets = function createSheets(sheets) {
  if (!sheets || sheets.lenght === 0) {
    return DEFAULT;
  }
  return sheets.map(function (_ref, ind) {
    var name = _ref.name;
    return '<sheet state="visible" name="' + (name || '') + '" sheetId="' + ind + '" r:id="rId' + (ind + 1) + '"/>';
  });
};

var buildWorkBook = function buildWorkBook(sheets) {
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n        <workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" \n            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" \n            xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main"\n            xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" \n            xmlns:mv="urn:schemas-microsoft-com:mac:vml" \n            xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" \n            xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" \n            xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main">\n            <workbookPr/>\n            <sheets>\n                ' + createSheets(sheets) + '\n            </sheets>\n            <definedNames/>\n            <calcPr/>\n            </workbook>';
};
exports.default = buildWorkBook;