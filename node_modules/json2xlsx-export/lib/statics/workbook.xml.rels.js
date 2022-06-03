"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var createRelationShips = function createRelationShips(length) {
    var relashionships = [];
    for (var i = 0; i < length; i += 1) {
        relashionships.push("<Relationship Id=\"rId" + (i + 1) + "\" Target=\"worksheets/sheet" + (i + 1) + ".xml\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet\"/>");
    }
    return relashionships;
};

var buildRelationship = function buildRelationship(length) {
    return "<?xml version=\"1.0\" ?>\n    <Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">\n        " + createRelationShips(length) + "\n    </Relationships>";
};

exports.default = buildRelationship;