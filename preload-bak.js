const jx = require('json2excel')


exportToExcel = (jsonData) => {
    // var filepathDir = utools.showSaveDialog({
    //     title: '保存位置',
    //     defaultPath: utools.getPath('downloads'),
    //     buttonLabel: '保存'
    // })
    // if (filepathDir == undefined) {
    //     filepathDir = utools.getPath('downloads')
    // }
    // if (filepathDir == false) {
    //     utools.showNotification('保存失败，请选择合适的保存位置')
    //     return false
    // }
    var filepathDir = utools.getPath('downloads')
    var filePathSeparate = "/"
    if (utools.isWindows()) {
        filePathSeparate = "\\"
    }
    var fullFilePath = filepathDir + filePathSeparate + "todoList-export-" + new Date().getTime() + ".xlsx"
    var data = {
        sheets: [{
            header: {
                'content': '记录内容',
                'status': '状态',
                'create_time': '创建时间',
                'finish_time': '完成时间',
            },
            items: jsonData.items,
            sheetName: jsonData.sheetName,
        }],
        filepath: fullFilePath
    }

    jx.j2e(data, function (err) {
        if (err) {
            utools.showNotification('保存失败(' + err + ')')
        } else {
            utools.shellShowItemInFolder(fullFilePath)
        }
    });
}

