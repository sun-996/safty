<template>
  <section class="todoapp">

    <!-- header -->
    <header class="header">
      <div class="new-todo">工作提醒</div>
    </header>

    <!-- main section -->
    <section class="main">
      <el-tabs v-model="activeName" stretch>
        <el-tab-pane label="注册审核" name="注册审核">
          <ul v-if="hasAudit" class="todo-list">
            <todo
              v-for="(todo, index) in auditTodo"
              :key="index"
              :todo="todo"
              type="audit"
              @click="handleAuditTodo"
            />
          </ul>
          <span v-else class="noTodo">暂无提醒</span>

        </el-tab-pane>
        <el-tab-pane label="未提交报表" name="未提交报表">
          <ul v-if="hasReport" class="todo-list">
            <todo
              v-for="(todo, index) in reportTodo"
              :key="index"
              :todo="todo"
              type="report"
              @click="handleReportTodo"
            />
          </ul>
          <span v-else class="noTodo">暂无未提交报表</span>
        </el-tab-pane>
      </el-tabs>
    </section>

    <!-- footer -->
    <footer class="footer">
      <el-pagination
        v-if="activeName==='注册审核'"
        hide-on-single-page
        class="page"
        small
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page.sync="cpage"
        :total="auditTodoData.length"
      />
    </footer>

    <el-dialog
      title="处理"
      :visible.sync="formDialog"
      :width="GLOBAL.DIALOG_WIDTH.MINI"
      append-to-body
      :close-on-click-modal="false"
      @closed="handleDialogClosed('form')"
    >

      <el-form
        ref="form"
        size="mini"
        :model="form"
        :label-width="GLOBAL.FORM_LABEL_WIDTH.MINI"
        :rules="formRules"
      >
        <el-form-item label="是否通过" prop="audit">
          <el-radio-group v-model="form.audit">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="0">未通过</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formDialog=false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="formSubmit">确定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import Todo from './Todo.vue'
import { getAuditList, auditNopass, auditPass, checkSubmited } from '@/api/workbench/todoList'

export default {
  components: { Todo },
  data() {
    return {
      activeName: '注册审核',
      auditTodoData: [],
      pageSize: 5,
      cpage: 1,
      hasAudit: false,
      reportTodo: [],
      hasReport: false,
      btnLoading: false,
      taskId: null,
      form: {
        audit: ''
      },
      formRules: {
        audit: [
          { required: true, message: '请选择是否通过', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    auditTodo() {
      // 数据分页
      const start = (this.cpage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.auditTodoData.slice(start, end)
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      // 获取待审核的注册用户
      getAuditList({}).then(res => {
        this.auditTodoData = res.data.obj.list
        this.hasAudit = (this.auditTodoData && this.auditTodoData.length > 0)
        console.log(this.auditTodoData)
      })

      // 获取未提交的报表
      checkSubmited({}).then(res => {
        this.reportTodo = res.data.obj

        // 是否有未提交的报表
        this.hasReport = !this.reportTodo.every(item => {
          return item.value
        })
        console.log(this.hasReport)
      })
    },
    // 处理待审核账号
    handleAuditTodo(todo) {
      this.formDialog = true
      this.taskId = todo.taskId
    },
    // 处理未提交报表
    handleReportTodo(todo) {
      const name = todo.label
      let url = ''
      if (name === 'yhqkb') {
        url = `/reportStatistics/monthView/${'隐患情况报表'}`
      } else if (name === 'yhzgqkb') {
        url = `/reportStatistics/monthView/${'隐患整改情况报表'}`
      } else if (name === 'aqsczhb') {
        const type = todo.type
        if (type === 'yue') {
          url = `/reportStatistics/monthView/${'安全生产综合表'}`
        } else {
          url = '/reportStatistics/halfMonthView'
        }
      }
      this.$router.push(url)
    },

    // 处理注册审核
    formSubmit() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          this.btnLoading = true
          const taskId = this.taskId
          if (this.form.audit == 0) {
            // 未通过
            await auditNopass(taskId)
          } else if (this.form.audit == 1) {
            // 通过
            await auditPass(taskId)
          }
          this.btnLoading = false
          this.formDialog = false
          this.fetchList()
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import './index.scss';
</style>
