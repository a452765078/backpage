<template>
    <div class="leave">
        <div class="formOperate">
            <div class="box">
                <div class="inner">
                    <el-form :inline="true" :model="leaveForm" ref="leaveForm">
                        <el-form-item label="申请类型" prop="state">
                            <el-select v-model="leaveForm.applyState" class="m-2" placeholder="请选择申请类型">
                                <el-option
                                v-for="item in stateOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                        <el-button type="primary" @click="getLeavesList">查询</el-button>
                        <el-button type="primary" @click="formReset('leaveForm')">重置</el-button>
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
                    <el-table :data="tableData" @selection-change="select(sel,row)" ref="tableDom">
                        <!-- <el-table-column type="selection" width="55" /> -->
                        <el-table-column v-for="(column,index) in leaveList" :label="column.label"  :prop="column.prop" :key="index" :formatter="column.formatter"></el-table-column>
                        <el-table-column label="操作" width="180px">
                            <template #default="scope">
                                <el-button size="small" @click="openDialogProcess('edit',scope.row)"
                                >审批进度</el-button
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
            title="审批提交"
            width="40%">
            <el-form :inline="false" :model="leaveModel" ref="leaveModel" label-width="100px" :rules="rules">
                <el-form-item label="请假类型" prop="applyType">
                    <el-select v-model="leaveModel.applyType" placeholder="请选择休假类型">
                        <el-option
                        v-for="item in stateOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="请假时间" prop="startAndEndTime">
                    <el-date-picker
                        v-model="leaveModel.startAndEndTime"
                        type="daterange"
                        range-separator="To"
                        start-placeholder="起始日期"
                        end-placeholder="截至日期"
                        :size="'default'"
                        @change="dateUpdate"
                    />
                </el-form-item>
                <el-form-item label="请假时长" prop="leaveTime">
                    <div class="">{{leaveModel.leaveTime}}</div>
                </el-form-item>
                <el-form-item label="请假原因" prop="reasons">
                    <el-input
                    v-model="leaveModel.reasons"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    type="textarea"
                    placeholder="请输入请假原因"
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
        <!-- start1 -->
        <el-dialog
            v-model="dialogVisibleProcess"
            title="审批进度查看"
            width="40%">
            <el-steps :space="200" :active="leaveModel.applyState==1?1:leaveModel.applyState==2?2:3" finish-status="success">
                <el-step title="待审批" />
                <el-step title="审批中" />
                <el-step title="审批完成" />
            </el-steps>
            <div class="item">
                <span class="label_name">休假类型</span>
                <span class="label_content">{{leaveModel.applyType}}</span>
            </div>
            <div class="item">
                <span class="label_name">休假时间</span>
                <span class="label_content">{{leaveModel.startTime}}到{{leaveModel.endTime}}</span>
            </div>
            <div class="item">
                <span class="label_name">休假时长</span>
                <span class="label_content">{{leaveModel.leaveTime}}</span>
            </div>
            <div class="item">
                <span class="label_name">休假原因</span>
                <span class="label_content">{{leaveModel.reasons}}</span>
            </div>
            <div class="item">
                <span class="label_name">审批状态</span>
                <span class="label_content">{{leaveModel.applyState}}</span>
            </div>
            <div class="item">
                <span class="label_name">审批人</span>
                <span class="label_content">{{leaveModel.curAuditUserName}}</span>
            </div>
        </el-dialog>
  <!-- end1 -->
  
    </div>
