# json2xlsx-export
_Lightweight in browser `.xlsx` exporter._

### How it use since v1.2.0

```sh
import json2xlsx from 'json2xlsx-export';

const config = {
  filename: 'AwesomeFile',
  sheets: [
    {
      name: 'Sheet1',
      data: [
        [{
          value: 'Text1',
          type: 'string'
        },{
          value: 'Text2',
          type: 'string'
        }, {
          value: 1000,
          type: 'number'
        }]
      ]
    },
    {
      name: 'Sheet2',
      data: [
        [{
          value: 'New text1',
          type: 'string'
        },{
          value: 'New text2',
          type: 'string'
        }, {
          value: 2000,
          type: 'number'
        }]
      ]
    }
  ]
};

json2xlsx(config);
```
### How it use in earlier versions

```sh
import json2xlsx from 'json2xlsx-export';

const config = {
  filename: 'AwesomeFile',
  sheet: {
    data: [
      [{
        value: 'Text',
        type: 'string'
      },{
        value: 'Another text',
        type: 'string'
      }, {
        value: 1000,
        type: 'number'
      }]
    ]
  }
};

json2xlsx(config);
```
