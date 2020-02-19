const classListName = "classList";
const workListName = "workList";
const sortName = "sort";
const filtName = "filt";
selectedClassId = '';
classListData = {};
sortSta = 'asc'
filtStatus = 0

utools.onPluginEnter(({ code, type, payload }) => {
    initDb(function () {
        if (code == 'todoList') {
            if (showClassList()) {
                getSortWithDb(function () {
                    getFiltWithDb(showWorkList(selectedClassId))
                })
            }
        }
    })
});

function autoHeight(elem) {
    elem.style.height = 'auto';
    elem.scrollTop = 0; //防抖动
    elem.style.height = elem.scrollHeight + 'px';
}

function showClassList() {
    console.log('showClassList')
    var theData = utools.db.get(classListName);
    var classListJson = theData.data;
    var listJson = classListJson.list
    classListData = listJson
    var htmlClassList = '';
    console.log(listJson)
    console.log(Object.keys(listJson).length)
    if (Object.keys(listJson).length > 0) {
        k = classListJson.firstId
        if (selectedClassId == '') {
            selectedClassId = classListJson.firstId
        }
        i = 0
        while (listJson[k]) {
            console.log('while:' + k)
            if (i > 200) {
                break;
            }
            if (listJson[k]['id'] == selectedClassId) {
                active = ' class ="active" ';
            } else {
                active = '';
            }
            htmlClassList += '<li data-id="' + listJson[k]['id'] + '" data-content="' + listJson[k]['content'] + '" ' + active + '>' + listJson[k]['content'] + '</li>';
            k = listJson[k]['childrenId']
            i++;
        }
        $('.class-list ul').html(htmlClassList);
        return true;
    }
    return false;
}

/**
 * 新建分类
 */
function addClass() {
    theData = utools.db.get(classListName);
    newId = createGuid();
    if (theData) {
        classListJson = theData.data;
        classListJson['list'][newId] = {
            "parentId": classListJson.lastId,
            "childrenId": 0,
            "id": newId,
            "content": "新建分类"
        };
        if (classListJson['list'][classListJson.lastId]) {
            classListJson['list'][classListJson.lastId]["childrenId"] = newId;
        }
        if (classListJson.firstId == 0) {
            classListJson.firstId = newId;
        }
        classListJson.lastId = newId;
        utools.db.put({
            _id: theData._id,
            data: classListJson,
            _rev: theData._rev
        });
    }
    selectedClassId = newId
    showClassList();
    showWorkList(newId);
}

//分类名称修改提交
function classListLiSubmit() {
    oldContent = classListData[selectedClassId]['content'];
    newContent = $('.work-list-header-input').val();
    if (oldContent != newContent) {
        //修改数据
        editClassName(selectedClassId, newContent);
        showClassList();
    }
}
function editClassName(theId, newContent) {
    var theData = utools.db.get(classListName);
    if (theData && Object.keys(newContent).length > 0) {
        classListJson = theData.data;
        classListJson['list'][theId]['content'] = newContent;
        utools.db.put({
            _id: theData._id,
            data: classListJson,
            _rev: theData._rev
        });
    }
    showClassList();
}

/**
 * 删除分类
 */
function deleteClass(theClassId) {
    console.log('deleteClass')
    console.log(theClassId)
    theData = utools.db.get(classListName);
    classListJson = theData.data;
    listJson = classListJson.list

    if (classListJson['lastId'] == theClassId) {
        //如果是最后一个
        classListJson['lastId'] = listJson[theClassId]['parentId']
    } else {
        listJson[listJson[theClassId]['childrenId']]['parentId'] = listJson[theClassId]['parentId']
    }

    if (classListJson['firstId'] == theClassId) {
        //如果是第一个
        classListJson['firstId'] = listJson[theClassId]['childrenId']
    } else {
        listJson[listJson[theClassId]['parentId']]['childrenId'] = listJson[theClassId]['childrenId']
    }

    var patentId = listJson[theClassId]['parentId']
    delete listJson[theClassId];
    classListJson['list'] = listJson;

    utools.db.put({
        _id: theData._id,
        data: classListJson,
        _rev: theData._rev
    });

    deleteWorkDataByClassId(theClassId)

    if (patentId == 0) {
        selectedClassId = ''
    } else {
        selectedClassId = patentId;
    }
    showClassList();
    showWorkList(selectedClassId);
}

function rmData() {
    utools.db.remove(classListName);
    utools.db.remove(workListName);
}

function createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


/**
 * 添加任务
 */
