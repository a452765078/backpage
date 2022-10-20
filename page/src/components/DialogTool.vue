<template>
      <el-dialog
    v-model="isConfirm"
    title="Tips"
    width="30%"
    :before-close="handleClose"
  >
    <span>确认是否删除</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="confirmStatus = 'cancel'">取消</el-button>
        <el-button type="primary" @click="confirmStatus = 'confirm'"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script>
export default {
    name: 'dialogTool',
    model:{
        prop:['confirmStatus'],
        event: ['change']
    },
    data() {
        return {

        }
    },
    props: {
        isConfirm: {
            type: Boolean,
            default() {
                return false
            }
        },
        confirmStatus: {
            type: String,
            default() {
                return 'cancel'
            }
        }
    },
    methods: {
        confirmStatusUpdate(e,value) {
            this.$emit('change',e.target.value)
        }
    }
}

</script>