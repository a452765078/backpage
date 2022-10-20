<template>
    <div class="nav">
        <div class="menuAdd">
            <el-icon>
                <Fold></Fold>
            </el-icon>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="item in breadCrumb" :to="item.path" :key="item.path">{{item.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="userInfo">
            <el-badge :is-dot="count>0"  @click="toLeavePage">
                <el-icon><Bell /></el-icon>
            </el-badge>
            <span class="userName">{{userInfo}}</span>
            <span class="logout" @click="logout">注销</span>
        </div>
    </div>
</template>
<script>
import Api from '../api/api'
import store from '../storage/index'
export default {
    name: 'Nav',
    props: {
        
    },
    data() {
        return {
            count: 0 //消息数量
        }
    },
    computed: {
        breadCrumb() {
            return this.$route.matched
        },
        userInfo() {
            return this.$store.state.userInfo
        },
        count() {
            return this.$store.state.count
        }
    },
    mounted() {
        this.getLeaveCount()
    },
    methods: {
        toLeavePage() {
            this.$router.push("/audit/approve")
        },
        async getLeaveCount() {
            try {
                let count = await Api.getLeaveCount({})
                this.$store.dispatch("getCount",count)
            } catch (error) {
                
            }

        },
        logout() {
            this.$store.dispatch("userInfo","")
            store.setAllStorage("")
            this.$router.push("/login")
        }
    }
}
</script>
<style lang="scss">
.nav {
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #FFFFFF;
    padding: 0 18px;
    box-sizing: border-box;
    .menuAdd {
        display: flex;
        justify-content: center;
        align-items: center;
        .el-breadcrumb {
            margin-left: 12px;
        }
    }
    .userInfo {
        vertical-align: middle;
        text-align: center;
        .el-badge {
            cursor: pointer;
        }
        .userName {
            margin-left: 12px;
            margin-right: 12px;
        }
        .logout {
            display: inline-block;
            cursor: pointer;
        }
    }
}
</style>