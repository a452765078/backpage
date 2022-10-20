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
                                @click="openConfirmDialog(scope.row._id)"
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
  <el-dialog
            v-model="isConfirm"
            title="Tips"
            width="30%"
            :before-close="handleClose"
        >
            <span>确认是否删除</span>
            <template #footer>
            <span class="dialog-footer">
                <el-button @click="delRole('cancel')">取消</el-button>
                <el-button type="danger" @click="delRole('confirm')"
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
                        let arr = Object.values(row.permissionList.checkedKeys)  //转成数组
                        let arr1 = Object.values(row.permissionList.halfCheckedKeys) 
                        let full_arr = [...arr,...arr1]
                        full_arr = full_arr.map(item => this.KeyValue[item]).filter(item=>item)
                        return full_arr.join(",")
                        // return row.permissionList.checkedKeys.join(",")
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
                roleName:[
                    {required:true,message:'请输入角色名称',trigger:'blur'}
                ],
            },
            dialogVisiblePermission: false,
            rolePermissionModel: {},
            permissionList:[],
            defaultCheckedKeys:[],
            curId:'',
            KeyValue:{} , // 菜单id与菜单名称的对应关系
            isConfirm: false,
            curId: '', //当前绑定的id
        }
    },
    created() {
        // this.getRoleList()
        // this.getMenuList()
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
            this.KeyValue = menuDict

        },  
        getCurrentPage(val) {
            this.curPage = val;
            this.getRoleList()
        },
        formReset(val) {
            this.$refs[val].resetFields()
        },
        openConfirmDialog(id) {
            this.isConfirm = true
            this.curId = id;
        }, 
        async delRole(val) {
            if(val == 'cancel') {
                this.isConfirm = false
                return 
            }else if(val == 'confirm') {
                this.action = 'delete'
                try {
                    const res = await api.operateRole({
                    _id:this.curId,
                    action:this.action
                    })
                    this.getRoleList()
                    this.isConfirm = false
                    alert(`删除成功`)
                } catch (error) {
                    alert(`删除失败，原因为${error}`)
                }

            }

        },
        openDialog(action,row) {
            this.action = action
            this.dialogVisible = true
            
            if(action == 'edit') {
                this.$nextTick(()=>{
                    this.$refs['roleModel'].resetFields()
                    this.roleModel = JSON.parse(JSON.stringify(row))
                })

            }
        },
        closeDialog() {
            this.action = ''
            this.dialogVisible = false
            this.roleModel = {}
        },
        dialogSubmit() {
            this.$refs['roleModel'].validate( async (valid) => {
                let {_id,roleName,remark} = this.roleModel
                if(valid) {
                    let params = {
                        _id,
                        roleName,
                        remark,
                        action:this.action
                    }
                    try {
                        const res = await api.operateMenu(params)
                        alert("操作成功")
                        this.getRoleList()
                        this.closeDialog()
                    } catch (error) {
                        alert("操作失败",error)
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
                this.defaultCheckedKeys = JSON.parse(JSON.stringify(row.permissionList.checkedKeys))
                //这里通过defaultchecedKeys没法实现打开后显示当前行的角色分配
                this.$refs['roleTree'].setCheckedNodes(JSON.parse(JSON.stringify(row.permissionList.checkedKeys)))
                this.curId = row._id
                this.rolePermissionModel.roleName = row.roleName
            })

        },  
        closeDialogPermission() {
            this.dialogVisiblePermission = false;
        },
        dialogCancelPermission() {
            this.closeDialogPermission()
        },
        async dialogSubmitPermission() {
            let _id = this.curId
            let checkedKeys  = this.$refs['roleTree'].getCheckedKeys()
            let halfCheckedKeys = this.$refs['roleTree'].getHalfCheckedKeys()
            let permissionList = {}
            permissionList.checkedKeys = checkedKeys
            permissionList.halfCheckedKeys = halfCheckedKeys
            let params = {
                _id,
                permissionList
            }
            const res = await api.updateRolePermission({
                ...params
            })
            this.closeDialogPermission()
            this.getRoleList()
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