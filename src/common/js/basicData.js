/**
 * 基础数据的取值处,都放在这里
 */

// 获取登录用户
function fetchLoginUser() {
    let user = {};
    $.ajax({
        url: '/api/rbac/getLoginEmployee',
        type: "POST",
        datatype: 'json',
        async: false,
        showServermsg: false
    }).done(resp=>{
        if (resp.code == '0000') {
            user = resp.data;
            user.isAdmin = user.level == 1000 || user.level == 100;
        }
    });
    return user;
}

// 获取登录用户权限Pcode数组,转成MAP存储便于匹配,即[{'pcode': true}, {'pcode': true}]的结构
function fetchLoginUserPcode() {
    let funCollection = [];
    $.ajax({
        url: '/api/rbac/getLoginEmployeePcode',
        type: "POST",
        datatype: 'json',
        async: false,
        showServermsg: false
    }).done(function (resp) {
        if (resp.code == '0000') {
            let map = {};
            $.each(resp.data, function(i, v) {
                map[v] = true;
            });
            funCollection = map;
        }
    });
    return funCollection;
}

// 当前页面相对路径
const pathname = window.location.pathname == '/' ? '/index.html' : window.location.pathname;

// 获取面包屑数据
let $curMenu;
function getBreadcrumb() {
    $curMenu = $('#j_topMenu').find('a[href="' + pathname + '"]');
    var tmpPath = [],
        $subMenu,
        urlPath = window.location.pathname;

    if (urlPath == '/' || urlPath == '/index.html') {
        // 首页

    } else {
        if($curMenu.length>0){
            tmpPath.push($curMenu);
            // 根据子菜单的样式, 获取子菜单对象
            $subMenu = $curMenu.closest('.sub-menu');
            if ($subMenu.length > 0 ) {
                tmpPath.push($subMenu.siblings('a'));
            }
        }
    }

    return $.map(tmpPath,function (v) {
        return {
            title: $.trim(v.text()),
            url: v.attr('href')
        }
    }).reverse();
}

// 激活当前页面对应菜单项
function activeCurrentMenu() {
    $curMenu.parent().addClass('active');
    $curMenu.closest('.j_topMenu').addClass('active');
}

// 获得页面标题
function getPageTitle() {
    var pageTitle = $curMenu.length > 0 ? $curMenu.text() : '';
    return pageTitle;
}

// 获取数据状态下拉框
function getDataStatusSelect() {
    return {
        list:[{id:"0",desc:"正常"},{id:"1",desc:"禁用"}],
        map:{"0":"正常","1":"禁用"},
    }
}

// 获取上下架状态下拉框
function getUpDownStatusSelect() {
    return {
        list:[{id:"1",desc:"上架"},{id:"0",desc:"下架"}],
        map:{"1":"上架","0":"下架"},
    }
}



// 获取预约状态下拉框
function getReserveStatusSelect() {
    return {
        list:[{id:"10",desc:"待上课"},{id:"20",desc:"已上课"},{id:"30",desc:"用户取消"},{id:"31",desc:"系统取消"},{id:"40",desc:"已关闭"}],
        map:{"10":"待上课","20":"已上课","30":"用户取消","31":"系统取消","40":"已关闭"},
    }
}

// 获取性别下拉框
function getSexSelect() {
    return {
        list:[{id:"1",desc:"男"},{id:"2",desc:"女"}],
    }
}

// 获取正常状态的的菜单的树结构数据
function getMenuTree(){
    let menuTree = [];
    $.ajax({
        url: '/api/rbac/getMenuTree',
        type: "POST",
        async: false, 
        data:'',
        showServermsg: true
    }).done(function(resp) {
        if (resp.code == '0000') {
            menuTree = resp.data;
        } 
    });
    return menuTree;
}

// 获取所有的权限数据的tree结构和map结构
function getPermissionsTreeMap(){
    let rs = {};
    $.ajax({
        url: '/api/rbac/getPermissionsTreeMap',
        type: "POST",
        async: false, 
        data:'',
        showServermsg: true
    }).done(function(resp) {
        if (resp.code == '0000') {
            rs = resp.data;
        } 
    });
    return rs;
}

// 获取正常状态的部门下拉框数据
function getDepartmentSelect(){
    let departmentSelect = [];
    let map = {};
    $.ajax({
        url: '/api/rbac/getDepartmentSelect',
        type: "POST",
        async: false, 
        data:'',
        showServermsg: true
    }).done(function(resp) {
        if (resp.code == '0000') {
            departmentSelect = resp.data;
            departmentSelect.forEach(d => {
                map[d.did]=d.dname;
            });
        } 
    });
    return {"list":departmentSelect,"map":map};
}

// 获取正常状态的角色下拉框数据
function getRoleSelect(){
    let roleSelect = [];
    $.ajax({
        url: '/api/rbac/getRoleSelect',
        type: "POST",
        async: false, 
        data: '',
        showServermsg: true
    }).done(function(resp) {
        if (resp.code == '0000') {
            roleSelect = resp.data;
        } 
    });
    return roleSelect;
}

