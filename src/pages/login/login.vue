<template>
    <div class="loginbg bg">
        <div class="logo">
            <a href="">
                <img src="./img/logo.png" alt="" /> 
            </a>
        </div>
        <div class="content">
            <form class="login-form" action="" method="post" id="j_loginForm">
                <h3 class="form-title font-green">账户登录</h3>
                <div class="alert alert-danger" :class="[!errmsg && 'display-hide']">
                    <button type="button" class="close" @click="clearMsg($event)"></button>
                    <span>{{errmsg}}</span>
                </div>
                <div class="form-group">
                    <label class="control-label visible-ie8 visible-ie9">账号：</label>
                    <input v-model="formObj.account" class="form-control form-control-solid placeholder-no-fix" type="text" autocomplete="off" name="account" placeholder="请输入账号"/>
                </div>
                <div class="form-group">
                    <label class="control-label visible-ie8 visible-ie9">密码：</label>
                    <input v-model="formObj.password" class="form-control form-control-solid placeholder-no-fix" type="password" autocomplete="off" name="password" placeholder="请输入密码"/>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn green uppercase" @click="onLogin($event)">登录</button>
                    <!-- <a href="javacript:;" class="forget-password">忘记密码?</a> -->
                </div>
            </form>
        </div>
        <div class="copyright"> 2018年10月 &copy; Metronic Theme By Zhousir</div>

    </div>
</template>

<script>
    import base from 'common/js/utils/base.js';

    export default{
        data: function() {
            return {
                _loginForm: null,         // Form表单元素
                errmsg: '',               // 错误提示
                formObj: {}               // 参数对象 
            }
        },

        methods: {
            onLogin: function(event) {
                var self = this;
                event.preventDefault();
                if (self._loginForm.valid()) {
                    $.ajax({
                        url: '/api/rbac/login',
                        type: "POST",
                        async: false,                       // true异步,false同步,默认true
                        data: self.formObj,
                        showServermsg: false
                    }).done(function(resp) {
                        if (resp.code == '0000') {
                            base.cookie(self.store.tokenName, resp.data.token,{
                                expires:90
                            });
                            base.url.toUrl('/index.html');
                        } else {
                            self.errmsg = resp.msg;
                        }
                    });
                }
            },
            // 清除消息
            clearMsg: function(event) {
                event.preventDefault();
                this.errmsg = '';
            }
        },
        
        created: function () {
            this.formObj = {
                account: '',      // 账号
                password: ''      // 密码
            }
        },
        
        // 挂载完成
        mounted: function() {
            //初始化表单元素和验证规则
            this._loginForm = $('#j_loginForm');
            this._loginForm.validate({
                rules:{
                    account:{
                        required:true,
                    },
                    password:{
                        required:true,
                    }
                }
            });
        },
    }
</script>
