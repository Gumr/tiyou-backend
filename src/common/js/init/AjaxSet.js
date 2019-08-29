// 全局 ajax 处理：加遮罩以及错误提示
// 自定义了两个配置：
// blockUI---等于false时不显示遮罩
// showServermsg---等于false时不显示服务器返回的message
import base from 'common/js/utils/base.js';

var ajaxNum = 0;
export default {
    init: function () {
        $(document).ajaxSend(function (event, jqXHR, options) {
            //  通过自定义属性blockUI控制是否显示遮罩，只有值为false才不显示
            if (options.blockUI !== false) {
                if (ajaxNum === 0) {
                    $.blockUI({
                        message: '<div class="loading-message loading-message-boxed"><img src="/assets/global/img/loading-spinner-grey.gif" align=""><span>&nbsp;&nbsp;数据加载中..</span></div>',
                        css: {
                            border: "0px",
                            cursor: "wait",
                            background: ""
                        }
                    });
                }
                ajaxNum += 1;
            }

        }).ajaxComplete(function (event, jqXHR, options) {
            if (options.blockUI !== false) {
                ajaxNum -= 1;
                if (ajaxNum === 0) {
                    setTimeout(function () {
                        $.unblockUI();
                    }, 300);
                }
            }
        }).ajaxError(function (event, jqXHR, options, thrownError) {
            switch (jqXHR.status) {
                case (500):
                    bootbox.alert("服务器系统内部错误");
                    break;
                case (401):
                    bootbox.alert("未登录");
                    break;
                case (403):
                    bootbox.alert("无权限执行此操作");
                    break;
                case (404):
                    bootbox.alert("找不到对应的资源");
                    break;
                case (408):
                    bootbox.alert("请求超时");
                    break;
                default:
                    bootbox.alert("操作失败,请检查网络、数据格式等");
            }
            $.unblockUI();
        }).ajaxSuccess(function (event, jqXHR, options) {
            jqXHR.done(function (result) {
                //  通过自定义属性showServermsg控制是否显示遮罩，只有值为false才不显示
                if (result && result.code == '0030') {
                    bootbox.alert({
                        // title: "提示",
                        // buttons: {
                        //     ok: {
                        //         label: 'OK',
                        //         className: 'btn-myStyle'
                        //     }
                        // },
                        message: result.msg || '',
                        callback: function () {
                            let curHref = window.location.href;
                            base.url.toUrl(`/login.html?redirectURL=${curHref}`);
                        }
                    });
                } else if (result && result.code != '0000') {
                    if (options.showServermsg != false) {
                        result.msg && bootbox.alert(result.msg);
                    }
                }
            })
        }).ajaxComplete(function () {
            ajaxNum--;
            $.unblockUI();
        });;
        $.ajaxSetup({
            global: true,
            cache: false,
            timeout: 10 * 60 * 1000 // 10min
        });
    }
}