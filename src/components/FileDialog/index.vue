<template>
  <el-dialog
    title="文件列表"
    :visible.sync="fileVisible"
    @close="$emit('update:visible', false)"
  >
    <template v-for="item in fileList">
      <div :key="item.id" class="fileItem">
        <span>{{ item.name }}</span>
        <sun-button
          :type="'view'"
          @click="filePreview(item)"
        />
      </div>
      <el-divider :key="item.id" />
    </template>

  </el-dialog>
</template>

<script>

export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    fileList: {
      type: Array,
      required: true
    }
  },
  computed: {
    fileVisible: {
      get() {
        return this.visible
      },
      set() {

      }

    }
  }

}
</script>

<style lang="scss" scoped>
.fileItem{
  display: flex;
  justify-content: space-between;
  .el-button--mini{
    font-size: 20px;
  }
}
.el-divider--horizontal{
  margin: 10px 0;
}
</style>
