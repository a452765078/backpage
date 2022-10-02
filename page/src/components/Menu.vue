<template>
<div class="menu">
    <div class="wrapper">
        <div class="personImg">Person Img</div>
        <el-menu  
        class="el-menu-vertical-demo" 
        router

        >
        <tree-menu-vue :menuList="menuList"></tree-menu-vue>
</el-menu>
    </div>

</div>
</template>
<script>
import {
Document,
Menu as IconMenu,
Location,
Setting,
} from '@element-plus/icons-vue'
import TreeMenuVue from './TreeMenu.vue';
export default {
    name: 'Menu',
    components: {
        // Document,
        // IconMenu,
        // Location,
        // Setting,
        TreeMenuVue
    },
    props: {
        menuList: {
            type:Array,
            default:[]
        }
    }
}
</script>
<style lang="scss">
.menu {
    .wrapper {
        width: 200px;
        height: 100vh;
        overflow: auto;
        border-right: 1px solid #EFEFEF;
        .personImg {
            text-align: center;
            height: 80px;
            line-height: 80px;
            width: 100%;
        }
        .el-menu {
            border-right: none;
        }
    }
}

</style>