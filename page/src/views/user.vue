<template>
    <div class="users">
        <div class="formOperate">
            <div class="box">
                <div class="inner">
                    <el-form :inline="true" :model="userForm" ref="userForm">
                        <el-form-item label="用户ID" prop="userId">
                            <el-input v-model="userForm.userId"></el-input>
                        </el-form-item>
                        <el-form-item label="用户名" prop="userName">
                            <el-input v-model="userForm.userName"></el-input>
                        </el-form-item>
                        <el-form-item label="在职状态" prop="state">
                            <el-select v-model="userForm.state" class="m-2" placeholder="Select">
                                <el-option
                                v-for="item in stateOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                        <el-button type="primary" @click="getUsersList">查询</el-button>
                        <el-button type="primary" @click="formReset('userForm')">重置</el-button>
                    </el-form>
                </div>
            </div>
            </div>
        <div class="tableOperate">
            <div class="box">
                <div class="top">
                    <el-button type="danger" @click="delUsers('patch')">批量删除</el-button>
                    <el-button type="primary" @click="openDialog('create')">新增</el-button>
                </div>
                <div class="inner">
                    <el-table :data="tableData" @selection-change="select(sel,row)" ref="tableDom">
                        <el-table-column type="selection" width="55" />
                        <el-table-column v-for="(column,index) in userInfoList" :label="column.label"  :prop="column.prop" :key="index"></el-table-column>
                        <el-table-column label="操作">
                            <template #default="scope">
                                <el-button size="small" @click="openDialog('edit',scope.row)"
                                >编辑</el-button
                                >
                                <el-button
                                size="small"
                                type="danger"
                                @click="delUsers('single',scope.row.userId)"
                                >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination background layout="prev, pager, next" :total="pager.total" @update:current-page="getCurrentPage" />
                </div>
            </div>
        </div>
        <!-- start -->
        <el-dialog
            v-model="dialogVisible"
            title="用户操作"
            width="40%"
            :before-close="handleClose">
            <el-form :inline="false" :model="userModel" ref="userModel" label-width="100px" :rules="rules">
                        <el-form-item label="用户名" prop="userName">
                            <el-input v-model="userModel.userName"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="userEmail">
                            <el-input v-model="userModel.userEmail">
                                <template #append>@168.com</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="mobile">
                            <el-input v-model="userModel.mobile"></el-input>
                        </el-form-item>
                        <el-form-item label="岗位" prop="job">
                            <el-input v-model="userModel.job"></el-input>
                        </el-form-item>
                        <el-form-item label="在职状态" prop="state">
                            <el-select v-model="userModel.state" class="m-2" placeholder="Select">
                                <el-option
                                v-for="item in stateOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="系统角色" prop="roleList">
                            <el-select
                                v-model="userModel.roleList"
                                multiple
                                filterable
                                allow-create
                                default-first-option
                                :reserve-keyword="false"
                                placeholder="请选择角色">
                                <el-option
                                v-for="item in roleList"
                                :key="item._id"
                                :label="item.roleName"
                                :value="item._id"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="部门" prop="deptId">
                            <el-cascader :options="deptList" :props="{
                                checkStrictly: true, value: '_id', label: 'deptName' 
                            }" 
                            v-model="userModel.deptId"
                            />
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="dialogCancel">取消</el-button>
                            <el-button type="primary" @click="dialogSubmit">确定</el-button>
                        </span>
                    </template>
        </el-dialog>
  <!-- end -->
    </div>