function addWorkList(classId, theContent) {
    if (classId == '') {
        alert('请先选定清单分类');
        return false;
    }
    if (Object.keys(theContent).length <= 0) {
        return false;
    }
    var theData = utools.db.get(workListName);
    if (!theData) {
        workListJson = {
            "list": {}
        };
        utools.db.put({
            _id: workListName,
            data: workListJson
        });
        theData = utools.db.get(workListName);
    }
    workListJson = theData.data;
    if (!workListJson['list'][classId]) {
        workListJson['list'][classId] = {};
    }
    var timestamp = Date.parse(new Date());
    newWorkId = createGuid();
    workListJson['list'][classId][newWorkId] = {
        "id": newWorkId,
        "content": theContent,
        "timestamp": timestamp,
        "status": 0,
    };
    utools.db.put({
        _id: theData._id,
        data: workListJson,
        _rev: theData._rev
    });
    showWorkList(classId);
}
/**
 * 展示任务列表
 */
function showWorkList(theClassId) {
    console.log('showWorkList:' + theClassId)
    $('.work-list ul').html('');
    var theData = utools.db.get(workListName);
    var htmlStr = '';
    if (theClassId != selectedClassId) {
        selectedClassId = theClassId
    }
    if (theData['data']['list'][theClassId]) {
        theClassList = theData['data']['list'][theClassId];
        theClassList = Object.values(theClassList)
        theClassList.sort(compare('timestamp', sortSta));
        var bgClass = ''
        var theDay = 0;
        for (k in theClassList) {
            //状态筛选
            if (filtStatus == 1 && theClassList[k]['status'] != 0) {
                continue;
            } else if (filtStatus == 2 && theClassList[k]['status'] != 1) {
                continue;
            }

            var dateStr = timestampToDate(theClassList[k]['timestamp']);
            var tipStr = timestampToDateTime(theClassList[k]['timestamp']);
            if (theClassList[k]['status'] == 1) {
                checkBoxStr = 'checked '
                textareaStyleStr = ' style="text-decoration:line-through;color: #bbc;" ';
            } else {
                checkBoxStr = ''
                textareaStyleStr = '';
            }

            var date = new Date(theClassList[k]['timestamp']);
            var D = date.getDate() + '';
            if (theDay > 0 && theDay != D) {
                bgClass = 'bg2'
            } else {
                bgClass = ''
            }

            htmlStr += '<li data-work-id="' + theClassList[k]['id'] + '" class="' + bgClass + '">' +
                '<input class="textarea-choice-box" type="checkbox" ' + checkBoxStr + '/><span></span>' +
                '<textarea rows="1" oninput = "autoHeight(this)" ' + textareaStyleStr + '>' +
                theClassList[k]['content'] +
                '</textarea ><div class="work-list-li-tip v-tip" data-tip="' + tipStr + '">' + dateStr + '</div></li >';
            theDay = D
        }
    }
    $('.work-list ul').html(htmlStr);

    $('.work-list ul li textarea').each(function () {
        this.style.height = 'auto';
        this.scrollTop = 0; //防抖动
        this.style.height = this.scrollHeight + 'px';
    });

    //显示标题
    $('.work-list-header-input').val(classListData[theClassId]['content']);

    //刷新排序图标
    if (sortSta == 'asc') {
        $('.work-list-header-menu-sort').attr('src', 'assets/sort_asc.png')
    } else {
        $('.work-list-header-menu-sort').attr('src', 'assets/sort_desc.png')
    }
    //刷新过滤图标
    if (filtStatus == 1) {
        $('.work-list-header-menu-filt').attr('src', 'assets/status_1.png')
    } else if (filtStatus == 2) {
        $('.work-list-header-menu-filt').attr('src', 'assets/status_2.png')
    } else {
        $('.work-list-header-menu-filt').attr('src', 'assets/status_0.png')
    }
    $('.work-list textarea').attr('placeholder', '删除键触发删除')
    // autoAddListHeight();
}

/**
 * 任务修改
 */
function workListSubmit(that) {
    var theWorkId = $(that).parent('li').attr('data-work-id');
    var theContent = $(that).val();
    var theWorkData = utools.db.get(workListName);
    var workListJson = theWorkData.data
    if (workListJson['list'][selectedClassId].hasOwnProperty(theWorkId)) {
        workListJson['list'][selectedClassId][theWorkId]['content'] = theContent
        utools.db.put({
            _id: theWorkData._id,
            data: workListJson,
            _rev: theWorkData._rev
        });
    }
    showWorkList(selectedClassId);
}

/**
 * 切换完成状态
 */
function changeCheckBox(theWorkId, theStatus) {
    var theWorkData = utools.db.get(workListName);
    var workListJson = theWorkData.data
    if (workListJson['list'][selectedClassId][theWorkId]) {
        workListJson['list'][selectedClassId][theWorkId]['status'] = theStatus
        utools.db.put({
            _id: theWorkData._id,
            data: workListJson,
            _rev: theWorkData._rev
        });
    }
    utools.db.put({
        _id: theWorkData._id,
        data: workListJson,
        _rev: theWorkData._rev
    });
}

