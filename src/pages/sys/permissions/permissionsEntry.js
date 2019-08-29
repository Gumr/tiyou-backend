import Vue from 'vue';
import AppHeader from 'components/layout/AppHeader.vue';
import AppMenu from 'components/layout/AppMenu.vue';
import AppBreadcrumb from 'components/layout/AppBreadcrumb.vue';
import AppFooter from 'components/layout/AppFooter.vue';
import DataList from './DataList.vue';
import EditModal from './EditModal.vue';
import basicData from 'common/js/basicData.js';


var vm = new Vue({
    el: '#app',
    // 组件
    components: {
        AppHeader,
        AppMenu,
        AppBreadcrumb,
        AppFooter,
        DataList,
        EditModal
    },
    // 数据
    data: {
        dataStatusList: [],   //状态下拉框LIST
        dataStatusMap: {},    //状态MAP
        permissionsList: [],    
    },
    // 创建
    created: function() {
        let dataStatusSelect = basicData.getDataStatusSelect();
        this.dataStatusList = dataStatusSelect.list;
        this.dataStatusMap = dataStatusSelect.map;

        this.permissionsList = basicData.getPermissionsTreeMap().list;
    },
});

window.vm = vm;