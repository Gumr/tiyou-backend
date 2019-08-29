import Vue from 'vue';
import AppHeader from 'components/layout/AppHeader.vue';
import AppMenu from 'components/layout/AppMenu.vue';
import AppFooter from 'components/layout/AppFooter.vue';
require('./index.scss');

var vm = new Vue({
    el: '#app',
    components: {
        AppHeader,
        AppMenu,
        AppFooter
    },
});

window.vm = vm;