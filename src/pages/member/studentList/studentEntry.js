import Vue from 'vue';
import AppHeader from 'components/layout/AppHeader.vue';
import AppMenu from 'components/layout/AppMenu.vue';
import AppBreadcrumb from 'components/layout/AppBreadcrumb.vue';
import AppFooter from 'components/layout/AppFooter.vue';
import DataList from './DataList.vue';


var vm = new Vue({
    el: '#app',

    // 组件注册
    components: {
        AppHeader,
        AppMenu,
        AppBreadcrumb,
        AppFooter,
        DataList,
    },

    // 数据定义
    data: {

    },

    // 计算区
    computed: {

    },

    // 方法定义
    methods: {
    },

    // 组件创建
    created: function() {
       
    },

    // 挂载完成
    mounted: function() {
        
    }
});

window.vm = vm;