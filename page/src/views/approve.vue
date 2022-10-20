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

                </div>
                <div class="inner">
                    <el-table :data="tableData" @selection-change="select(sel,row)" ref="tableDom">
                        <!-- <el-table-column type="selection" width="55" /> -->
                        <el-table-column v-for="(column,index) in leaveList" :label="column.label"  :prop="column.prop" :key="index" :formatter="column.formatter"></el-table-column>
                        <el-table-column label="操作" width="180px">
                            <template #default="scope">
                                <el-button type="danger" size="small" @click="openDialogProcess('edit',scope.row)"
                                >审核</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination background layout="prev, pager, next" :total="pager.total" @update:current-page="getCurrentPage" />
                </div>
            </div>
        </div>
        <!-- start1 -->
        <el-dialog
            v-model="dialogVisibleProcess"
            title="审核"
            width="50%">
            <el-form :inline="false" :model="leaveModel" ref="leaveModel" label-width="100px" :rules="rules">
                <el-form-item label="申请人">
                    <div class="">{{leaveModel.applyUser.userName}}</div>
                </el-form-item>
                <el-form-item label="休假类型">
                    <div class="">{{leaveModel.applyTypeName}}</div>
                </el-form-item>
                <el-form-item label="休假时间">
                    <div class="">{{leaveModel.startTime}}到{{leaveModel.endTime}}</div>
                </el-form-item>
                <el-form-item label="休假时长">
                    <div class="">{{leaveModel.leaveTime}}</div>
                </el-form-item>
                <el-form-item label="休假原因">
                    <div class="">{{leaveModel.reasons}}</div>
                </el-form-item>
                <el-form-item label="审批状态">
                    <div class="">{{leaveModel.applyState}}</div>
                </el-form-item>
                <el-form-item label="审批人">
                    <div class="">{{leaveModel.curAuditUserName}}</div>
                </el-form-item>
                <el-form-item label="评论" prop="remark">
                    <el-input
                        v-model="leaveModel.remark"
                        :rows="2"
                        type="textarea"
                        placeholder="Please input"
                    />
                </el-form-item>

            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <!--  -->
                    <el-button @click="dialogSubmit('pass')">通过</el-button>
                    <el-button type="primary" @click="dialogSubmit('refuse')">驳回</el-button>
                </span>
            </template>
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
                type:'approve',
                applyState:''
            },
            stateOptions: [
                {
                    label:'待审批',
                    value: 1
                },
                {
                    label:'审批中',
                    value: 2
                },
                {
                    label:'审批拒绝',
                    value: 3
                },
                {
                    label:'审批通过',
                    value: 4
                },
                {
                    label:'审批作废',
                    value: 5
                }
            ],
            tableData:[],
            pager:{
                pageNum:1,
                pageSize:10
            },
            leaveList: [
                {
                    prop:'applyUserName',
                    label: '申请人'
                },
                {
                    prop:'orderNo',
                    label:'申请单号'
                },
                {
                    prop:'applyType',
                    label: '休假类型',
                    formatter: (val)=> {
                        return {
                            1:"事假",
                            2:"调休",
                            3:"年假"
                        }[val.applyType]
                    }
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
                remark:[
                    {required:true,message:'请输入评论',trigger:'blur'}
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
            let applyState = this.leaveForm.applyState?this.leaveForm.applyState:'1'
            let params = {...this.leaveForm,
                applyState,
                pageNum:this.curPage,
                pageSize:this.pager.pageSize
            }
            const res = await api.getLeaveList(params)
            this.tableData = res.list

            let dict = {
                            1:"事假",
                            2:"调休",
                            3:"年假"
            }
            this.tableData.map(item=>{
                item.applyTypeName = dict[item.applyType]
                item.applyUserName = item.applyUser.userName
            })
            console.log(this.tableData)
            this.pager = res.page
        },
        getCurrentPage(val) {
            this.curPage = val;
            this.getLeavesList()
        },
        formReset(val) {
            this.$refs[val].resetFields()
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
        async getRolesList() {
            const res = await api.getRolesList({})
            this.roleList = res
        },
        async getDeptList() {
            const res = await api.getDeptList({})
            this.deptList = res
        },
        dialogSubmit(val) {
            let action = val
            this.$refs['leaveModel'].validate( async (valid) => {
                // console.log(valid)
                if(valid) {
                    let params = {
                        ...this.leaveModel,
                        action:action
                    }
                    try {
                        const res = await api.operateApprove(params)
                        alert("操作成功")
                        this.closeDialogProcess()
                        this.getLeavesList()

                        //以下为更新消息数量
                        let count = await api.getLeaveCount({})
                        this.$store.dispatch("getCount",count)
                    } catch (error) {
                        alert(`操作失败，${error}`)
                    }

                }
            })
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