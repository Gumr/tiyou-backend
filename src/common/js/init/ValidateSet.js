import idCardValidate from 'common/js/utils/idCard.js';

// 提示本地化
function localize() {
    $.extend($.validator.messages, {
        required: "必填选项",
        email: "请输入合法的邮箱地址",
        url: "请输入合法的网址(前缀http/https)",
        date: "请输入合法的日期",
        dateISO: "请输入合法的日期(ISO)",
        number: "请输入合法的数字",
        digits: "只能输入整数",
        creditcard: "请输入合法的信用卡号",
        equalTo: "请再次输入相同的值",
        accept: "请输入拥有合法后缀名的字符串",
        maxlength: $.validator.format("请输入一个长度最多是 {0} "),
        minlength: $.validator.format("请输入一个长度最少是 {0} "),
        rangelength: $.validator.format("请输入一个长度介于 {0} 和 {1} 之间"),
        range: $.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
        max: $.validator.format("请输入一个最大为 {0} 的值"),
        min: $.validator.format("请输入一个最小为 {0} 的值")
    });
}

// 自定义验证规则
function addMethods() {
    // 不等于
    $.validator.addMethod("notEqualTo",function(value, element, param) {
            return this.optional(element) || value!=$(param).val();
        },"请输入不同的密码"
    );

    // 等于
    $.validator.addMethod("equalTo",function(value, element, param) {
            return this.optional(element) || value==$(param).val();
        },"请输入相同的密码"
    );

    // 密码
    $.validator.addMethod("password", function(value, element) {
        return ((/^[a-zA-Z0-9_\+\?\!\@\#\$\%\&\*]{5,20}$/.test(value)));
    }, "请输入长度5~20位密码,建议由字母、数字及特殊符号两种以上组成");

    // 只做纯数字和纯字母判断
    $.validator.addMethod("passwordStrength", function(value, element) {
        return (!(/^\d+$/.test(value)) && !(/^[a-zA-Z]+$/.test(value)));
    }, "密码过于简单,请输入数字与字母的组合");

    // 手机验证
    $.validator.addMethod("mobile", function(value, element) {
        var length = value.length;
        var mobile =  /^(((13[0-9]{1})|(15[0-9]{1})|(17[6-8]{1})|(14[5-7]{1})|(18[0-9]{1}))+\d{8})$/;
        return (value == '' || (length == 11 && mobile.test(value)));
    }, "手机号码格式错误");

    // 身份证
    $.validator.addMethod("isIdCard", function(value, element) {
        return $.trim(value) == '' || idCardValidate(value)
    }, "请输入正确的身份证号码");

    // 邮箱验证
    $.validator.addMethod("email", function(value, element) {
        var length = value.length;
        var email =  /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        return (value == '' || (email.test(value)));
    }, "请输入合法的邮箱");

    $.validator.addMethod("requireImg", function(value, element) {
        return !!$(element).siblings('.j_imgData').attr('imgurl');
    }, "请上传图片");

    $.validator.addMethod("isInteger", function(value, element) {
        return ((/^[\-1-9]\d*$/.test(value)));
    }, "请输入整数");

    $.validator.addMethod("noUrlCharacter", function(value, element) {
        return this.optional(element) || !/[:/@?#]/.test(value);
    }, "请不要使用 /@?# 特殊字符");
}

// 设置默认值
function setDefaults() {
    $.validator.setDefaults({
        debug: false,
        ignore: "",
        errorClass: "has-error",
        errorElement:"span",
        focusInvalid: false,
        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.closest('.form-group').find('.has-error').remove();
            label.remove();
        },
        highlight: function(element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        errorPlacement: function (error, element) {
            let $parent = $(element).parent(),
            // 为了处理日期选择datepicker
            $appendToEl = $parent.hasClass('input-group') ? $parent.parent() : $parent;
            
            error.addClass('help-block help-block-error').appendTo($appendToEl);
            return false;
        }
    });
}

export default {
    init: function() {
        // 验证器配置
        if(undefined != $.validator) {
            localize();
            addMethods();
            setDefaults();
        } else {
            bootbox.alert('请先加载jquery validate');
        }
    }
}
