<template>
    <div class="users">
        <div class="formOperate">
            <div class="box">
                <div class="inner">
                    <el-form :inline="true" :model="menuForm" ref="menuForm">
                        <el-form-item label="菜单名称" prop="menuName">
                            <el-input v-model="menuForm.menuName"></el-input>
                        </el-form-item>
                        <el-form-item label="菜单状态" prop="menuState">
                            <el-input v-model="menuForm.menuState"></el-input>
                        </el-form-item>
                        <el-button type="primary" @click="getMenuList">查询</el-button>
                        <el-button type="primary" @click="formReset('menuForm')">重置</el-button>
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
                        <el-table-column v-for="(column,index) in menuInfoList" :label="column.label"  :prop="column.prop" :key="index"></el-table-column>
                        <el-table-column label="操作">
                            <template #default="scope">
                                <el-button size="small" @click="openDialog('edit',scope.row)"
                                >编辑</el-button
                                >
                                <el-button
                                size="small"
                                type="danger"
                                @click="openDialogConfirm(scope.row._id)"
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
            width="40%">
            <el-form :inline="false" :model="menuModel" ref="menuModel" label-width="100px" :rules="rules">
                <el-form-item label="父级菜单" prop="parentId">
                    <el-cascader :options="tableData" :props="{
                        checkStrictly: true, value: '_id', label: 'menuName' 
                    }" 
                    v-model="menuModel.parentId"
                    />
                </el-form-item>
                <el-form-item label="菜单类型" prop="menuType">
                    <el-radio-group v-model="menuModel.menuType" class="ml-4" size="small">
                        <el-radio :label="1" size="large">菜单</el-radio>
                        <el-radio :label="2" size="large">按钮</el-radio>
                    </el-radio-group>
                      <!-- 此处为何要 : 才能正常赋值？ -->
                </el-form-item>
                <el-form-item label="菜单名称" prop="menuName" >
                    <el-input v-model="menuModel.menuName"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon" v-if="menuModel.menuType==1">
                    <el-input v-model="menuModel.icon"></el-input>
                </el-form-item>
                <el-form-item label="路由路径" prop="path" v-if="menuModel.menuType==1">
                    <el-input v-model="menuModel.path"></el-input>
                </el-form-item>
                <el-form-item label="组件名称" prop="component" v-if="menuModel.menuType==1">
                    <el-input v-model="menuModel.component"></el-input>
                </el-form-item>
                <el-form-item label="权限标识" prop="menuCode" v-if="menuModel.menuType==2">
                    <el-input v-model="menuModel.menuCode"></el-input>
                </el-form-item>
                
                <el-form-item label="菜单状态" prop="menuState">
                    <el-radio-group v-model="menuModel.menuState" size="small">
                        <el-radio :label="1" size="large">可用</el-radio>
                        <el-radio :label="2" size="large">不可用</el-radio>
                      </el-radio-group>
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
            :before-close="handleClose"
        >
            <span>确认是否删除</span>
            <template #footer>
            <span class="dialog-footer">
                <el-button @click="delMenu('cancel')">取消</el-button>
                <el-button type="danger" @click="delMenu('confirm')"
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
    name: 'menus',
    components: {

    },
    data() {
        return {
            menuForm: {
                menuName:'',
                menuState:1
            },
            tableData:[],
            pager:{
                pageNum:1,
                pageSize:10
            },
            menuInfoList: [
                {
                    prop:'menuName',
                    label:'菜单名称'
                },
                {
                    prop:'icon',
                    label:'图标'
                },
                {
                    prop:'menuType',
                    label:'菜单类型'
                },
                {
                    prop:'menuCode',
                    label:'权限标识'
                },
                {
                    prop:'path',
                    label:'路径'
                },
                {
                    prop:'component',
                    label:'组件名称'
                },
                {
                    prop:'menuState',
                    label:'菜单状态'
                },
                {
                    prop:'createTime',
                    label:'创建时间'
                },
            ],
            curPage:1,
            dialogVisible: false,
            action:'',
            menuModel: {
                _id:'',
                menuName: '',
                menuType: '1',
                menuCode:'',
                path:'',
                icon:'',
                component:'',
                menuState: '1',
                parentId:[null]
            },
            rules: {
                menuName:[
                    {required:true,message:'请输入菜单姓名',trigger:'blur'}
                ],
                menuType: [
                    {required:true,message:'请输入菜单类型',trigger:'blur'}
                ],
                menuCode: [
                    {required:true,message:'请输入菜单标识',trigger:'blur'}
                ],
                path: [
                    {required:true,message:'请输入路径',trigger:'blur'}
                ],
            },
            isConfirm: false ,//是否显示弹框,
            curOperateId: '',//当前正在删除的id
        }
    },
    mounted() {
        this.getMenuList()
    },
    methods: {
        async getMenuList() {
            
            let params = {...this.menuForm,
                pageNum:this.curPage,
                pageSize:this.pager.pageSize
            }
            const res = await api.getMenuList(params)
            this.tableData = res
        },
        formReset(val) {
            this.$refs[val].resetFields()
        },
        async delMenu(type) {
            if(type == 'cancel') {
                this.isConfirm = false
                return
            }else if(type == 'confirm') {
                this.action = 'delete'
                try {
                    const res = await api.operateMenu({
                        _id:this.curOperateId,
                        action:this.action
                    })
                    this.getMenuList()
                    this.isConfirm = false
                } catch (error) {
                    alert("删除失败",error)
                }
            }
        },
        openDialog(action,row) {
            this.action = action
            this.dialogVisible = true
            if(action == 'edit') {
                this.$nextTick(()=>{
                    console.log(this.$refs)
                    // this.$refs['menuModel'].resetFields()
                    this.menuModel = JSON.parse(JSON.stringify(row))
                })
            }else if( action == 'create') {
                // console.log("this.$refs",this.$refs)
                this.$nextTick(()=>{
                    this.$refs['menuModel'].resetFields()
                    this.menuModel = {}
                })
                // 使用nextTick 能够解决刷新后打开页面时获取不到dom的问题。
            }
        },
        closeDialog() {
            this.action = ''
            this.dialogVisible = false
            this.menuModel = {}
        },
        dialogSubmit() {
            this.$refs['menuModel'].validate( async (valid) => {
                if(valid) {
                    debugger
                    let {_id,parentId,menuType,menuName,menuCode,menuState,path,component} = this.menuModel
                    parentId = parentId ? parentId : [null]
                    let params = {
                        _id,parentId,menuType,menuName,menuCode,menuState,path,component,
                        action:this.action
                    }
                    try {
                        const res = await api.operateMenu(params)
                        alert("操作成功")
                        this.closeDialog()
                        this.getMenuList()
                    } catch (error) {
                        alert("操作失败",error)
                    }

                }
            })
        },
        dialogCancel() {
            this.closeDialog()
        },
        openDialogConfirm(val) {
            this.isConfirm = true;
            this.curOperateId = val
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