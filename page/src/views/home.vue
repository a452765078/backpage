<template>
    <div class="home">
        <div class="left">        
            <Menu :menuList="menuList"></Menu>
        </div>
        <div class="right">
            <Nav></Nav>
            <div class="content">
                <router-view></router-view>
            </div>
        </div>

    </div>
</template>
<script>
import Menu from '../components/Menu.vue';
import Nav from '../components/Nav.vue';
import api from '../api/api';
export  default {
    name:'home',
    components: {
        Menu,
        Nav
    },  
    data() {
       return {
        menuList:[]
       }
    },
    mounted() {
        this.getPermissionList()
    },
    methods: {
        getPermissionList() {
            api.getPermissionList({}).then(res=>{
                this.menuList = res.menuList;
                console.log(res)
            }).catch((err) => {
                console.log(err)
            })
        }
    }
}
</script>
<style lang="scss">
.home {
    display: flex;
    .left {
        width: 200px;
    }
    .right {
        width: calc(100vw - 200px);
        background: #e5e5e5;
        box-sizing: border-box;


    }
}
</style>