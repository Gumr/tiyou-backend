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
        userStatus: [],//用户状态
        reserveStatus: [],     // 预约状态
        reserveStatusMap:[],// 预约状态map
        channelSelect: [],      //渠道号下拉框
        channelSelectMap: [],   //渠道号下拉框map
        rechargeOrderStatusSelect: [], //订单状态
        rechargeOrderStatusSelectMap: [], //订单状态map

    },

    // 计算区
    computed: {

    },

    // 方法定义
    methods: {
    },

    // 组件创建
    created: function() {
        let statusSelect = basicData.getDataStatusSelect();
        this.userStatus = statusSelect.list;

        let reserveStatus = basicData.getReserveStatusSelect();
        this.reserveStatus = reserveStatus.list;
        this.reserveStatusMap = reserveStatus.map;

        let getChannelSelect = basicData.getChannelSelect();
        this.channelSelect = getChannelSelect.list;
        this.channelSelectMap = getChannelSelect.map;

        this.rechargeOrderStatusSelect = basicData.getRechargeOrderStatusSelect().list;
        this.rechargeOrderStatusSelectMap = basicData.getRechargeOrderStatusSelect().map;


    },

    // 挂载完成
    mounted: function() {
        
    }
});

window.vm = vm;