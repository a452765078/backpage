<template>
    <div class="dept">
        <div class="formOperate">
            <div class="box">
                <div class="inner">
                    <el-form :inline="true" :model="deptForm" ref="deptForm">
                        <el-form-item label="部门名称" prop="deptName">
                            <el-input v-model="deptForm.deptName"></el-input>
                        </el-form-item>
                        <el-button type="primary" @click="getDeptList">查询</el-button>
                        <el-button type="primary" @click="formReset('deptForm')">重置</el-button>
                    </el-form>
                </div>
            </div>
            </div>
        <div class="tableOperate">
            <div class="box">
                <div class="top">
                    <el-button type="primary" @click="openDialog('create')">新增</el-button>
                </div>
                <div class="inner">
                    <el-table :data="tableData" 
                    ref="tableDom" 
                    row-key="_id" 
                    :tree-props="{ children: 'children'}"
                   >
                        <el-table-column v-for="(column,index) in deptInfoList" :label="column.label"  :prop="column.prop" :key="index"></el-table-column>
                        <el-table-column label="操作">
                            <template #default="scope">
                                <el-button size="small" @click="openDialog('edit',scope.row)"
                                >编辑</el-button
                                >
                                <el-button
                                size="small"
                                type="danger"
                                @click="openDelDialog(scope.row._id)"
                                >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
            
                </div>
            </div>
        </div>
        <!-- start -->
        <el-dialog
            v-model="dialogVisible"
            title="用户操作"
            width="40%"
            :before-close="handleClose">
            <el-form :inline="false" :model="deptModel" ref="deptModel" label-width="100px" :rules="rules">
                <el-form-item label="上级部门" prop="parentId">
                    <el-cascader :options="tableData" :props="{
                        checkStrictly: true, value: '_id', label: 'deptName' 
                    }" 
                    v-model="deptModel.parentId"
                    />
                </el-form-item>
                <el-form-item label="部门名称" prop="deptName">
                    <el-input v-model="deptModel.deptName" class="ml-4" size="'small">
                      </el-input>
                </el-form-item>
                <el-form-item label="部门负责人" prop="userName">
                    <el-select v-model="deptModel.userInfo" class="m-2" placeholder="Select" size="small" @change="userNameChange()">
                        <el-option
                          v-for="item in userNameOptions"
                          :key="item.userId"
                          :label="item.userInfo.split('/')[0]"
                          :value="item.userInfo"
                        />
                      </el-select>
                </el-form-item>
                <el-form-item label="负责人邮箱" prop="userEmail">
                    <el-input v-model="deptModel.userEmail"  disabled ></el-input>
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
        <el-dialog
            v-model="isConfirm"
            title="Tips"
            width="30%"
            >
            <span>确认是否删除</span>
            <template #footer>
            <span class="dialog-footer">
                <el-button @click="delDept('cancel')">取消</el-button>
                <el-button type="primary" @click="delDept('confirm')"
                >确认</el-button
                >
            </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import pagerContent from '../utils/pager'
import api from '../api/api'
export default {
    name: 'users',
    data() {
        return {
            deptForm: {
                deptName:'',
            },
            tableData:[],
            pager:{
                pageNum:1,
                pageSize:10
            },
            deptInfoList: [
                {
                    prop:'deptName',
                    label:'部门名称'
                },
                {
                    prop:'userName',
                    label:'负责人'
                },
                {
                    prop:'userEmail',
                    label:'负责人邮箱'
                },
                {
                    prop:'updateTime',
                    label:'更新时间'
                },
                {
                    prop:'createTime',
                    label:'创建时间'
                },
            ],
            curPage:1,
            dialogVisible: false,
            action:'',
            deptModel: {
                _id:'',
                menuName: '',
                menuType:'',
                menuCode:'',
                path:'',
                icon:'',
                component:'',
                parentId:[null],
                userInfo:'',
                userId:'',
                userName:'',
                userEmail:''
            },
            rules: {
                deptName:[
                    {required:true,message:'请输入部门名称',trigger:'blur'}
                ],
                userName: [
                    {required:true,message:'请输入用户名',trigger:'blur'}
                ],
                userEmail: [
                    {required:true,message:'请输入邮箱',trigger:'blur'}
                ],
            },
            userNameOptions:[],
            curId: ''  , // 用户执行删除操作,
            isConfirm: false
        }
    },
    mounted() {
        this.getDeptList()
        this.getUserList()
    },
    methods: {
        async getUserList() {
            
            let params = {
                pageNum:this.curPage,
                pageSize:this.pager.pageSize
            }
            const res = await api.getAllUserList(params)
            this.userNameOptions = res
            this.formatUser()
        },
        formatUser() {
            this.userNameOptions.map((item) => {
                item.userInfo = `${item.userName}/${item.userEmail}/${item.userId}`
            })
        }, 
        userNameChange() {
            this.deptModel.userName =  this.deptModel.userInfo.split("/")[0]
            this.deptModel.userEmail = this.deptModel.userInfo.split("/")[1]
            this.deptModel.userId = this.deptModel.userInfo.split("/")[2]
        },  
        async getDeptList() {
            
            let params = {...this.deptForm,
                pageNum:this.curPage,
                pageSize:this.pager.pageSize
            }
            const res = await api.getDeptList(params)
            this.tableData = res
        },
        formReset(val) {
            this.$refs[val].resetFields()
        },
        openDelDialog(id) {
            this.curId = id;
            this.isConfirm = true
        },
        async delDept(type) {
            if(type == 'cancel') {
                this.isConfirm = false
                return
            }else if(type == 'confirm') {
                this.action = 'delete'
                try {
                    const res = await api.operateDept({
                        _id:this.curId,
                        action:this.action
                    })
                    this.isConfirm = false
                    this.getDeptList()
                    alert("删除成功")
                } catch (error) {
                    alert("删除失败,",error)
                }
            }
        },
        openDialog(action,row) {
            this.action = action
            this.dialogVisible = true
            if(action == 'edit') {
                this.$nextTick(()=>{
                    this.$refs['deptModel'].resetFields()
                    this.deptModel = JSON.parse(JSON.stringify(row))
                    this.deptModel.userInfo = `${row.userName}/${row.userEmail}/${row.userId}`
                })
            }else if(action == 'create') {
                this.$nextTick(()=>{
                    this.$refs['deptModel'].resetFields()
                    this.deptModel = {}
                })
            }
        },
        closeDialog() {
            this.action = ''
            this.dialogVisible = false
            this.deptModel = {}
        },
        dialogSubmit() {
            this.$refs['deptModel'].validate( async (valid) => {
                if(valid) {
                    let {_id,parentId,deptName,userId,userName,userEmail} = this.deptModel
                    parentId = parentId ? parentId : [null]
                    let params = {
                        action:this.action,
                        _id,
                        parentId,deptName,userId,userName,userEmail
                    }
                    const res = await api.operateDept(params)
                    if(res) {
                        alert("操作成功")
                        this.closeDialog()
                        this.getDeptList()
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
.dept {
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