<template>
  <div class="app-container">
    <div class="panel">
      <div class="panel-title">
        <breadcrumb class="breadcrumb-container" />
      </div>
      <release ref="sendMsg" v-model="form" :form-rules="formRules" @send-method="sendMessage">
        <template v-slot:header>
          <el-form-item label="接收人" prop="receiverlist">
            <sun-select v-model="form.receiverlist " :options="mailList" multiple />
          </el-form-item>
        </template>
      </release>

    </div>
  </div>
</template>

<script>

import Release from './components/Release'
import {
  getMailList,
  sendMessages
} from '@/api/messageNotify/message'
export default {
  components: {
    Release
  },
  data() {
    return {
      form: {
        receiverlist: [],
        title: '',
        content: null,
        files: []
      },
      formRules: {
        receiverlist: [
          { required: true, message: '请选择接收人', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入主题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入正文', trigger: 'blur' }
        ]
      },
      mailList: []
    }
  },
  created() {
    // 获取接收人名单
    getMailList().then(res => {
      this.mailList = res.data.obj
    })
  },
  methods: {
    sendMessage(form) {
      const params = this.depClone(form)

      params.replyId = this.GLOBAL.MSG_REPLYID.SEND // 回复id，0代表发送消息，-1代表已读回执消息，其他代表关联的消息id

      if (params.files && params.files.length > 0) {
        params.attachments = params.files.map(item => {
          return item.fileId
        })
      }

      sendMessages(params).then(res => {
        this.$refs.sendMsg.$emit('success')
      })
    }
  }

}
</script>

<style>

</style>
