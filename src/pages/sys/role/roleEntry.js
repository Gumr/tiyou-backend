import Vue from 'vue';
import AppHeader from 'components/layout/AppHeader.vue';
import AppMenu from 'components/layout/AppMenu.vue';
import AppBreadcrumb from 'components/layout/AppBreadcrumb.vue';
import AppFooter from 'components/layout/AppFooter.vue';
import DataList from './DataList.vue';
import EditModal from './EditModal.vue';
import PermissionsModal from './PermissionsModal.vue';

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
        EditModal,
        PermissionsModal
    },
    // 数据
    data: {
        dataStatusList: [],         //状态下拉框LIST
        dataStatusMap: {},          //状态MAP
        permissionsList: [],        //树状结构的权限List
        permissionsMap: [],         //权限Map => {pid:object},用于根据id查找权限对象
    },
    // 创建
    created: function() {
        let dataStatusSelect = basicData.getDataStatusSelect();
        this.dataStatusList = dataStatusSelect.list;
        this.dataStatusMap = dataStatusSelect.map;

        let permissionsTreeData = basicData.getPermissionsTreeMap();
        this.permissionsList = permissionsTreeData.list;
        this.permissionsMap = permissionsTreeData.map;    
    }
});

window.vm = vm;