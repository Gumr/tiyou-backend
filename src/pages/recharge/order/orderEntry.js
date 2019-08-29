import Vue from 'vue';
import AppHeader from 'components/layout/AppHeader.vue';
import AppMenu from 'components/layout/AppMenu.vue';
import AppBreadcrumb from 'components/layout/AppBreadcrumb.vue';
import AppFooter from 'components/layout/AppFooter.vue';
import DataList from './DataList.vue';
import EditModal from './EditModal.vue';
import DetailModal from './DetailModal.vue';
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
    },

    // 数据定义
    data: {
        rechargeOrderStatusSelect: [], //订单状态
        rechargeOrderStatusSelectMap: [], //订单状态map
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
        let rechargeOrderStatusSelect = basicData.getRechargeOrderStatusSelect();
        this.rechargeOrderStatusSelect = rechargeOrderStatusSelect.list;
        this.rechargeOrderStatusSelectMap = rechargeOrderStatusSelect.map;


        let getChannelSelect = basicData.getChannelSelect();
        this.channelSelect = getChannelSelect.list;
        this.channelSelectMap = getChannelSelect.map;


    },

    // 挂载完成
    mounted: function() {
        
    }
});

window.vm = vm;