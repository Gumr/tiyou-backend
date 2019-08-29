import Vue from 'vue';
import AppHeader from 'components/layout/AppHeader.vue';
import AppMenu from 'components/layout/AppMenu.vue';
import AppBreadcrumb from 'components/layout/AppBreadcrumb.vue';
import AppFooter from 'components/layout/AppFooter.vue';
import DataList from './DataList.vue';
import BatchScheduleModal from './BatchScheduleModal.vue';
import SingleScheduleModal from './SingleScheduleModal.vue';


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
        BatchScheduleModal,
        SingleScheduleModal,
    },

    // 数据定义
    data: {
        provinceSelect: [],         // 省下拉框
        citySelect: [],             // 市下拉框
        districtSelect: [],         // 区县下拉框
        teachPlaceSelect: [],       // 教学点下拉框
        teacherSelect: [],          // 教师下拉框
        themeSelect: [],            // 主题下拉框
        courseTypeSelect: [],       // 类型下拉框
        courseSelect: [],           // 课程下拉框
        upDownStatusSelect: [],     // 上下架状态下拉框 
        upDownStatusMap: {},        // 上下架状态MAP 
        scheduleStatusSelect: [],   // 排课状态下拉框 
        scheduleStatusMap: {},      // 排课状态MAP 
    },

   

    // 计算区
    computed: {

    },

    // 方法定义
    methods: {
        getCitySelect:function(provinceCode){
            this.citySelect = basicData.getCitySelect(provinceCode);
        },
        getDistrictSelect:function(cityCode){
            this.districtSelect = basicData.getDistrictSelect(cityCode);
        },
        getTeachPlaceSelect:function(provinceCode,cityCode,districtCode){
            this.teachPlaceSelect = basicData.getTeachPlaceSelect(provinceCode,cityCode,districtCode);
        },
        getCourseSelect:function(themeId, courseType){
            this.courseSelect = basicData.getCourseSelect(themeId,courseType);
        }
    },

    // 组件创建
    created: function () {
        this.teacherSelect = basicData.getTeacherSelect();

        let statusSelectData = basicData.getUpDownStatusSelect();
        this.upDownStatusSelect = statusSelectData.list;
        this.upDownStatusMap = statusSelectData.map;

        this.themeSelect = basicData.getThemeSelect();
        this.courseTypeSelect = basicData.getCourseTypeSelect().list;
        this.courseSelect = basicData.getCourseSelect();

        let teachPlaceSelectData = basicData.getTeachPlaceSelect();
        this.teachPlaceSelect = teachPlaceSelectData;

        this.provinceSelect = basicData.getProvinceSelect();

        let scheduleStatusSelectData = basicData.getScheduleStatusSelect();
        this.scheduleStatusSelect = scheduleStatusSelectData.list;
        this.scheduleStatusMap = scheduleStatusSelectData.map;
    },

    // 挂载完成
    mounted: function () {

    }
});

window.vm = vm;