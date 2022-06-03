import JSZip from 'jszip';
import FileSaver from 'file-saver';

import validator from './validator';
import generatorRows from './formatters/rows/generatorRows';

import workbookXML from './statics/workbook.xml';
import workbookXMLRels from './statics/workbook.xml.rels';
import rels from './statics/rels';
import contentTypes from './statics/[Content_Types].xml';
import templateSheet from './templates/worksheet.xml';

export const generateXMLWorksheet = (rows) => {
  const XMLRows = generatorRows(rows);
  return templateSheet.replace('{placeholder}', XMLRows);
};

export default (config) => {
  if (!validator(config)) {
    return;
  }

  const zip = new JSZip();
  const xl = zip.folder('xl');
  xl.file('workbook.xml', workbookXML(config.sheets));
  xl.file('_rels/workbook.xml.rels', workbookXMLRels(config.sheets.length));
  zip.file('_rels/.rels', rels);
  zip.file('[Content_Types].xml', contentTypes);

  (config.sheets || []).forEach((sheet, ind) => {
    const worksheet = generateXMLWorksheet(sheet.data);
    xl.file(`worksheets/sheet${ind + 1}.xml`, worksheet);
  });


  zip.generateAsync({ type: 'blob' })
    .then((blob) => {
      FileSaver.saveAs(blob, `${config.filename}.xlsx`);
    });
};
