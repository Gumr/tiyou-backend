<template>
    <div class="page-sidebar-wrapper" id="j_topMenu">
        <div class="page-sidebar navbar-collapse collapse">
            <app-menu-tree :menuDataList="menuDataList" :isFirstTree="true"></app-menu-tree>    
        </div>
    </div>
</template>

<script>
    import AppMenuTree from "./AppMenuTree.vue";
    import basicData from 'common/js/basicData.js';

    export default {
        components: {
            AppMenuTree,
        },
        data:function(){
            return {
                menuDataList: basicData.getMenuTree(),
            }
        },
        methods: {
            // 获取面包屑数据
            getBreadcrumb() {
                // 当前页面相对路径
                const pathname = window.location.pathname == '/' ? '/index.html' : window.location.pathname;
                let $curMenu = $('#j_topMenu').find('a[href="' + pathname + '"]');
                var tmpPath = [],
                    $subMenu,
                    urlPath = window.location.pathname;

                if (urlPath == '/' || urlPath == '/index.html') {
                    // 首页

                } else {
                    if($curMenu.length>0){
                        tmpPath.push($curMenu);
                        // 根据子菜单的样式, 获取子菜单对象
                        $subMenu = $curMenu.closest('.sub-menu');
                        if ($subMenu.length > 0 ) {
                            tmpPath.push($subMenu.siblings('a'));
                        }
                    }
                }

                return $.map(tmpPath,function (v) {
                    return {
                        title: $.trim(v.text()),
                        url: v.attr('href')
                    }
                }).reverse();
            },

            // 激活当前页面对应菜单项
            activeCurrentMenu() {
                $curMenu.parent().addClass('active');
                $curMenu.closest('.j_topMenu').addClass('active');
            },

            // 获得页面标题
            getPageTitle() {
                var pageTitle = $curMenu.length > 0 ? $curMenu.text() : '';
                return pageTitle;
            },
        },
        // 挂载完成
        mounted: function() {           
            // 面包屑数据
            this.store.breadcrumb = basicData.getBreadcrumb();

            // 高亮当前菜单
            basicData.activeCurrentMenu();

            // 设置pageTitle内容
            this.store.pageTitle = basicData.getPageTitle();
            
            // 设置title标签
            document.title = this.store.pageTitle ? this.store.pageTitle + ' | 后台管理系统' : '后台管理系统';
        }
    }
</script>