/**
 * 删除任务
 */
function deleteWork(theClassId, theWorkId) {
    var theWorkData = utools.db.get(workListName);
    var workListJson = theWorkData.data
    if (workListJson['list'][theClassId].hasOwnProperty(theWorkId)) {
        delete workListJson['list'][theClassId][theWorkId];
        utools.db.put({
            _id: theWorkData._id,
            data: workListJson,
            _rev: theWorkData._rev
        });
    }
    showWorkList(selectedClassId);
}

function showData() {
    var theData1 = utools.db.get(classListName);
    console.log(theData1)
    var theData2 = utools.db.get(workListName);
    console.log(theData2)
}


/**
 * 排序
 */
var compare = function (prop, order) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (order == 'desc') {
            if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else {
                return 0;
            }
        } else {
            if (val1 > val2) {
                return -1;
            } else if (val1 < val2) {
                return 1;
            } else {
                return 0;
            }
        }
    }
}


function timestampToDate(timestamp) {
    var date = new Date(timestamp);
    Y = date.getFullYear() + '.';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
    D = date.getDate() + '';
    // h = date.getHours() + ':';
    // m = date.getMinutes() + ':';
    // s = date.getSeconds();
    // return Y + M + D + h + m + s;
    return Y + M + D;
}

function timestampToDateTime(timestamp) {
    var date = new Date(timestamp);
    Y = date.getFullYear() + '年';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
    D = date.getDate() + '日 ';
    h = date.getHours();
    if (h < 10) {
        h = '0' + h
    }
    h = h + ':'
    m = date.getMinutes();
    if (m < 10) {
        m = '0' + m
    }
    m = m + ':'
    s = date.getSeconds();
    if (s < 10) {
        s = '0' + s
    }
    return Y + M + D + h + m + s;
}


/**
 * 删除分类的任务数据
 */
function deleteWorkDataByClassId(theClassId) {
    var theWorkData = utools.db.get(workListName);
    var workListJson = theWorkData.data
    if (workListJson['list'].hasOwnProperty(theClassId)) {
        delete workListJson['list'][theClassId]
        utools.db.put({
            _id: theWorkData._id,
            data: workListJson,
            _rev: theWorkData._rev
        });
    }
}

/**
 * 从db获取排序方式配置项
 */
function getSortWithDb(func) {
    var theData = utools.db.get(sortName);
    if (theData && theData.data == 'asc') {
        sortSta = 'asc'
    } else {
        sortSta = 'desc'
    }
    func();
}

/**
 * 切换排序方式配置项
 * @param {*} func 
 */
function changeSortWithDb(func) {
    if (sortSta == 'desc') {
        sortSta = 'asc'
    } else {
        sortSta = 'desc'
    }
    var theData = utools.db.get(sortName);
    if (theData) {
        utools.db.put({
            _id: theData._id,
            data: sortSta,
            _rev: theData._rev
        })
    } else {
        utools.db.put({
            _id: sortName,
            data: sortSta,
        })
    }
    func();
}

function autoAddListHeight() {
    var wlfh = $('.add-list').outerHeight(true);
    console.log(wlfh);
    wlfh = (wlfh + 10) + 'px';
    console.log(wlfh);
    $('.work-list-footer').height(wlfh)
}

/**
 * 从db获取排序方式配置项
 */
function getFiltWithDb(func) {
    var theData = utools.db.get(filtName);
    if (theData && theData.data != 1 && theData.data != 2) {
        filtStatus = 0
    } else {
        filtStatus = theData.data
    }
    func();
}

/**
 * 切换过滤状态
 * @param {*} func 
 */
function changeFiltWithDb(func) {
    filtStatus = filtStatus + 1
    if (filtStatus > 2) {
        filtStatus = 0
    }
    var theData = utools.db.get(filtName);
    if (theData) {
        utools.db.put({
            _id: theData._id,
            data: filtStatus,
            _rev: theData._rev
        })
    } else {
        utools.db.put({
            _id: filtName,
            data: filtStatus,
        })
    }
    func();
}

function initDb(func) {
    newId = createGuid();
    if (!utools.db.get(classListName)) {
        classListJson = {
            "firstId": 0,
            "lastId": 0,
            "list": {}
        };
        utools.db.put({
            _id: classListName,
            data: classListJson
        });
    }

    if (!utools.db.get(workListName)) {
        workListJson = {
            "list": {}
        };
        utools.db.put({
            _id: workListName,
            data: workListJson
        });
    }
    func();
}