</template>
<script>
import pagerContent from '../utils/pager'
import api from '../api/api'
import dataFormat from '../utils/dateFormat'
export default {
    name: 'users',
    data() {
        return {
            leaveForm: {
                type:'',
                applyState:''
            },
            stateOptions: [
                {
                    label:'事假',
                    value: 1
                },
                {
                    label:'调休',
                    value: 2
                },
                {
                    label:'年假',
                    value: 3
                }
            ],
            tableData:[],
            pager:{
                pageNum:1,
                pageSize:10
            },
            leaveList: [
                {
                    prop:'orderNo',
                    label:'申请单号'
                },
                {
                    prop:'applyType',
                    label: '休假类型'
                },
                {
                    prop:'leaveTime',
                    label:'申请时长'
                },
                {
                    prop:'startTime',
                    label:'开始时间',
                    // formatter: (val)=>{
                    //     console.log(typeof val.startTime)
                    //     return dataFormat.transDate('YYYY-MM-DD',val.startTime)
                    // }
                },
                {
                    prop:'endTime',
                    label:'结束时间'
                },
                {
                    prop:'reasons',
                    label:'原因'
                },
                {
                    prop:'createTime',
                    label:'创建时间'
                },
                {
                    prop:'auditUsers',
                    label:'审批人'
                },
                {
                    prop:'curAuditUserName',
                    label:'当前审批人'
                },
                {
                    prop:'applyState',
                    label:'审批状态',
                    formatter: (val) => {
                        let applyState = val.applyState
                        return this.applyStateName[applyState]
                    }
                },
            ],
            applyStateName: {
                1:'待审批',
                2:'审批中',
                3:'审批拒绝',
                4:'审批通过',
                5:"作废"
            },
            curPage:1,
            selectionTarget: [],//当前选中框的userId
            dialogVisibleProcess: false,
            dialogVisible: false,
            action:'',
            leaveModel: {
                orderNo:'',
                leaveTime: '',
                startTime:'',
                endTime:'',
                reasons:'',
                createTime:'',
                auditUsers:[],
                applyState:'',
                curAuditUserName: '',
                startAndEndTime:''
            },
            rules: {
                applyType:[
                    {required:true,message:'请输入账号',trigger:'blur'}
                ],
                reasons:[
                    {required:true,message:'请输入账号',trigger:'blur'}
                ]
            }
        }
    },
    mounted() {
        this.getLeavesList()
        this.getRolesList()
        this.getDeptList()
    },
    methods: {
        async getLeavesList() {
            
            let params = {...this.leaveForm,
                pageNum:this.curPage,
                pageSize:this.pager.pageSize
            }
            const res = await api.getLeaveList(params)
            this.tableData = res.list
            this.pager = res.page
        },
        getCurrentPage(val) {
            this.curPage = val;
            this.getLeavesList()
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
        // 请假申请-日期改变时
        dateUpdate() {
            this.leaveModel.startTime = this.leaveModel.startAndEndTime[0]
            this.leaveModel.endTime = this.leaveModel.startAndEndTime[1]
            let day = Math.ceil((this.leaveModel.endTime - this.leaveModel.startTime)/1000/60/60/24) +1
            this.leaveModel.leaveTime = `${day} 天`
            console.log(dataFormat.transDate('YYYY-MM-DD',this.leaveModel.startTime))

            console.log()

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
        openDialogProcess(action,row) {
            this.action = action
            this.dialogVisibleProcess = true
            if(action == 'edit') {
                this.leaveModel = row
            }
        },
        closeDialogProcess() {
            this.action = ''
            this.dialogVisibleProcess = false
        },
        openDialog(action,row) {
            this.action = action
            this.dialogVisible = true
        },
        closeDialog() {
            this.action = ''
            this.dialogVisible = false
            this.leaveModel = {}
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
            this.$refs['leaveModel'].validate( async (valid) => {
                console.log(valid)
                if(valid) {
                    let params = {
                        ...this.leaveModel,
                        action:this.action
                    }
                    const res = await api.operateLeave(params)
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
.leave {
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
    .el-dialog {
        .item {
            height: 50px;
            line-height: 50px;
            font-size: 18px;
            margin-left: 12px;
            .label_name {
                width: 150px;
                text-align: right;
                display: inline-block;
                &::after {
                    content: ':';
                    margin-left: 8px;
                    margin-right: 12px;
                }
            }
            .label_content {
                display: inline-block;
            }
        }
    }
}
</style>