</template>
<script>
import pagerContent from '../utils/pager'
import api from '../api/api'
export default {
    name: 'users',
    data() {
        return {
            userForm: {
                userId: '',
                userName:'',
                state:1
            },
            stateOptions: [
                {
                    label:'所有',
                    value: 0
                },
                {
                    label:'在职',
                    value: 1
                },
                {
                    label:'离职',
                    value: 2
                },
                {
                    label:'试用期',
                    value: 3
                }
            ],
            tableData:[],
            pager:{
                pageNum:1,
                pageSize:10
            },
            userInfoList: [
                {
                    prop:'userId',
                    label:'用户ID'
                },
                {
                    prop:'userName',
                    label:'用户名'
                },
                {
                    prop:'userEmail',
                    label:'用户邮箱'
                },
                {
                    prop:'roleList',
                    label:'角色列表'
                },
                {
                    prop:'state',
                    label:'用户状态'
                },
                {
                    prop:'createTime',
                    label:'注册时间'
                },
                {
                    prop:'lastLoginTime',
                    label:'最后登录时间'
                },
            ],
            curPage:1,
            selectionTarget: [],//当前选中框的userId
            dialogVisible: false,
            action:'',
            userModel: {
                userId:'',
                userName: '',
                email:'',
                mobile:'',
                job:'',
                state:'',
                roleList:[],
                deptId:''
            },
            rules: {
                userName:[
                    {required:true,message:'请输入账号',trigger:'blur'}
                ],
                userEmail: [
                    {required:true,message:'请输入邮箱',trigger:'blur'}
                ],
                mobile: [
                    {required:true,message:'请输入手机号',trigger:'blur'}
                ],
                job: [
                    {required:true,message:'请输入岗位',trigger:'blur'}
                ],
                state: [
                    {required:true,message:'请输入在职状态',trigger:'blur'}
                ],
                roleList: [
                    {required:true,message:'请选择角色',trigger:'blur'}
                ],
                deptId: [
                    {required:true,message:'请选择部门',trigger:'blur'}
                ]
            }
        }
    },
    mounted() {
        this.getUsersList()
        this.getRolesList()
        this.getDeptList()
    },
    methods: {
        async getUsersList() {
            
            let params = {...this.userForm,
                pageNum:this.curPage,
                pageSize:this.pager.pageSize
            }
            const res = await api.getUsersList(params)
            this.tableData = res.list
            this.pager = res.page
        },
        getCurrentPage(val) {
            this.curPage = val;
            this.getUsersList()
        },
        formReset(val) {
            this.$refs[val].resetFields()
        },
        select(sel,row) {
            let selectionRows = this.$refs['tableDom'].getSelectionRows()
            if(selectionRows && selectionRows.length>0) {
                this.selectionTarget = selectionRows.map( item => item.userId)
            }
        },
        delUsers(type,val) {

            let userIdArr = []
            if(type === 'single') {
                userIdArr.push(val)
            }else if(type === 'patch') {
                userIdArr = this.selectionTarget;
                if(userIdArr.length === 0) {
                    alert("请先进行选择")
                    return
                }
            }
            const res = api.delUsersInfo({
                userIds:userIdArr
            })
            if(res) {
                alert("删除成功")
            }else {
                alert("删除失败")
            }
        },
        openDialog(action,row) {
            this.action = action
            this.dialogVisible = true
            if(action == 'edit') {
                this.userModel = row
            }
        },
        closeDialog() {
            this.action = ''
            this.dialogVisible = false
            this.userModel = {}
        },
        async getRolesList() {
            const res = await api.getRolesList({})
            this.roleList = res
        },
        async getDeptList() {
            const res = await api.getDeptList({})
            this.deptList = res
        },
        dialogSubmit() {
            this.$refs['userModel'].validate( async (valid) => {
                console.log(valid)
                if(valid) {
                    let params = {
                        ...this.userModel,
                        action:this.action
                    }
                    const res = await api.operateUsers(params)
                    if(res) {
                        alert("操作成功")
                        this.closeDialog()
                    }else {
                        alert("操作失败")
                    }
                }
            })
        },
        dialogCancel() {
            this.closeDialog()
        }
    }
}
</script>
<style lang="scss">
.users {
    box-sizing: border-box;
    padding: 18px;
    .formOperate {
        width: 100%;
        height: 80px;
        line-height: 80px;
        background: #FFFFFF;
        display: flex;
        align-items: center;
        .box {
           .inner {
            display: flex;
            align-items: center;
                .el-form {
                    .el-form-item {
                        margin-bottom: 0;
                        margin-left: 35px;
                    }
                    .el-button {
                        margin-left: 35px;
                    }
                }
           }
        }
    }
    .tableOperate {
        margin-top: 12px;
        width: 100%;
        min-height: 520px;
        background: #FFFFFF;
        .box {
            .top {
                padding: 22px;
                box-sizing: border-box;
                border-bottom: 1px solid lightgray;
            }
        }
    }
    .el-pagination {
        padding: 15px 15px;
    }
}
</style>