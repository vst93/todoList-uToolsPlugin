const createRelationShips = (length) => {
  const relashionships = [];
  for (let i = 0; i < length; i += 1) {
    relashionships.push(
        `<Relationship Id="rId${i + 1}" Target="worksheets/sheet${i + 1}.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet"/>`
    );
  }
  return relashionships;
};

const buildRelationship = length => (
 `<?xml version="1.0" ?>
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
        ${createRelationShips(length)}
    </Relationships>`
);

export default buildRelationship;
