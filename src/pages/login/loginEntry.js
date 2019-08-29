import Vue from 'vue';
import Login from './login.vue';
require('./login.scss');

var vm = new Vue({
    el: '#app',
    components: {
        Login
    },
});

window.vm = vm;