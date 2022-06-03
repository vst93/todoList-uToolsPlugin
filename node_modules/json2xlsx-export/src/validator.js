import {
  MISSING_KEY_FILENAME,
  INVALID_TYPE_FILENAME,
  INVALID_TYPE_SHEET,
  INVALID_TYPE_SHEET_DATA
} from './commons/constants';

const childValidator = (array = []) => {
  return array.every(item => Array.isArray(item));
};

export default (config) => {
  if (!config.filename) {
    console.error(MISSING_KEY_FILENAME);
    return false;
  }

  if (typeof config.filename !== 'string') {
    console.error(INVALID_TYPE_FILENAME);
    return false;
  }

  if (!Array.isArray(config.sheets)) {
    console.error(INVALID_TYPE_SHEET);
    return false;
  }

  for (let i = 0; i < config.sheets.length; (i += 1)) {
    if (!childValidator(config.sheets[i].data)) {
      console.error(INVALID_TYPE_SHEET_DATA);
      return false;
    }
  }

  return true;
};
