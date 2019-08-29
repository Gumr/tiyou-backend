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
        merchantSelect:[],      //所有商户
        teachPlaceSelect: [],   // 获取上课点
        provinceSelect: [],     //获取省下拉框
        teachPlaceTypeSelect: [], //教学点类型下拉框

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
    },

    // 组件创建
    created: function() {
        let getProvinceSelect = basicData.getProvinceSelect();
        this.provinceSelect = getProvinceSelect;

        let merchantSelect = basicData.getMerchantSelect();
        this.merchantSelect = merchantSelect;

        let teachPlaceSelect = basicData.getTeachPlaceSelect();
        this.teachPlaceSelect = teachPlaceSelect;

        let teachPlaceTypeSelect = basicData.getTeachPlaceTypeSelect();
        this.teachPlaceTypeSelect = teachPlaceTypeSelect.list;

        
        

     

       
    },

    // 挂载完成
    mounted: function() {
        
    }
});

window.vm = vm;