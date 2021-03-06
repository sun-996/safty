<template>
  <div class="app-container">
    <div class="panel">
      <div class="panel-title">
        <breadcrumb class="breadcrumb-container" />
      </div>
      <div class="panel-main">
        <el-form ref="roleForm" inline :model="roleForm" :rules="roleRules">
          <el-form-item prop="roleKey">
            <el-input v-model="roleForm.roleKey" placeholder="请输入角色英文名称">
              <template slot="prepend">ROLE_</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="roleName">
            <el-input v-model="roleForm.roleName" placeholder="请输入角色中文名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addRole()">添加角色</el-button>
          </el-form-item>
        </el-form>
        <el-row type="flex" justify="center">
          <el-pagination
            :current-page.sync="cpage"
            :page-sizes="[5, 10, 15, 20]"
            :page-size.sync="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
        <el-row>
          <el-collapse v-loading="collapseLoading" @change="handleChange">
            <el-collapse-item
              v-for="item in roleList"
              :key="item.id"
              :title="item.roleName"
              :name="item.id"
            >
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>可访问的资源</span>
                  <el-button
                    style="float: right; padding: 3px 0; color:red"
                    type="text"
                    icon="el-icon-delete"
                    @click="delRole(item.id)"
                  />
                </div>
                <el-tree
                  :ref="'treeList'+item.id"
                  class="accessibleResources"
                  :data="menuList"
                  :default-expanded-keys="[1]"
                  :default-checked-keys="item.menuIds"
                  show-checkbox
                  node-key="id"
                  :props="defaultProps"
                />
                <div class="footbtn">
                  <el-button @click="editCancel(item.id,item.menuIds)">取消修改</el-button>
                  <el-button type="primary" @click="editSubmit(item.id)">确认修改</el-button>
                </div>
              </el-card>
            </el-collapse-item>
          </el-collapse>
        </el-row>

      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRoleList, addRole, updateRole, deleteRole } from '@/api/systemSetup/roleManagement'
import { getMenuList } from '@/api/systemSetup/menuManagement'
export default {
  data() {
    return {
      collapseLoading: true,
      roleForm: {
        roleKey: '',
        roleName: ''
      },
      roleRules: {
        roleKey: [
          { required: true, message: '请输入角色英文名', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '请输入角色中文名', trigger: 'blur' }
        ]
      },
      cpage: 1,
      pageSize: 5,
      total: null,
      roleList: [],
      menuList: [],
      treeName: [],
      menuIds: [],
      defaultProps: {
        children: 'children',
        label: function(data) {
          return data.meta.title
        }
      }
    }
  },
  computed: {
    ...mapGetters(['permission_routes']),
    treeList() {
      return this.permission_routes.filter(item => {
        return item.meta
      })
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    // 获取角色列表
    fetchRoleList(cpage, pageSize) {
      const params = {}
      params.page = cpage || this.cpage
      params.size = pageSize || this.pageSize
      getRoleList(params)
        .then(res => {
          const pageObj = res.data.obj
          this.total = pageObj.total
          this.roleList = pageObj.list
        }).catch(() => {})
    },
    fetchList() {
      getMenuList().then(res => {
        this.menuList = [...res.data.obj]
        this.fetchRoleList()
        this.collapseLoading = false
      }).catch(() => {})
    },
    // 改变当前页
    handleCurrentChange(cpage) {
      this.fetchRoleList()
    },
    // 改变每页条数
    handleSizeChange(pageSize) {
      this.fetchRoleList()
    },
    // 递归关闭菜单的方法
    closeTree(childNodes) {
      childNodes.forEach(item => {
        item.expanded = false
        if (item.childNodes && item.childNodes.length > 0) {
          this.closeTree(item.childNodes)
        }
      })
    },
    // 收起时自动关闭所有菜单
    handleChange(val) {
      console.log(val)
      let tree
      if (val.length > this.treeName.length) {
        tree = val.filter(item => {
          return !this.treeName.includes(item)
        })
      } else if (this.treeName.length > val.length) {
        tree = this.treeName.filter(item => {
          return !val.includes(item)
        })
      }

      this.treeName = val

      tree[0] && (tree = 'treeList' + tree[0])

      const childNodes = this.$refs[tree][0].store.root.childNodes[0].childNodes
      if (childNodes && childNodes.length > 0) {
        this.closeTree(childNodes)
      }
      // this.fetchList()
    },
    // 添加角色
    addRole() {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          addRole(this.roleForm)
            .then(res => {
              this.fetchList()
              this.roleForm = {
                roleKey: '',
                roleName: ''
              }
            })
        } else {
          return false
        }
      })
    },
    // 删除角色
    delRole(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteRole(id)
            .then(res => {
              this.fetchList()
            })
        })
        .catch(() => {})
    },
    // 取消修改
    editCancel(id, menuIds) {
      const tree = 'treeList' + id
      const keys = (this.menuIds.length > 0 ? this.menuIds : menuIds)
      this.$refs[tree][0].setCheckedKeys(keys)
      // console.log(menuIds)
    },
    // 提交修改
    editSubmit(id) {
      const tree = 'treeList' + id
      const checkedKeys = this.$refs[tree][0].getCheckedKeys()
      updateRole(id, checkedKeys)
        .then(res => {
          this.menuIds = checkedKeys
        })
    }
  }
}
</script>

<style lang="scss">

.footbtn {
  display: flex;
  justify-content: flex-end;
}
</style>
