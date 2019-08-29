import Vue from 'vue';
import AppHeader from 'components/layout/AppHeader.vue';
import AppMenu from 'components/layout/AppMenu.vue';
import AppBreadcrumb from 'components/layout/AppBreadcrumb.vue';
import AppFooter from 'components/layout/AppFooter.vue';
import DataList from './DataList.vue';
import EditModal from './EditModal.vue';

import basicData from 'common/js/basicData.js'


var vm = new Vue({
    el: '#app',

    // 组件注册
    components: {
        AppHeader,
        AppMenu,
        AppBreadcrumb,
        AppFooter,
        DataList,
        EditModal,
    },

    // 数据定义
    data: {
        
        teachPlaceTypeSelect: [], //教学点类型下拉框
        merchantSelect:[],      //所有商户

    },

    // 计算区
    computed: {

    },

    // 方法定义
    methods: {
    },

    // 组件创建
    created: function() {
        
        let teachPlaceTypeSelect = basicData.getTeachPlaceTypeSelect();
        this.teachPlaceTypeSelect = teachPlaceTypeSelect.list;

        let merchantSelect = basicData.getMerchantSelect();
        this.merchantSelect = merchantSelect;

    },

    // 挂载完成
    mounted: function() {
        
    }
});

window.vm = vm;