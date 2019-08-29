<template>
    <div class="row">
        <div class="col-md-12">
            <div class="portlet light">
                <div class="portlet-title">
                    <div class="caption">
                        <i class="fa fa-user font-green-sharp"></i>
                        <span class="caption-subject font-green-sharp bold uppercase">账户基本信息：</span>
                    </div>
                </div>

                <div class="portlet-body">
                    <div class="row">
                        <div class="col-md-2">
                            <p class="pull-right ptb10">登录账号：</p>
                        </div>
                        <div class="col-md-8"><p class="ptb10">{{user.account}}</p></div>
                    </div>
                    <div class="row">
                        <div class="col-md-2">
                            <p class="pull-right ptb10">员工姓名：</p>
                        </div>
                        <div class="col-md-8"><p class="ptb10">{{user.ename || '无'}}</p></div>
                    </div>
                    <div class="row">
                        <div class="col-md-2">
                            <p class="pull-right ptb10">手机号码：</p>
                        </div>
                        <div class="col-md-8"><p class="ptb10">{{user.phone || '无'}}</p></div>
                    </div>
                    <div class="row">
                        <div class="col-md-2">
                            <p class="pull-right ptb10">电子邮箱：</p>
                        </div>
                        <div class="col-md-8"><p class="ptb10">{{user.email || '无'}}</p></div>
                    </div>
                    <div class="row">
                        <div class="col-md-2">
                            <p class="pull-right ptb10">创建时间：</p>
                        </div>
                        <div class="col-md-8"><p class="ptb10">{{ user.createTime}}</p></div>
                    </div>
                    <div class="row">
                        <div class="col-md-2">
                            <p class="pull-right ptb10">更新时间：</p>
                        </div>
                        <div class="col-md-8"><p class="ptb10">{{ user.updateTime}}</p></div>
                    </div>
                    <div class="row">
                        <div class="col-md-2">
                            <p class="pull-right ptb10">最近登录：</p>
                        </div>
                        <div class="col-md-8"><p class="ptb10">{{ user.lastLoginTime}}</p></div>
                    </div>
                    <div class="row">
                        <div class="col-md-offset-2 col-md-8">
                            <span class="btn blue btn-sm" @click="showEditForm">修改信息</span>
                            <span class="btn red btn-sm ml5" @click="showPassWordForm">修改密码</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>        
</template>

<script>
    export default {
        computed: {
            user: function() {
                return this.store.loginUser;
            }
        },
        methods: {
            showEditForm(event) {
                event.preventDefault();
                this.$root.$emit('profile.openEditModal', this.user);
            },
            showPassWordForm(event) {
                event.preventDefault();
                this.$root.$emit('profile.openPassModal');
            }
        }
    }
</script>