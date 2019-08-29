<template>
    <ul class="page-breadcrumb breadcrumb">
        <li v-for="(item,idx) in this.store.breadcrumb">
            <i class="fa fa-chevron-circle-right" v-if="idx>0"></i>
            <a :href="item.url">{{item.title}}</a>
        </li>
    </ul>
</template>