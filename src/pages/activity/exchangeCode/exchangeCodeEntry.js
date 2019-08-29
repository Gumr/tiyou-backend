import Vue from 'vue';
import AppHeader from 'components/layout/AppHeader.vue';
import AppMenu from 'components/layout/AppMenu.vue';
import AppBreadcrumb from 'components/layout/AppBreadcrumb.vue';
import AppFooter from 'components/layout/AppFooter.vue';
import DataList from './DataList.vue';
import EditModal from './EditModal.vue';
import DetailModal from './DetailModal.vue';
import UpdateStatusModal from './UpdateStatusModal.vue';


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
        DetailModal,
        UpdateStatusModal
    },

    // 数据定义
    data: {
        statusList: [],         //上下架下拉框数据
        merchantSelect:[],      //所有商户
        channelSelect: [],      //渠道号下拉框
        channelSelectMap: [],   //渠道号下拉框map
       

    },

    // 计算区
    computed: {

    },

    // 方法定义
    methods: {
        
    },

    // 组件创建
    created: function() {

        let statusSelect = basicData.getUpDownStatusSelect();
        this.statusList = statusSelect.list;
        this.statusMap = statusSelect.map;


        let merchantSelect = basicData.getMerchantSelect();
        this.merchantSelect = merchantSelect;


        let getChannelSelect = basicData.getChannelSelect().list;
        this.channelSelect = getChannelSelect;
        let channelSelectMap = basicData.getChannelSelect().map;
        this.channelSelectMap = channelSelectMap;


        


       
    },

    // 挂载完成
    mounted: function() {
        
    }
});

window.vm = vm;