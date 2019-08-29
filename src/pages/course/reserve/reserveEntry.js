import Vue from 'vue';
import AppHeader from 'components/layout/AppHeader.vue';
import AppMenu from 'components/layout/AppMenu.vue';
import AppBreadcrumb from 'components/layout/AppBreadcrumb.vue';
import AppFooter from 'components/layout/AppFooter.vue';
import DataList from './DataList.vue';
import EditModal from './EditModal.vue';
import EditStatusModal from './EditStatusModal.vue';


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
        EditStatusModal,
    },

    // 数据定义
    data: {
        scheduleStatus: [],     // 获取排课状态 
        merchantSelect:[],      //所有商户
        themeList: [],          // 所有主题
        courseTypeList: [],     // 获取课程类型下拉框数据---目前是写死的科学课和精品课
        courseTypeMap: {},      //状态MAP
        teachPlaceSelect: [],   // 获取上课点
        teachSelect: [],        // 获取所有老师
        courseSelect: [],       //获取所有课程
        provinceSelect: [],     //获取省
        reserveStatusMap: {},
    },

    // 计算区
    computed: {

    },

    // 方法定义
    methods: {
    },

    // 组件创建
    created: function() {
        let statusSelect = basicData.getReserveStatusSelect();
        this.scheduleStatus = statusSelect.list;

        let merchantSelectData = basicData.getMerchantSelect();
        this.merchantSelect = merchantSelectData;

        let getThemeSelect = basicData.getThemeSelect();
        this.themeList = getThemeSelect;

        let courseTypeSelect = basicData.getCourseTypeSelect();
        this.courseTypeList = courseTypeSelect.list;
        this.courseTypeMap = courseTypeSelect.map;

        let teachPlaceSelect = basicData.getTeachPlaceSelect();
        this.teachPlaceSelect = teachPlaceSelect;

        let teachSelect = basicData.getTeacherSelect();
        this.teachSelect = teachSelect;
        
        let courseSelect = basicData.getCourseSelect();
        this.courseSelect = courseSelect;

        let provinceSelect = basicData.getProvinceSelect();
        this.provinceSelect = provinceSelect;

        let reserveStatusSelect = basicData.getReserveStatusSelect();
        this.reserveStatusMap = reserveStatusSelect.map;

        
    },

    

    // 挂载完成
    mounted: function() {
        
    }
});

window.vm = vm;