// 获取省下拉框
function getProvinceSelect(){
    let povinceSelect = [];
    $.ajax({
        url: '/api/select/getProvinceSelect',
        type: "POST",
        async: false, 
        data: '',
        showServermsg: true
    }).done(function(resp) {
        if (resp.code == '0000') {
            povinceSelect = resp.data;
        } 
    });
    return povinceSelect;
}

// 获取市下拉框
function getCitySelect(provinceCode){
    let citySelect = [];
    $.ajax({
        url: '/api/select/getCitySelect',
        type: "POST",
        async: false, 
        data: {'provinceCode':provinceCode},
        showServermsg: true
    }).done(function(resp) {
        if (resp.code == '0000') {
            citySelect = resp.data;
        } 
    });
    return citySelect;
}

// 获取区下拉框
function getDistrictSelect(cityCode){
    let districtSelect = [];
    $.ajax({
        url: '/api/select/getDistrictSelect',
        type: "POST",
        async: false, 
        data: {'cityCode':cityCode},
        showServermsg: true
    }).done(function(resp) {
        if (resp.code == '0000') {
            districtSelect = resp.data;
        } 
    });
    return districtSelect;
}

// 获取教学点
function getTeachPlaceSelect(provinceCode,cityCode,districtCode){
    let teachPlaceSelect = [];
    let dataObj = {};
    if(provinceCode){
        dataObj["provinceCode"]=provinceCode;
    }
    if(cityCode){
        dataObj["cityCode"]=cityCode;
    }
    if(districtCode){
        dataObj["districtCode"]=districtCode;
    }
    $.ajax({
        url: '/api/select/getTeachPlaceSelect',
        type: "POST",
        async: false, 
        data: dataObj,
        showServermsg: true
    }).done(function(resp) {
        if (resp.code == '0000') {
            teachPlaceSelect = resp.data;
        } 
    });
    return teachPlaceSelect;
}

// 获取老师下拉框
function getTeacherSelect(teacherPhone ){
    let data = '';
    if(teacherPhone ) {
         data = {teacherPhone : teacherPhone }
    }
    let teacherSelect = [];
    $.ajax({
        url: '/api/select/getTeacherSelect',
        type: "POST",
        async: false, 
        data: data,
        showServermsg: true
    }).done(function(resp) {
        if (resp.code == '0000') {
            teacherSelect = resp.data;
        } 
    });
    return teacherSelect;
}

// 获取主题下拉框
function getThemeSelect(){
    let themeSelect = [];
    $.ajax({
        url: '/api/select/getThemeSelect',
        type: "POST",
        async: false, 
        data: '',
        showServermsg: true
    }).done(function(resp) {
        if (resp.code == '0000') {
            themeSelect = resp.data;
        } 
    });
    return themeSelect;
}

// 获取课程类型
function getCourseTypeSelect(){
    let courseTypeList = [];
    let courseTypeMap = {};
    $.ajax({
        url: '/api/select/getCourseTypeSelect',
        type: "POST",
        async: false, 
        data: '',
        showServermsg: true
    }).done(function(resp) {
        if (resp.code == '0000') {
            courseTypeList = resp.data;
            courseTypeList.forEach(
                (idx,obj)=>{
                    courseTypeMap[idx.courseTypeId]=idx.courseTypeName;
                }
            )
        } 
    });
    return {"list":courseTypeList,"map":courseTypeMap};
}

// 获取教学点类型
function getTeachPlaceTypeSelect(){
    let teachPlaceTypeList = [];
    let teachPlaceTypeMap = {};
    $.ajax({
        url: '/api/select/getTeachPlaceTypeSelect',
        type: "POST",
        async: false, 
        data: '',
        showServermsg: true
    }).done(function(resp) {
        if (resp.code == '0000') {
            teachPlaceTypeList = resp.data;
            teachPlaceTypeList.forEach(
                (idx,obj)=>{
                    teachPlaceTypeMap[idx.teachPlaceTypeId]=idx.teachPlaceName;
                }
            )
        } 
    });
    return {"list":teachPlaceTypeList,"map":teachPlaceTypeMap};
}


// 获取课程下拉框
function getCourseSelect(themeId, courseType){
    let courseSelect = [];
    let dataObj = {};
    if(themeId){
        dataObj["themeId"]=themeId;
    }
    if(courseType){
        dataObj["courseType"]=courseType;
    }
    
    $.ajax({
        url: '/api/select/getCourseSelect',
        type: "POST",
        async: false, 
        data: dataObj,
        showServermsg: true
    }).done(function(resp) {
        if (resp.code == '0000') {
            courseSelect = resp.data;
        } 
    });
    return courseSelect;
}

// 获取商户下拉框
function getMerchantSelect(){
    let merchantSelect = [];
    $.ajax({
        url: '/api/select/getMerchantSelect',
        type: "POST",
        async: false, 
        data: '',
        showServermsg: true
    }).done(function(resp) {
        if (resp.code == '0000') {
            merchantSelect = resp.data;
        } 
    });
    return merchantSelect;
}

