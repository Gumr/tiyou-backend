import Vue from 'vue';
import AppHeader from 'components/layout/AppHeader.vue';
import AppMenu from 'components/layout/AppMenu.vue';
import AppFooter from 'components/layout/AppFooter.vue';
import Profile from './Profile.vue';
import EditModal from './EditModal.vue';
import PassModal from './PassModal.vue';

import basicData from 'common/js/basicData.js';

var vm = new Vue({
    el: '#app',
    components: {
        AppHeader,
        AppMenu,
        AppFooter,
        Profile,
        EditModal,
        PassModal
    },
    // 数据
    data: {
        statusMap: [],
    },
    // 创建
    created: function() {
        this.statusMap = basicData.getGlobalDataStatus().map;
    }
});

window.vm = vm;