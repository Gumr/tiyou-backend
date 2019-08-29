/**
 * 所有需要初始化的操作都在这个JS文件中处理
 */
import ajaxSet from 'common/js/init/AjaxSet.js';
import validateSet from 'common/js/init/ValidateSet.js';
import vueSet from 'common/js/init/VueSet.js';

import basicData from 'common/js/basicData.js';
import base from 'common/js/utils/base.js';





// bootbox设置
bootbox.setDefaults({
    size: 'small',
    title: '提示',
    locale: 'app_custom',
    dropback: false,
    animate: false,
});


// init
function init() {
    // 初始化全局ajax相关设置
    ajaxSet.init();

    // 初始化jquery相关设置
    validateSet.init();

    // 初始化Vue相关的设置
    vueSet.init();

    // 如果页面有鉴权的div标识,则执行获取用户信息
    if ($("div[name=authorization]").length > 0) {

        // 获取当前登录用户信息
        let user = basicData.fetchLoginUser();
        
        // 未登陆则跳转到LOGIN
        if ($.isEmptyObject(user)) {
            let curHref = window.location.href;
            base.url.toUrl(`/login.html?redirectURL=${curHref}`);
            return;
        }

        // 保存登录用户信息到全局仓库中
        vueSet.store.loginUser = user;
        
        // 保存登录用户权限到全局仓库中
        vueSet.store.loginUserPcode = basicData.fetchLoginUserPcode();
    }
}


//执行初始化
init();
