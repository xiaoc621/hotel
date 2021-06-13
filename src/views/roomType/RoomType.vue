!<!--  -->
<template>
  <div>
    <div class="search">
      <el-button type="primary" size="mini" @click="addClick"
        >添加客房类型</el-button
      >
    </div>
    <el-table :data="tableData" style="width: 99%" size="mini">
      <el-table-column label="类型编号" width="180">
        <template slot-scope="scope">
          {{ scope.row.roomTypeId }}
        </template>
      </el-table-column>
      <el-table-column label="类型名称" width="180">
        <template slot-scope="scope">
          {{ scope.row.roomTypeName }}
        </template>
      </el-table-column>
      <el-table-column label="床位数" width="180">
        <template slot-scope="scope">
          {{ scope.row.bedNum }}
        </template>
      </el-table-column>
      <el-table-column label="价格" width="180">
        <template slot-scope="scope">
          {{ scope.row.roomTypePrice }}
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
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
      :title="isAdd ? '添加客房类型' : '修改客房类型'"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="drawerClose"
      size="45%"
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
          <el-form-item label="类型名称" prop="roomTypeName">
            <el-input
              v-model="ruleForm.roomTypeName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="床位数" prop="bedNum">
            <el-input
              v-model.number="ruleForm.bedNum"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="roomTypePrice">
            <el-input
              v-model.number="ruleForm.roomTypePrice"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="typeDescription">
            <quill-editor
              v-model="ruleForm.typeDescription"
              ref="myQuillEditor" style="height:200px; margin-bottom:120px"
            >
            </quill-editor>
          </el-form-item>
          <el-form-item class="dq">
            <el-button type="primary" @click="submitForm('ruleForm')">{{
              isAdd ? "添加" : "修改"
            }}</el-button>
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
    // 验证客房类型
    var validateRoomTypeName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入客房类型名称"));
      } else {
        callback();
      }
    };
    // 验证床位数
    var validateBedNum = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入床位数"));
      } else if (!Number.isInteger(value)) {
        callback(new Error("请输入数字值"));
      } else {
        callback();
      }
    };
    // 验证价格
    var validateRoomTypePrice = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认价格"));
      } else if (!Number.isInteger(value)) {
        callback(new Error("请输入数字值"));
      } else {
        callback();
      }
    };
    return {
      tableData: [],
      count: 0,
      roleId: "",
      roleListToSearch: [],
      pageIndex: 1,
      roleList: [],
      drawer: false,
      isAdd: true,
      ruleForm: {
        roomTypeName: "",
        bedNum: "",
        roomTypePrice: "",
        typeDescription: ""
      },
      // 表单的验证数据
      rules: {
        // 验证类型名称
        roomTypeName: [{ validator: validateRoomTypeName, trigger: "blur" }],
        // 验证床位数
        bedNum: [{ validator: validateBedNum, trigger: "blur" }],
        // 验证价格
        roomTypePrice: [{ validator: validateRoomTypePrice, trigger: "blur" }]
      }
    };
  },
  created() {
    //调用获取表格数据方法
    this.getTableData();
    // 调用获取角色列表方法
    this.getRoleList();
  },
  methods: {
    // 编辑表格数据
    async handleEdit(index, row) {
      const roomTypeId = row.roomTypeId;
      // 根据角色编号获取对象
      let res = await this.$get("/RoomType/GetOne", { roomTypeId });
      this.ruleForm = res;
      // 修改
      this.isAdd = false;
      this.drawer = true;
    },
    // 删除表格数据
    async handleDelete(index, row) {
      // 确定是否删除
      await this.$con_f("是否确定删除？");
      // 获取编号
      const roomTypeId = row.roomTypeId;
      // 删除对应账号信息
      let { success, message } = await this.$post("RoomType/Delete", {
        roomTypeId
      });
      if (success) {
        this.$msg_s(message);
        this.getTableData();
      } else {
        this.$msg_e(message);
      }
    },
    async getTableData() {
      // 获取房间类型信息
      let data = await this.$get("RoomType/List");
      this.tableData = data;
    },
    async getRoleList() {
      let res = await this.$get("Role/List");
      this.roleList = res;
      this.roleListToSearch = res;
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
      this.resetForm("ruleForm");
      this.isAdd = true;
      done();
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.isAdd) {
            // 执行添加功能
            let { success, message } = await this.$post(
              "/roomType/Add",
              this.ruleForm
            );
            // 判断是否添加成功
            if (success) {
              this.$msg_s(message);
              this.getTableData();
              this.resetForm("ruleForm");
            } else {
              this.$msg_e(message);
            }
          } else {
            // 执行添加功能
            let { success, message } = await this.$post(
              "/RoomType/Upload",
              this.ruleForm
            );
            if (success) {
              this.$msg_s(message);
              this.getTableData();
            } else {
              this.$msg_e(message);
            }
          }
        } else {
          return false;
        }
      });
    },
    // 表单重置方法
    resetForm(formName) {
      // 重置表单
      this.$refs[formName].resetFields();
      // 清空表单数据
      this.ruleForm = {
        roomTypeName: "",
        bedNum: "",
        roomTypePrice: ""
      };
    },
    currentChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.getTableData();
    },
    searchClick() {
      this.getTableData();
    },
    addClick() {
      this.drawer = true;
    }
  }
};
</script>
<style scoped>
.search {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 8px;
}
</style>