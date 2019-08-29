<template>
    <div class="page-header navbar navbar-fixed-top">
        <div class="page-header-inner ">
            <div class="page-logo">
                <a href="/index.html">
                    <img src="./images/logo.png" alt="logo" class="logo-default" /> 
                </a>
                <div class="menu-toggler sidebar-toggler">
                </div>
            </div>
            <div class="page-top">
                <div class="top-menu">
                    <ul class="nav navbar-nav pull-right">
                        <li class="dropdown dropdown-user dropdown-dark">
                            <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                                <span class="username username-hide-on-mobile"> {{user.ename}} </span>
                                <img alt="" class="img-circle" src="./images/avatar.gif" />
                                <i class="fa fa-angle-down"></i>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-default">
                                <li>
                                    <a href="/sys/profile.html">
                                        <i class="icon-user"></i> 个人中心
                                    </a>
                                </li>
                                <li class="divider"> </li>
                                <li>
                                    <a href="javascript:;" @click="logout">
                                        <i class="icon-logout"></i> 退出系统
                                    </a>
                                </li>
                            </ul>  
                        </li>
                        <li class="dropdown dropdown-extended quick-sidebar-toggler">
                            <i class="icon-logout" @click="logout"></i>    
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import base from 'common/js/utils/base.js';
    import basicData from 'common/js/basicData.js';

    export default {
        computed: {
          user: function() {
              return this.store.loginUser;
          }
        },
        methods: {
            logout: function() {
                base.cookie(this.store.tokenName, null,{
                    expires:0
                });
                window.location.href = "/login.html";
            }
        }
    };
</script>