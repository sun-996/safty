<template>
  <div class="app-container">
    <div class="panel">
      <div class="panel-title">
        <breadcrumb class="breadcrumb-container" />
      </div>
      <div class="panel-main">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            v-for="(item,index) in list"
            :key="index"
            :label="item.name"
            :name="item.name"
          >
            <div class="panel-btns">
              <el-row type="flex" justify="space-between">
                <el-col>
                  <el-button
                    :loading="downloadLoading"
                    type="primary"
                    size="mini"
                    icon="el-icon-plus"
                    @click="addItem()"
                  >
                    导出Excel
                  </el-button>
                </el-col>
                <el-col :span="6">
                  <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
                </el-col>
              </el-row>
            </div>
            <el-table :data="item.children" border style="width: 100%">
              <el-table-column prop="name" label="制度名称" />
              <el-table-column prop="type" label="制度类型" />
              <el-table-column prop="company" label="编制单位" />
              <el-table-column prop="date" label="生效日期" />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" @click="editItem(scope)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="delItem(scope)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <el-dialog
          append-to-body
          :title="handle"
          :visible.sync="show"
          :width="GLOBAL.DIALOG_WIDTH.SMALL"
          :close-on-click-modal="false"
        >
          <el-form ref="form" :model="form" :label-width="GLOBAL.FORM_LABEL_WIDTH.SMALL" class="qualification">
            <el-form-item label="制度名称">
              <el-input v-model="form.name" />
            </el-form-item>

            <el-form-item label="制度类型">
              <el-select v-model="form.type" placeholder="请选择资质类别">
                <el-option label="等级一" value="shanghai" />
                <el-option label="等级二" value="beijing" />
              </el-select>
            </el-form-item>

            <el-form-item label="编制单位">
              <el-input v-model="form.company" />
            </el-form-item>

            <el-form-item label="生效日期">
              <el-col :span="11">
                <el-date-picker v-model="form.date" type="date" placeholder="选择日期" />
              </el-col>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="show=false">取 消</el-button>
            <el-button type="primary" @click="submitHandle()">立即{{ handle }}</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        type: '',
        company: '',
        date: ''
      },
      search: '',
      downloadLoading: false,
      show: false,
      handle: '',
      activeName: '',
      list: []
    }
  },
  created() {
    this.getRequest('http://localhost:9528/api/classifiedManagement').then(
      res => {
        this.list = res.data.list
        this.activeName = this.list[0].name
      }
    )
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    editItem(store) {
      this.show = true
      this.handle = '修改'
      const { row } = store
      const { name, type, company, date } = row
      this.form = {
        name,
        type,
        company,
        date
      }
    },
    addItem() {
    },
    delItem(store) {
      this.handleCofirm('确认删除吗？', 'warning')
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    submitHandle() {}
  }
}
</script>
