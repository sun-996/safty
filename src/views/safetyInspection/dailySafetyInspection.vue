<template>
  <div class="app-container">
    <div class="panel">
      <div class="panel-title">
        <breadcrumb class="breadcrumb-container" />
      </div>
      <el-row type="flex" justify="space-between" align="top">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addDailyForm">新增</el-button>
        <div>
          <el-autocomplete
            v-model="searchTemp"
            size="small"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            style="width:180px;margin-right:10px"
            :trigger-on-focus="false"
            @select="handleSelect"
          />

          <el-button type="primary" icon="el-icon-search" size="small" @click="onSearch">查询</el-button>
        </div>
      </el-row>
      <el-row>
        <el-col>
          <el-table
            ref="table"
            v-loading="tableDataLoading"
            border
            :data="tableData"
            :span-method="objectSpanMethod"
            size="small"
            stripe
          >
            <!-- 详情展示 -->
            <el-table-column prop="enterpriseName" label="企业名称" width="250" />
            <el-table-column prop="projectName" label="项目名称" />
            <el-table-column prop="checkAddress" label="检查地点" />
            <el-table-column prop="checkTime" label="检查时间" />
            <el-table-column prop="inspectors" label="检查人员" />
            <el-table-column prop="leaders" label="领导参与情况" />
            <el-table-column prop="dangerQuantity" label="隐患数量" :width="GLOBAL.TABLE_CELL_WIDTH.MINI" />
            <el-table-column prop="participants" label="参与人数" :width="GLOBAL.TABLE_CELL_WIDTH.MINI" />
            <el-table-column label="照片" :width="GLOBAL.TABLE_CELL_WIDTH.MINI">
              <template slot-scope="scope">
                <el-button-group class="operate">
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-search"
                    title="查看"
                    @click="viewPics(scope.row.attachmentFiles)"
                  />
                </el-button-group>
              </template>
            </el-table-column>
            <el-table-column label="操作" :width="GLOBAL.TABLE_CELL_WIDTH.SMALL">
              <template slot-scope="scope">
                <el-button-group class="operate">
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-edit"
                    title="编辑"
                    @click="editItem(scope)"
                  />
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-delete"
                    title="删除"
                    @click="delItem(scope)"
                  />
                </el-button-group>
              </template>
            </el-table-column>
            <el-table-column label="历史修改" :width="GLOBAL.TABLE_CELL_WIDTH.MINI">
              <template slot-scope="scope">
                <el-button-group class="operate">
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-view"
                    title="历史"
                    @click="history(scope)"
                  />
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!-- 分页栏 -->

      <el-row ref="page">
        <!-- 分页栏 -->
        <el-pagination
          :current-page.sync="cpage"
          :page-sizes="[5, 10, 15, 20]"
          :page-size.sync="pageSize"
          layout="sizes, prev, pager, next"
          :total="total"
          @size-change="handlePageSizeChange"
          @current-change="handleCpageChange"
        />
      </el-row>

      <!-- 弹出添加窗口 -->

      <!-- 日常检查登记表 -->
      <el-dialog
        title="日常检查登记表"
        :visible.sync="dailyFormDialog"
        :width="GLOBAL.DIALOG_WIDTH.MEDIUM"
        :close-on-click-modal="false"
        @closed="handleDialogClosed('dailyForm')"
      >
        <el-form
          id="addData"
          ref="dailyForm"
          size="small"
          :model="dailyForm"
          :rules="dailyFormRules"
          :label-width="GLOBAL.FORM_LABEL_WIDTH.MEDIUM"
        >
          <table border="1" class="formTable">
            <tr>
              <td>
                <el-form-item label="项目名称" prop="projectId">
                  <sun-select v-model="dailyForm.projectId" :options="projectOptions" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="检查地点" prop="checkAddress">
                  <el-input v-model="dailyForm.checkAddress" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="检查时间" prop="checkTime">
                  <el-date-picker
                    v-model="dailyForm.checkTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="检查人员" prop="inspectors">
                  <el-input v-model="dailyForm.inspectors" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="领导参与情况" prop="hasLeader">
                  <el-radio-group v-model="dailyForm.hasLeader">
                    <el-radio :label="true">参与</el-radio>
                    <el-radio :label="false">未参与</el-radio>
                  </el-radio-group>
                </el-form-item>
              </td>
            </tr>
            <tr v-show="dailyForm.hasLeader">
              <td>
                <el-form-item
                  label="参与领导"
                  prop="leaders"
                  :rules="dailyForm.hasLeader ? { required: true, message: '请输入参与领导', trigger: 'blur' } : {}"
                >
                  <el-input v-model="dailyForm.leaders" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="参与人数" prop="participants">
                  <el-input-number v-model="dailyForm.participants" :min="0" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="隐患数量" prop="dangerQuantity">
                  <el-input-number v-model="dailyForm.dangerQuantity" :disabled="true" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="文件" prop="attachmentFiles">
                  <sun-upload
                    ref="UPLOAD"
                    :data="GLOBAL.FILE_TYPE.OTHER"
                    :action="GLOBAL.FILE_API"
                    :file-list.sync="dailyForm.attachmentFiles"
                    :multiple="true"
                    :btn-loading.sync="btnLoading"
                  />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>

                <el-button @click="handleResetForm('dailyForm')">重置</el-button>
                <el-button type="primary" :loading="btnLoading" @click="dailyFormSubmit">{{ handle }}</el-button>
                <p v-if="handle==='添加'" style="margin-bottom:0;color:#f56c6c">如有隐患，请选择主要隐患</p>

              </td>
            </tr>
          </table>
        </el-form>
        <template v-if="handle==='添加'">
          <el-divider />
          <el-button type="primary" size="small" @click="addDangerForm">添加隐患登记</el-button>
          <el-table :data="dailyForm.hiddenDangers" style="width: 100%" empty-text="暂无隐患">
            <el-table-column label="主要隐患" align="center">
              <template slot="header" slot-scope="scope">
                <span class="header-label">{{ scope.column.label }}</span>
              </template>
              <template scope="scope">
                <el-radio
                  v-model="isMain"
                  :label="scope.$index"
                >&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="zh-realm" label="排查领域" align="center">
              <template slot="header" slot-scope="scope">
                <span class="header-label">{{ scope.column.label }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="model" label="整改方式" align="center">
              <template slot="header" slot-scope="scope">
                <span class="header-label">{{ scope.column.label }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="part" label="隐患部位" align="center">
              <template slot="header" slot-scope="scope">
                <span class="header-label">{{ scope.column.label }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="隐患内容" align="center">
              <template slot="header" slot-scope="scope">
                <span class="header-label">{{ scope.column.label }}</span>
              </template>
            </el-table-column>
            <el-table-column label="隐患照片" prop="checkAddress" align="center">
              <template slot="header" slot-scope="scope">
                <span class="header-label">{{ scope.column.label }}</span>
              </template>
              <template slot-scope="scope">
                <el-button-group class="operate">
                  <el-button type="text" size="mini" icon="el-icon-search" @click="viewPics(scope.row.files)" />
                </el-button-group>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot="header" slot-scope="scope">
                <span class="header-label">{{ scope.column.label }}</span>
              </template>
              <template slot-scope="scope">
                <el-button-group class="operate">
                  <el-button type="text" size="mini" icon="el-icon-delete" @click="delDangerItem(scope)" />
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </template>

      </el-dialog>
      <!-- 内层弹窗 -->

      <!-- 隐患登记表 -->
      <el-dialog
        title="隐患登记表"
        :visible.sync="dangerFormDialog"
        width="50%"
        append-to-body
        :close-on-click-modal="false"
        @closed="handleDialogClosed('dangerForm')"
      >
        <el-form
          ref="dangerForm"
          size="small"
          :model="dangerForm"
          :label-width="GLOBAL.FORM_LABEL_WIDTH.MEDIUM"
          :rules="dangerFormRules"
        >
          <table border="1" class="formTable">
            <tr>
              <td>
                <el-form-item label="排查领域" prop="realm">
                  <sun-select v-model="dangerForm.realm" :module="'排查领域'" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="隐患等级" prop="level">
                  <sun-select v-model="dangerForm.level" :module="'隐患等级'" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="整改方式" prop="model">
                  <el-radio-group v-model="dangerForm.model">
                    <el-radio label="立即整改" />
                    <el-radio label="限期整改" />
                  </el-radio-group>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="隐患部位" prop="part">
                  <el-input v-model="dangerForm.part" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="隐患内容" prop="content">
                  <el-input
                    v-model="dangerForm.content"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="备注" prop="remark">
                  <el-input
                    v-model="dangerForm.remark"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="隐患照片" prop="files">
                  <sun-upload
                    ref="UPLOAD"
                    :data="GLOBAL.FILE_TYPE.OTHER"
                    :action="GLOBAL.FILE_API"
                    :file-list.sync="dangerForm.files"
                    :multiple="true"
                    :btn-loading.sync="btnLoading"
                  />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>

                <el-button @click="handleResetForm('dangerForm')">重置</el-button>
                <el-button type="primary" :loading="btnLoading" @click="onSave">保存</el-button>

              </td>
            </tr>
          </table>

        </el-form>
      </el-dialog>
    </div>

    <!-- 用于预览上传多张图片的dialog -->
    <pic-dialog :visible.sync="sunViewPics" :pic-list="sunPicList" />

    <!-- 用于查看历史记录的dialog -->

    <el-dialog
      title="历史记录"
      :visible.sync="historyDialog"
      :close-on-click-modal="false"
      :width="GLOBAL.DIALOG_WIDTH.BIG"
    >
      <el-table ref="table" border :data="historyTable" size="small" stripe>

        <!-- 历史记录详情展示 -->
        <el-table-column prop="enterpriseName" label="企业名称" width="250" />
        <el-table-column prop="checkAddress" label="检查地点" />
        <el-table-column prop="checkTime" label="检查时间" />
        <el-table-column prop="inspectors" label="检查人员" />
        <el-table-column prop="leaders" label="领导参与情况" />
        <el-table-column prop="dangerQuantity" label="隐患数量" :width="GLOBAL.TABLE_CELL_WIDTH.MINI" />
        <el-table-column prop="participants" label="参与人数" :width="GLOBAL.TABLE_CELL_WIDTH.MINI" />

        <el-table-column label="照片" :width="GLOBAL.TABLE_CELL_WIDTH.MINI">
          <template slot-scope="scope">
            <el-button-group class="operate">
              <el-button
                type="text"
                size="mini"
                icon="el-icon-search"
                @click="viewPics(scope.row.attachmentFiles)"
              />
            </el-button-group>
          </template>
        </el-table-column>

        <el-table-column prop="operatorName" label="操作人" :width="GLOBAL.TABLE_CELL_WIDTH.SMALL" />
        <el-table-column prop="updateTime" label="操作时间" :width="GLOBAL.TABLE_CELL_WIDTH.SMALL" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { zhClassify } from '@/utils'
import {
  getSafetyCheckList,
  addSafetyCheck,
  updateSafetyCheck,
  deleteSafetyCheck,
  historySafetyCheck
} from '@/api/safetyInspection/dailySafetyInspection' // 日常安全检查API
import {
  getProjectsList
} from '@/api/config' // 获取项目列表API

export default {
  data() {
    return {
      tableDataLoading: true,
      // 日常检查登记表
      dailyForm: {
        projectId: null,
        checkAddress: '',
        checkTime: '',
        inspectors: '',
        hasLeader: '',
        leaders: '',
        participants: 0, // 参与人数
        dangerQuantity: 0,
        attachmentFiles: [],
        hiddenDangers: []
      },
      // 日常检查登记表验证规则
      dailyFormRules: {
        projectId: [
          { required: true, message: '请选择项目名称', trigger: 'change' }
        ],
        checkAddress: [
          { required: true, message: '请输入检查地址', trigger: 'blur' }
        ],
        checkTime: [
          { required: true, message: '请选择检查时间', trigger: 'change' }
        ],
        inspectors: [
          { required: true, message: '请输入检查人员', trigger: 'blur' }
        ],
        hasLeader: [
          { required: true, message: '请选择领导参与情况', trigger: 'change' }
        ],
        participants: [
          { required: true, message: '请输入参与人数', trigger: 'change' }
        ],
        attachmentFiles: [{ required: true, message: '请上传文件', trigger: 'change' }]
      },
      projectOptions: [],
      // 隐患登记表
      dangerForm: {
        realm: '', // 排查领域
        level: '', // 隐患等级
        part: '', // 隐患部位
        model: '', // 整改方式
        isMain: '', // 是否是主要隐患
        content: '', // 隐患内容
        remark: '', // 备注
        files: []
      },
      // 隐患登记表验证规则
      dangerFormRules: {
        realm: [
          { required: true, message: '请输入排查领域', trigger: 'change' }
        ],
        level: [
          { required: true, message: '请选择隐患等级', trigger: 'change' }
        ],
        part: [
          { required: true, message: '请输入隐患部位', trigger: 'blur' }
        ],
        model: [
          { required: true, message: '请选择整改方式', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入隐患内容', trigger: 'blur' }
        ],
        files: [{ required: true, message: '请上传文件', trigger: 'change' }]
      },
      dailyFormDialog: false, // 日常检查登记表弹出框标志
      dangerFormDialog: false, // 隐患登记表弹出框标志
      dailyTable: [],
      hiddenDangers: [],
      isMain: null,
      cpage: 1,
      pageSize: 5,
      total: 0,
      historyDialog: false,
      historyTable: [], // 历史记录
      btnLoading: false
    }
  },
  computed: {
    tableData() {
      const search = this.search
      return this.fuzzySearch(this.dailyTable, search, 'projectName')
    },
    queryList() {
      return this.dailyTable.map(data => {
        return { value: data.projectName }
      })
    }
  },

  created() {
    this.fetchSafetyCheckList()
    getProjectsList().then(res => {
      const data = res.data.obj
      this.projectOptions = data.map(item => {
        return {
          label: item.projectName,
          value: item.id
        }
      })
      console.log(this.projectOptions)
    })
  },
  methods: {
    // 动态分页查询 [日常安全检查] 列表
    fetchSafetyCheckList(cpage, pageSize) {
      const params = {}
      params.page = cpage || this.cpage
      params.size = pageSize || this.pageSize
      getSafetyCheckList(params)
        .then(res => {
          const pageObj = res.data.obj
          this.total = pageObj.total
          const list = pageObj.list
          this.dailyTable = list
          this.tableDataLoading = false
        }).catch(() => {})
    },
    // 重置表单
    handleResetForm(formName) {
      this.resetForm(this, formName)
    },
    // 添加日常登记表按钮
    addDailyForm() {
      this.dailyFormDialog = true
      this.handle = '添加'
      this.$nextTick(() => {
        // 默认表格为空
        this.dailyForm.hiddenDangers = []
        // 默认为第一个选中
        this.dailyForm.radio = 0
      })
    },
    // 提交日常登记表
    dailyFormSubmit() {
      this.$refs.dailyForm.validate(valid => {
        if (valid) {
          const params = this.depClone(this.dailyForm)
          // 改造文件
          params.fileIds = params.attachmentFiles.map(item => {
            return item.fileId
          })

          // 领导参与情况
          if (params.hasLeader === false) {
            params.leaders = '未参与'
          }

          // 有隐患的情况
          if (this.dailyForm.hiddenDangers && this.dailyForm.hiddenDangers.length > 0) {
            if (this.isMain !== 0 && !this.isMain) {
              console.log(this.isMain)
              this.$message.error('请选择主要隐患')
              return false
            } else {
              // console.log(params)
              // 改造参数
              params.hiddenDangers = params.hiddenDangers.map((item, index) => {
                // 改造主要隐患
                if (this.isMain === index) {
                  item.isMain = '是'
                } else {
                  item.isMain = '否'
                }
                // 改造文件id列表
                item.attachmentFileIds = item.files.map(file => {
                  return file.fileId
                })
                return item
              })
            }
          }
          this.btnLoading = true
          if (this.handle === '添加') {
            console.log(params)
            addSafetyCheck(params).then(res => {
              this.btnLoading = false
              this.dailyFormDialog = false
              this.fetchSafetyCheckList()
            })
          } else if (this.handle === '修改') {
            updateSafetyCheck(params.id, params).then(res => {
              this.btnLoading = false
              this.dailyFormDialog = false
              this.fetchSafetyCheckList()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加隐患表按钮
    addDangerForm() {
      this.dangerFormDialog = true
    },
    // 保存隐患登记表
    onSave() {
      this.$refs.dangerForm.validate(valid => {
        if (valid) {
          this.dailyForm.hiddenDangers.push(this.depClone(this.dangerForm))
          zhClassify(this.dailyForm.hiddenDangers, [['排查领域', 'realm']])
          console.log(this.dailyForm)
          // 隐患数量自增
          this.dailyForm.dangerQuantity++
          this.$refs.dangerForm.resetFields()
          this.dangerFormDialog = false
          console.log(this.dangerForm)
        } else {
          return false
        }
      })
    },
    // 删除隐患登记
    delDangerItem(scope) {
      const index = scope.$index
      if (this.isMain !== 0 && !this.isMain) {

      } else {
        if (this.isMain === index) {
          this.isMain = null
        } else if (this.isMain > index) {
          this.isMain--
        }
      }
      this.dailyForm.hiddenDangers.splice(index, 1)
      this.dailyForm.dangerQuantity--
    },
    handlePageSizeChange(val) {
      this.fetchSafetyCheckList()
    },
    handleCpageChange(val) {
      this.fetchSafetyCheckList()
    },

    // 编辑单行表格
    editItem(scope) {
      this.dailyFormDialog = true
      this.handle = '修改'
      this.$nextTick(() => {
        this.dailyForm = { ...scope.row }
      })

      console.log(scope)
    },
    // 删除
    delItem(scope) {
      this.handleCofirm('你确定要删除么？', 'warning').then(() => {
        deleteSafetyCheck(scope.row.id).then(res => {
          this.fetchSafetyCheckList()
        })
      })
    },
    // 查看历史修改
    history(scope) {
      historySafetyCheck(scope.row.id).then((res) => {
        this.historyTable = res.data.obj
        this.historyTable = this.historyTable.map((item) => {
          // 改造
          item.updateTime = this.parseTime(item.updateTime, '{y}-{m}-{d}')
          return item
        })
        this.historyDialog = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
//嵌套表单输入框的表格
.formTable{
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ebeef5;
  tr{
      &:nth-child(even){
        background-color: #fafafa;
      }
      &:last-of-type{
        background-color: #fff;
        td{
          padding-right: 0;
          text-align: center
        }
        .el-button{
          padding-left: 60px;
          padding-right: 60px;
        }
      }
    td{
      padding: 10px 0;
      padding-right: 20%;
      vertical-align: middle;
      /deep/ .el-form-item--mini.el-form-item,.el-form-item--small.el-form-item{
        margin-bottom: 0 ;
      }
      /deep/ .el-upload--picture-card{
          line-height: normal;
        i{
          font-size: 67px;
          color: #c0c4cc;
          margin: 40px 0 16px;
          line-height: 50px;
        }
        .el-upload__text{
          color: #606266;
          font-size: 14px;
          text-align: center;
          line-height: normal;
        }

      }
    }
  }
}

.header-label{
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 9px 0;
    width: 88px;
    text-align: center;
    border-radius: 3px;
}

</style>
