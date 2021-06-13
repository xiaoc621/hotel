!<!--  -->
<template>
  <div>
    <div class="search">
      <el-button type="primary" size="mini" @click="addClick"
        >添加角色</el-button
      >
    </div>
    <el-table :data="tableData" style="width: 99%" size="mini">
      <el-table-column label="角色编号" width="180">
        <template slot-scope="scope">
          {{ scope.row.roleId }}
        </template>
      </el-table-column>
      <el-table-column label="角色名称" width="180">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            >权限设置</el-button
          >
          <el-button
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="warning"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      :title="isAdd?'添加角色':'修改角色'"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="drawerClose"
    >
      <div style="padding:0 10px">
        <el-form
          siz="mini"
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="ruleForm.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item class="dq">
            <el-button type="primary" @click="submitForm('ruleForm')"
              >{{isAdd?'添加角色':'修改角色'}}</el-button
            >
            <el-button @click="resetForm('ruleForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    // 验证角色名称
    var validateRoleName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入角色名称"));
      } else {
        callback();
      }
    };
    return {
      tableData: [],
      drawer: false,
      isAdd:true,
      ruleForm: {
        roleName: "",
      },
      rules: {
        roleName: [{ validator: validateRoleName, trigger: "blur" }]
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 编辑表格数据
    async handleEdit(index, row) {
      const roleId = row.roleId
      // 根据角色编号获取对象
      let res = await this.$get('/Role/GetOne',{roleId})
      this.ruleForm = res
      this.isAdd = false
      this.drawer = true
    },
    // 删除表格数据
    async handleDelete(index, row) {
      // 确定是否删除
      await this.$con_f('是否确定删除？')
      const roleId = row.roleId
      let {success,message} = await this.$post('Role/Delete',{roleId})
       if (success) {
              this.$msg_s(message)
              this.getTableData()
            } else{
              this.$msg_e(message)
            }
    },
    async getTableData() {
      let res = await this.$get("role/list");
      this.tableData = res;
    },
    // 添加抽屉
    addClick() {
      this.drawer = true;
    },
    // 关闭抽屉
    drawerClose(done) {
      // this.ruleForm={
      //   roleName: ""
      // };
      this.resetForm('ruleForm')
      this.isAdd = true;
      done();
    },
     submitForm(formName) {
        this.$refs[formName].validate(async(valid) => {
          if (valid) {
            if (this.isAdd) {
            // 执行添加功能
            let {success,message} = await this.$post('/Role/Add',this.ruleForm) 
            // 判断是否添加成功
            if (success) {
              this.$msg_s(message)
              this.getTableData()
               // 清空表单
              this.resetForm("ruleForm")
            } else{
              this.$msg_e(message)
            }
            }else{

            }
   
          } else {
            return false;
          }
        });
      },
    //   表单重置方法
      resetForm(formName) {
        // 重置表单
        this.$refs[formName].resetFields();
        // 清空表单数据
        this.ruleForm = {
           roleName:"",
      }
    }
  }
};
</script>
<style scoped>
.search {
  padding-bottom: 8px;
}
</style>