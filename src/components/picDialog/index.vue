<template>
  <!-- 用于预览上传多张图片的dialog -->
  <el-dialog
    append-to-body
    :visible.sync="flag"
    class="ViewPics"
    @close="$emit('update:visible', false)"
  >
    <el-row :gutter="20" type="flex" justify="center">
      <el-col
        v-for="(item,index) in picList"
        :key="index"
        :span="8"
      >
        <el-image
          style="width:100%"
          :src="item.url"
        >
          <div slot="error" class="image-error">
            文件加载失败
          </div>
        </el-image>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  name: 'PicDialog',
  props: {
    picList: {
      type: Array,
      required: true
    },
    visible: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      flag: this.visible
    }
  },
  watch: {
    visible(val) {
      this.flag = val
    }
  }

}
</script>

<style lang="scss" scoped>
.ViewPics{
  /deep/ .el-dialog__body{
    text-align: center
  }
}
</style>
