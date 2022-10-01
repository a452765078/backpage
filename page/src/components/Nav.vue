<template>
    <div class="nav">
        <div class="menuAdd">
            <el-icon>
                <Fold></Fold>
            </el-icon>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item
                ><a href="/">用户</a></el-breadcrumb-item
                >
                <el-breadcrumb-item>用户详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="userInfo">
            userInfo
        </div>
    </div>
</template>
<script>
export default {
    name: 'Nav',
    props: {
        
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
}
</style>