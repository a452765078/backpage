<template>
    <div class="login">
        <el-form :model="form" label-width="60px" size="default" :rules="rules" ref="loginForm">
            <el-form-item label="账号" prop="userName">
                <el-input v-model="form.userName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="userPwd">
                <el-input v-model="form.userPwd" type="password"></el-input>
            </el-form-item>
            <el-button type="primary" size="default" @click="login">登录</el-button>
        </el-form>
    </div>
</template>
<script>
import { ElForm,ElFormItem,ElInput,ElButton} from 'element-plus';
import storage from '../storage/index';
import Api from '../api/api'
export  default {
    name:'login',
    components: { 
        ElForm,
        ElFormItem,
        ElInput
    },
    data() {
        return {
            form: {
                userName:'',
                userPwd:''
            },
            rules: {
                userName:[
                    {required:true,message:'请输入账号',trigger:'blur'}
                ],
                userPwd:[
                    {required:true,message:'请输入密码',trigger:'blur'}
                ]
            }
        }
    },
    methods: {
        login() {
            this.$refs['loginForm'].validate(async (valid)=> {
                if(valid) {
                    // console.log(`登录：userName:${this.form.userName} userPwd:${this.form.userPwd}`)

                    Api.login({
                        userName:this.form.userName,
                        userPwd:this.form.userPwd
                    }).then((res)=>{
                        debugger
                        storage.setAllStorage(res)
                        this.$router.push({
                            path:"/home"
                        })
                    }).catch((err)=>{
                        console.log(err)
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss">
.login {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-form {
        padding: 33px;
        border: solid 1px ;
        border-radius: 4px;
        .el-button {
            margin-top: 10px;
            margin-left: 20px;
            width: 250px;
        }
    }
}
</style>