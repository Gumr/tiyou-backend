<template>
    <ul :class="isFirstTree ? 'page-sidebar-menu' : 'sub-menu'" :data-auto-scroll="isFirstTree" :data-slide-speed="{100: isFirstTree}">
        <li class="nav-item j_topMenu" v-if="isFirstTree">
            <a href="/index.html" class="nav-link">
                <i class="icon-home"></i>
                <span class="title">首页</span>
            </a>
        </li>        
        <li class="nav-item" v-for="menu in menuDataList" :class="{'j_topMenu':isFirstTree}" v-show="checkPermissions([menu.pcode])">
            <a class="nav-link" :href="getHref(menu)">
                <i class="icon-folder" v-if="menu.ptype == 1"></i>
                <span class="title">{{menu.pname}}</span>
                <span class="arrow" v-if="menu.ptype == 1"></span>
            </a>
            <app-menu-tree :menuDataList="menu.childList" v-if="hasChlid(menu)"></app-menu-tree>
        </li>
    </ul>    
</template>

<script>
    export default {
        name: "AppMenuTree",
        props: {
            menuDataList: {                     // 当前树层需要循环的数据
                type: Array,
                default: function() {
                    return [];
                }
            },
            isFirstTree:false,                  // 判断是否为第一层树
        },
        methods:{
            hasChlid:function(menu){
                if(menu.childList.length > 0){
                    return true;
                }
                return false;
            },
            getHref:function(menu){
                if(menu.url==null || menu.url==''){
                    return "javascript:void(0);";
                }
                return menu.url;
            }
        },
    }
</script>
