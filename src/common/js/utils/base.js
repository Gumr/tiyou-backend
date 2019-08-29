let root = window,
    Cookie = require('./cookie.js');

let Base = {
    // URL工具类
    url: {
        location: root.location,
        cache: null,
        param: function (key) {
            var href = this.location.href,
                hrefWithoutHas = href.indexOf('#') > 0 ? href.substr(0, href.indexOf('#')) : href,
                paramStr = hrefWithoutHas.split('?')[1],
                cache,
                keys;

            if (paramStr) {
                if ((cache = this.cache) === null) {
                    keys = paramStr.split('&');
                    cache = this.cache = {};
                    $.each(keys, function (i, v) {
                        var _flag = v.split('=');
                        cache[_flag[0]] = _flag[1];
                    });
                }

                if (key) {
                    return cache[key];
                } else {
                    return cache;
                }
            }
        },
        hash: function () {
            return this.location.href.replace(/^#/, '');
        },
        toUrl:function (url) {
            let redirectURL = Base.url.param('redirectURL');
            window.location.href = redirectURL ? decodeURIComponent(redirectURL) : url;
        }
    },
    // 浏览器
    browser: function () {
        var ua = navigator.userAgent,
            type,
            version,
            matches;

        if ((matches = us.match(/MicroMessenger\/(\d\.\d)/)) && matches.length) {
            type = 'weixin';
            version = matches[1];
        }

        return {
            isPC: function () {
                var sUserAgent = navigator.userAgent.toLowerCase();
                var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
                var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
                var bIsMidp = sUserAgent.match(/midp/i) == "midp";
                var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
                var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
                var bIsAndroid = sUserAgent.match(/android/i) == "android";
                var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
                var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

                if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
                    return true;
                }

                return false;
            }(),
            type: type,
            version: version
        }
    },
    // 手机端浏览器
    mobileBrowser: function () {
        var sys = '', ver = '', v = [];
        var ua = window.navigator.userAgent;
        if (/iP(hone|od|ad)/.test(ua)) {
            sys = 'ios';
            v = ua.match(/OS (\d+)_(\d+)_?(\d+)?/);
            ver = parseInt(v[1], 10);
        } else if (/Android/.test(ua)) {
            sys = 'android';
            v = ua.match(/Android (\d+).(\d+).?(\d+)?/);
            ver = parseInt(v[1], 10);
        }
        return { sys: sys, ver: ver };
    },
    //
    throttle: function (fn,dealy) {
        var timer = null;
        return function () {
            var context = this,
                args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context,args);
            },dealy);
        }
    },
    // 格式化为JSON格式
    paramJson: function (data) {
        // 格式化后台需要的数据格式
        var returnData = {};
        if(!data) return false;
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                returnData[i] = (typeof data[i] == "object") ? JSON.stringify(data[i]) : data[i]
            }
        }
        return returnData;
    },
    // 四舍五入
    toFixed:function(num,s){
        var times = Math.pow(10, s),
            des = num * times + 0.5;

        des = parseInt(des, 10) / times;
        return des + ''
    },
    // Cookie
    cookie: function (key, value, options) {
        var args = Array.prototype.slice.call(arguments);
        if(args.length >= 2){
            args[2] = $.extend({}, {
                domain: root.location.hostname,
                path: '/',
                expires: 90 // 默认90天过期
            }, options);
        }
        return Cookie.apply(null,args);
    },
    // 合并对象中的数据
    assignObj: function (vm, firstSource) {
        for (var i = 1; i < arguments.length; i++) {
            var nextSource = arguments[i];
            if (nextSource && typeof nextSource !== "object")
                continue;
            for (var x in vm) {
                if (vm.hasOwnProperty(x) && nextSource.hasOwnProperty(x)) {
                    vm[x] = nextSource[x]
                }
            }
        }
        return vm
    },
    // 格式化日期, 默认格式 -> yyyy-MM-dd
    formatDate: function (value, dateStr) {
        if(this.isEmptyObject(value)){
            return '';
        }
        var d = new Date(value);
        var year = d.getFullYear(),
            month = d.getMonth() + 1,
            date = d.getDate();
        month = month < 10 ? '0' + month : month;
        date = date < 10 ? '0' + date : date;
        if (dateStr == undefined)
            return [year, month, date].join('-');
        else
            return [year, month, date].join(dateStr);
    },
    // 格式化日期时间, 默认格式 -> yyyy-MM-dd HH:mm:ss
    formatDateTime: function (value, dateStr) {
        if(this.isEmptyObject(value)){
            return '';
        }
        var d = new Date(value);
        var year = d.getFullYear(),
            month = d.getMonth() + 1,
            date = d.getDate(),
            hour = d.getHours(),
            minute = d.getMinutes(),
            second = d.getSeconds();
        month = month < 10 ? '0' + month : month;
        date = date < 10 ? '0' + date : date;
        hour = hour < 10 ? '0' + hour : hour;
        minute = minute < 10 ? '0' + minute : minute;
        second = second < 10 ? '0' + second : second;
        if (dateStr == undefined)
            return [year, month, date].join('-') + ' ' + [hour, minute, second].join(':');
        else
            return [year, month, date].join(dateStr) + ' ' + [hour, minute, second].join(':');
    },
    //百度富文本编辑器全屏
    ueFullScreenHandler(event, isFullScreen) {
        let $backDrop = $('.modal-backdrop'),
            $overflowEls = $('.modal-open, .modal-open .modal'),
            $navbar = $('.navbar-fixed-top'),
            $pagination = $('.pagination');
        if (isFullScreen) {
            $navbar.hide();
            $pagination.hide();
            $backDrop.hide();
            $overflowEls.addClass('visible-important');
        } else {
            $navbar.show();
            $pagination.show();
            $backDrop.show();
            $overflowEls.removeClass('visible-important');
        }
    },
    // 判断是否为空对象
    isEmptyObject: function(obj) {
        for(var key in obj){
            return false
        };
        return true
    },
};

export default Base;
