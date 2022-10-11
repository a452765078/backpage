<template>
    <div class="users">
        <div class="formOperate">
            <div class="box">
                <div class="inner">
                    <el-form :inline="true" :model="roleForm" ref="roleForm">
                        <el-form-item label="角色名称" prop="roleName">
                            <el-input v-model="roleForm.roleName"></el-input>
                        </el-form-item>
                        <el-button type="primary" @click="getRoleList">查询</el-button>
                        <el-button type="primary" @click="formReset('roleForm')">重置</el-button>
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
                        <el-table-column v-for="(column,index) in menuInfoList" :label="column.label"  :prop="column.prop" :key="index" :formatter="column.formatter"></el-table-column>
                        <el-table-column label="操作" width="280px">
                            <template #default="scope">
                                <el-button size="small" @click="openDialog('edit',scope.row)"
                                >编辑</el-button
                                >
                                <el-button
                                size="small"
                                type="primary"
                                @click="delRole('delete',scope.row._id)"
                                >删除</el-button
                                >
                                <el-button
                                size="small"
                                type="danger"
                                @click="openDialogPermission(scope.row)"
                                >设置权限</el-button
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
            width="40%">
            <el-form :inline="false" :model="roleModel" ref="roleModel" label-width="100px" :rules="rules">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="roleModel.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色备注" prop="remark">
                    <el-input v-model="roleModel.remark"></el-input>
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
  <!-- start 1 -->
  <el-dialog
            v-model="dialogVisiblePermission"
            title="用户操作"
            width="40%">
            <el-form :inline="false" :model="rolePermissionModel" ref="rolePermissionModel" label-width="100px" :rules="rules">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="rolePermissionModel.roleName"></el-input>
                </el-form-item>
            <el-tree 
            ref="roleTree"
            :data="menuInfoListPermission" 
            :props="{children:'children',label:'menuName'}" 
            :default-expand-all="true"
            show-checkbox 
            node-key="_id"
            :default-checked-keys="defaultCheckedKeys"
            />
            </el-form>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="dialogCancelPermission">取消</el-button>
                            <el-button type="primary" @click="dialogSubmitPermission">确定</el-button>
                        </span>
                    </template>
        </el-dialog>
  <!-- end 1 -->
    </div>
</template>
<script>
import pagerContent from '../utils/pager'
import api from '../api/api'
export default {
    name: 'roles',
    data() {
        return {
            that: this,
            roleForm: {
                roleName:''
            },
            tableData:[],
            pager:{
                pageNum:1,
                pageSize:10,
                total:10
            },
            menuInfoList: [
                {
                    prop:'roleName',
                    label:'角色名称'
                },
                {
                    prop:'remark',
                    label:'备注'
                },
                {
                    prop:'权限列表',
                    label:'菜单类型',
                    formatter: (row,column)=> {
                        let arr = Object.values(row.permissionList.halfCheckedKeys)  //转成数组
                        arr = arr.map(item => this.KeyValue[item]).filter(item=>item)
                        return arr.join(",")
                    }
                },
                {
                    prop:'createTime',
                    label:'更新时间'
                },
                {
                    prop:'createTime',
                    label:'创建时间'
                },
            ],
            menuInfoListPermission: [

            ],
            curPage:1,
            dialogVisible: false,
            action:'',
            roleModel: {
                _id:'',
                menuName: '',
                menuType:'',
                menuCode:'',
                path:'',
                icon:'',
                component:'',
                parentId:[null]
            },
            rules: {
                menuName:[
                    {required:true,message:'请输入账号',trigger:'blur'}
                ],
                menuType: [
                    {required:true,message:'请输入邮箱',trigger:'blur'}
                ],
                menuCode: [
                    {required:true,message:'请输入手机号',trigger:'blur'}
                ],
                path: [
                    {required:true,message:'请输入岗位',trigger:'blur'}
                ],
                icon: [
                    {required:true,message:'请输入在职状态',trigger:'blur'}
                ],
                component: [
                    {required:true,message:'请选择角色',trigger:'blur'}
                ],
            },
            dialogVisiblePermission: false,
            rolePermissionModel: {},
            permissionList:[],
            defaultCheckedKeys:[],
            curId:'',
            KeyValue:{} // 菜单id与菜单名称的对应关系
        }
    },
    mounted() {
        this.getRoleList()
        this.getMenuList()
    },
    methods: {
        async getRoleList() {
            
            let params = {...this.roleForm,
                pageNum:this.curPage,
                pageSize:this.pager.pageSize
            }
            const res = await api.getRolesListByPage(params)
            this.tableData = res.list
            this.pager.total = res.page.total
        },
        async getMenuList() {
            
            let params = {
                pageNum:this.curPage,
                pageSize:this.pager.pageSize
            }
            const res = await api.getMenuList(params)
            this.menuInfoListPermission = res
            this.formatMenuList()
            console.log("this.KeyValue =>",this.KeyValue)

        },
        formatMenuList() {
            let menuDict = {}
            let formatMethod = (menuDict,data) => {
                data.forEach((item,index)=>{
                    if(item.children&&item.component) {
                        let _id = item._id
                        let menuName = item.menuName
                        menuDict[_id] = menuName
                    }else if(item.children) {
                        formatMethod(menuDict,item.children)
                    }

                })
            }
            formatMethod(menuDict,this.menuInfoListPermission)
            console.log("menuDict =>",menuDict)
            this.KeyValue = menuDict

        },  
        getCurrentPage(val) {
            this.curPage = val;
            this.getRoleList()
        },
        formReset(val) {
            this.$refs[val].resetFields()
        },
        async delRole(type,val) {
            this.action = 'delete'
            const res = await api.operateRole({
                _id:val,
                action:this.action
            })
        },
        openDialog(action,row) {
            this.action = action
            this.dialogVisible = true
            if(action == 'edit') {
                this.roleModel = row
            }
        },
        closeDialog() {
            this.action = ''
            this.dialogVisible = false
            this.roleModel = {}
        },
        dialogSubmit() {
            this.$refs['roleModel'].validate( async (valid) => {
                console.log(valid)
                if(valid) {
                    let params = {
                        roleName:this.roleModel.roleName,
                        remark:this.roleModel.remark,
                        action:this.action
                    }
                    const res = await api.operateMenu(params)
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
        },
        openDialogPermission(row) {
            this.dialogVisiblePermission = true;
            this.$nextTick(()=>{
                this.defaultCheckedKeys = row.permissionList.checkedKeys
                this.curId = row._id
                this.rolePermissionModel.roleName = row.roleName
            })

        },  
        closeDialogPermission() {
            this.dialogVisiblePermission = false;
            this.defaultCheckedKeys = []
        },
        async dialogCancelPermission() {
            this.closeDialogPermission()
        },
        async dialogSubmitPermission() {
            let _id = this.curId
            let checkedKeys  = this.$refs['roleTree'].getCheckedKeys()
            let halfCheckedKeys = this.$refs['roleTree'].getHalfCheckedKeys()
            let params = {
                _id,
                checkedKeys,
                halfCheckedKeys
            }
            const res = await api.updateRolePermission({
                ...params
            })
            console.log(res)
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