// 获取教学点树形结构
function getTeachPlaceTree(){
    let self = this;
    let treeList = [];
    let treeMap = {};
    $.ajax({
        url: '/api/schedule/getTeachPlaceTree',
        type: "POST",
        async: false, 
        data: '',
        showServermsg: true
    }).done(function(resp) {
        if (resp.code == '0000') {
            treeList = resp.data; 
        } 
    });
    return {"treeList":treeList,"treeMap":treeMap};
}

// 记录类型下拉框
function getLcoinRecordTypeSelect(){
    let lcoinRecordTypeSelect = [];
    $.ajax({
        url: '/api/select/getAccountRecordTypeSelect',
        type: "POST",
        async: false, 
        data: '',
        showServermsg: true
    }).done(function(resp) {
        if (resp.code == '0000') {
            lcoinRecordTypeSelect = resp.data;
        } 
    });
    return lcoinRecordTypeSelect;
}

// 获取用户下拉框
function getUserSelect(phone){
    let userSelect = [];
    $.ajax({
        url: '/api/select/getUserSelect',
        type: "POST",
        async: false, 
        data: {phone: phone},
        showServermsg: true
    }).done(function(resp) {
        if (resp.code == '0000') {
            userSelect = resp.data;
        } 
    });
    return userSelect;
}

// 获取排课状态下拉框
function getScheduleStatusSelect(){
    let scheduleStatusSelect = [];
    let scheduleStatusMap = {};
    $.ajax({
        url: '/api/select/getScheduleStatusSelect',
        type: "POST",
        async: false, 
        data: '',
        showServermsg: true
    }).done(function(resp) {
        if (resp.code == '0000') {
            scheduleStatusSelect = resp.data;
            scheduleStatusSelect.forEach(
                (idx,obj)=>{
                    scheduleStatusMap[idx.scheduleStatusId]=idx.scheduleStatusName;
                }
            )
        } 
    });
    return {'list':scheduleStatusSelect, 'map':scheduleStatusMap};
}

// 获取排课状态下拉框
function getRechargeOrderStatusSelect(){
    return {
        list:[{id:"0",desc:"待支付"},{id:"100",desc:"支付中"},{id:"200",desc:"已支付"},{id:"300",desc:"支付失败"},{id:"400",desc:"已退款"},{id:"500",desc:"已取消"}],
        map:{"0":"待支付","100":"支付中","200":"已支付","300":"支付失败","400":"已退款","500":"已取消"},

    }
}

// 获取学生下拉框
function getStudentSelect(userId){
    let studentSelect = [];
    $.ajax({
        url: '/api/select/getStudentSelect',
        type: "POST",
        async: false, 
        data: {userId: userId},
        showServermsg: true
    }).done(function(resp) {
        if (resp.code == '0000') {
            studentSelect = resp.data;
        } 
    });
    return studentSelect;
}

// 获取排课下拉框
function getCourseScheduleSelect(searchScheduformObj){
    let courseScheduleSelect = [];
    let data = searchScheduformObj;
    $.ajax({
        url: '/api/select/getCourseScheduleSelect',
        type: "POST",
        async: false, 
        data: data,
        showServermsg: true
    }).done(function(resp) {
        if (resp.code == '0000') {
            courseScheduleSelect = resp.data;
        } 
    });
    return courseScheduleSelect;
}

// 渠道号下拉框
function getChannelSelect(){
    let channelSelect = [];
    let channelSelectMap = {};
    $.ajax({
        url: '/api/select/getChannelSelect',
        type: "POST",
        async: false, 
        data: '',
        showServermsg: true
    }).done(function(resp) {
        if (resp.code == '0000') {
            channelSelect = resp.data;
            channelSelect.forEach ((item,index)=>{
                channelSelectMap[item.channelNo] = item.channelName;
            })
        } 
    });
    return {'list':channelSelect, 'map':channelSelectMap};
}





// ES6的export和export default
export default {
    fetchLoginUser,
    fetchLoginUserPcode,
    getBreadcrumb,
    activeCurrentMenu,
    getPageTitle,
    getDataStatusSelect,
    getUpDownStatusSelect,
    getScheduleStatusSelect,
    getReserveStatusSelect,
    getMenuTree,
    getPermissionsTreeMap,
    getDepartmentSelect,
    getRoleSelect,
    getProvinceSelect,
    getCitySelect,
    getDistrictSelect,
    getTeachPlaceSelect,
    getTeacherSelect,
    getThemeSelect,
    getCourseTypeSelect,
    getCourseSelect,
    getMerchantSelect,
    getTeachPlaceTree,
    getTeachPlaceTypeSelect,
    getLcoinRecordTypeSelect,
    getUserSelect,
    getSexSelect,
    getRechargeOrderStatusSelect,
    getStudentSelect,
    getCourseScheduleSelect,
    getChannelSelect,
}
