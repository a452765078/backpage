<template>
    <template  v-for="menu in menuList" :key="menu._id">
      <template v-if="menu.menuType==1&&!menu.component">
        <el-sub-menu :index="menu.path">
          <template #title>
            <!-- <component :is="menu.icon"></component> -->
            <el-icon><component :is="menu.icon?menu.icon.split('-')[2]:'location'"></component></el-icon>
            <span  :index="menu.path">{{menu.menuName}}</span>
          </template> 
          <tree-menu :menuList="menu.children"></tree-menu>
        </el-sub-menu>
      </template>
      <el-menu-item  v-else-if="menu.menuType==1&&menu.component" :index="menu.component">
          <span>{{menu.menuName}}</span>
      </el-menu-item>
    </template>
</template>
<script>

import {
Document,
Menu as IconMenu,
Location,
Setting,
} from '@element-plus/icons-vue'
export default {
  name: 'Menu',
  components: {
      Document,
      IconMenu,
      Location,
      Setting
  },
  props: {
      menuList:[]
  }
}
</script>
<style lang="scss">

</style>