import Vue from 'vue';
import base from 'common/js/utils/base.js';


// 调用Base里面的格式化日期方法：yyyy-MM-dd
function myDate (value) {
    return base.formatDate(value);
}

// 调用Base里面的格式化日期时间方法：yyyy-MM-dd HH:mm:ss
function myDateTime(value) {
    return base.formatDateTime(value);
}

// VUE组件共享数据
let store = {
    tokenName: "TY-SYS-SID",             // 登录token的参数名
    pageTitle: "",                      // 页面title
    breadcrumb: "",                     // 菜单面包屑
    loginUser: {},                      // 登录用户信息
    loginUserPcode: [],                 // 登录用户权限PCODE数组
};


export default  {
    store,
    init: function() {
        // 日期格式过滤
        Vue.filter('myDate', myDate);
        Vue.filter('myDateTime', myDateTime);

        // 全局混入注册，让后面的VUE组件都可以使用mixin里面的数据和方法。
        Vue.mixin({
            data: function() {
                return {
                    store: store,
                }
            },

            methods: {
                // 检查是否有权限, arr：待校验的权限code数组, type：and=所有都通过才为真,or=一个通过就为真
                checkPermissions: function(arr, type='or') {
                    let rtn = false;
                    if (this.store.loginUser.isAdmin) {
                        rtn = true;
                    } else if (type === 'or') {
                        $.each(arr, (i, v) => {
                            if (this.store.loginUserPcode[v] === true) {
                                rtn = true;
                                return false;
                            } else {
                                rtn = false;
                            }
                        });
                    } else if (type === 'and') {
                        $.each(arr, (i, v) => {
                            if (this.store.loginUserPcode[v] !== true) {
                                rtn = false;
                                return false;
                            } else {
                                rtn = true;
                            }
                        });
                    }
                    return rtn;
                }
            }
        });
    }
}
