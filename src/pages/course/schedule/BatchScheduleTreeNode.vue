<template>
    <ul class="jstree-children jstree-wholerow-ul jstree-no-dots">
        <li class="jstree-node" :class="node.open ? 'jstree-open' : 'jstree-closed'" v-for="node in treeDataList">
            <i class="jstree-icon jstree-ocl" @click="openAndClose(node)"></i>
            <a class="jstree-anchor" href="#" :class="{'jstree-clicked':isSelected(node.id)}" @click="onSelectNode($event, node)">
                <i class="jstree-icon jstree-checkbox"></i> <!-- 选择图标 -->
                <i class="jstree-icon jstree-themeicon fa fa-folder icon-state-warning icon-lg jstree-themeicon-custom" v-if="node.type==3"></i> <!-- 教学点图标 -->
                <i class="jstree-icon jstree-themeicon fa fa-folder icon-state-success jstree-themeicon-custom" v-if="node.type==4"></i>
                <i class="jstree-icon jstree-themeicon fa fa-file icon-state-danger jstree-themeicon-custom" v-if="node.type==5"></i>
                {{node.name}}
            </a>
            <batch-schedule-tree-node :treeDataList="node.children" :treeDataMap="treeDataMap" :selectList="selectList" @emitNodeSelected="onEmitNodeSelected"></batch-schedule-tree-node>
        </li>
    </ul>
</template>


<script>

export default {
    name: "BatchScheduleTreeNode",

    props: {
        treeDataList: {
            type: Array,
            default: function () {
                return [];
            }
        },
        treeDataMap: {
            type: Object,
            default: function () {
                return {};
            }
        },
        selectList: {
            type: Array,
            default: function () {
                return [];
            }
        },
    },

    methods: {
        //判断节点是否被选中
        isSelected: function (id) {
            if (this.selectList.indexOf(id) > -1) {
                return true;
            }
            return false;
        },

        //展开和关闭节点
        openAndClose: function (obj) {
            if (obj.open) {
                obj.open = false;
            } else {
                obj.open = true;
            }
            this.$forceUpdate();
        },

        //点击选中和取消节点
        onSelectNode: function (event, node) {
            event.preventDefault();
            let isSelect = this.isSelected(node.id) ? false : true;         //true=选中操作  flase=取消操作

            this.onEmitNodeSelected(node, isSelect);       //发通知选中自己
            this.doSelectChild(node, isSelect);            //处理儿子节点
            this.doSelectParent(node, isSelect);           //处理父级节点
        },

        //递归处理儿子节点
        doSelectChild: function (node, isSelect) {
            node.children.forEach((item) => {
                this.onEmitNodeSelected(item, isSelect);
                this.doSelectChild(item, isSelect);
            });
        },

        //递归处理父级节点
        doSelectParent: function (node, isSelect) {
            // //只处理选中操作,取消操作不处理父节点
            // if(isSelect){
            //     if(node.pid){
            //         console.log(this.treeDataMap);
            //         console.log(node.pid);
            //         console.log(this.treeDataMap[node.pid]);

            //         var parentNode = this.treeDataMap[node.pid];
            //         //递归父级的父级.....    
            //         this.onEmitNodeSelected(parentNode, isSelect);
            //         this.doSelectParent(parentNode, isSelect);
            //     }
            // }
        },

        //传递节点被选中或取消的消息事件
        onEmitNodeSelected: function (treeNode, isSelect) {
            this.$emit("emitNodeSelected", treeNode, isSelect);
        },
    },
}
</script>
