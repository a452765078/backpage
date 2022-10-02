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
                                @click="delMenu('single',scope.row._id)"
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
            <el-form :inline="false" :model="menuModel" ref="menuModel" label-width="100px" :rules="rules">
                <el-form-item label="父级菜单" prop="parentId">
                    <el-cascader :options="tableData" :props="{
                        checkStrictly: true, value: '_id', label: 'menuName' 
                    }" 
                    v-model="menuModel.parentId"
                    />
                </el-form-item>
                <el-form-item label="菜单类型" prop="menuType">
                    <el-radio-group v-model="menuModel.menuType" class="ml-4" size="'small">
                        <el-radio label="1" size="large">菜单</el-radio>
                        <el-radio label="2" size="large">按钮</el-radio>
                      </el-radio-group>
                </el-form-item>
                <el-form-item label="菜单名称" prop="menuName" v-if="menuModel.menuType==1">
                    <el-input v-model="menuModel.menuName"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon" v-if="menuModel.menuType==1">
                    <el-input v-model="menuModel.icon"></el-input>
                </el-form-item>
                <el-form-item label="路由地址" prop="path">
                    <el-input v-model="menuModel.path"></el-input>
                </el-form-item>
                <el-form-item label="组件地址" prop="component">
                    <el-input v-model="menuModel.component"></el-input>
                </el-form-item>
                <el-form-item label="菜单状态" prop="menuState">
                    <el-radio-group v-model="menuModel.menuState" size="'small">
                        <el-radio label="1" size="large">菜单</el-radio>
                        <el-radio label="2" size="large">按钮</el-radio>
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
    </div>
</template>
<script>
import pagerContent from '../utils/pager'
import api from '../api/api'
export default {
    name: 'users',
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
                    label:'组件路径'
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
            }
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
        async delMenu(type,val) {
            this.action = 'delete'
            const res = await api.operateMenu({
                _id:val,
                action:this.action
            })
        },
        openDialog(action,row) {
            this.action = action
            this.dialogVisible = true
            if(action == 'edit') {
                this.menuModel = row
            }
        },
        closeDialog() {
            this.action = ''
            this.dialogVisible = false
            this.menuModel = {}
        },
        dialogSubmit() {
            this.$refs['menuModel'].validate( async (valid) => {
                console.log(valid)
                if(valid) {
                    let params = {
                        ...this.menuModel,
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