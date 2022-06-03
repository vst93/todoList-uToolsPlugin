'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('./commons/constants');

var childValidator = function childValidator() {
  var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  return array.every(function (item) {
    return Array.isArray(item);
  });
};

exports.default = function (config) {
  if (!config.filename) {
    console.error(_constants.MISSING_KEY_FILENAME);
    return false;
  }

  if (typeof config.filename !== 'string') {
    console.error(_constants.INVALID_TYPE_FILENAME);
    return false;
  }

  if (!Array.isArray(config.sheets)) {
    console.error(_constants.INVALID_TYPE_SHEET);
    return false;
  }

  for (var i = 0; i < config.sheets.length; i += 1) {
    if (!childValidator(config.sheets[i].data)) {
      console.error(_constants.INVALID_TYPE_SHEET_DATA);
      return false;
    }
  }

  return true;
};