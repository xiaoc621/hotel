!<!--  -->
<template>
  <div>
    <div class="search">
      <label style="color:#666;font-size:12px">角色：</label>
      <el-select size="mini" v-model="roleId" placeholder="请选择角色" clearable style="margin-right:15px">
        <el-option
          v-for="item in roleListToSearch"
          :key="item.roleId"
          :label="item.roleName"
          :value="item.roleId"
        >
        </el-option>
      </el-select>
      <el-button type="success" size="mini" @click="searchClick">查询</el-button>
      <el-button type="primary" size="mini" @click="addClick">添加</el-button>
    </div>
    <el-table :data="tableData" style="width: 99%" size="mini">
      <el-table-column label="编号" width="180">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="账号" width="180">
        <template slot-scope="scope">
          {{ scope.row.loginId }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="180">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="电话" width="180">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="头像" width="180">
        <template slot-scope="scope">
          <el-image
            style="width: 60px; height: 60px"
            :src="BASE_URL_AdminImg + (scope.row.photo || 'admin_default.jpg')"
            fit="cover"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="180">
        <template slot-scope="scope">
          {{ scope.row.role.roleName }}
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
    <!-- 分页 -->
    <div class="flex j-c" style="margin-top:17px">
      <el-pagination
        background
        layout="prev, pager, next"
        :tatol="count"
        :page-size="5"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
    <!-- 分页 -->
    <el-drawer
      :title="isAdd ? '添加账号' : '修改账号'"
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
          <el-form-item label="头像" prop="photo">
            <el-upload
              class="avatar-uploader"
              :action="Upload_AdminImg_URL"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="ruleForm.photo"
                :src="BASE_URL_AdminImg + ruleForm.photo"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="账号" prop="loginId">
            <el-input v-model="ruleForm.loginId" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item v-if="isAdd" label="密码" prop="loginPwd">
            <el-input
              type="password"
              v-model="ruleForm.loginPwd"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="isAdd" label="确认密码" prop="loginPwd2">
            <el-input
              type="password"
              v-model="ruleForm.loginPwd2"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="ruleForm.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <el-select
              v-model="ruleForm.roleId"
              placeholder="请选择角色"
              clearable=""
            >
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              >
              </el-option>
            </el-select>
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
// 导入头像管理根路径和头像上传根路径
import { BASE_URL_AdminImg, Upload_AdminImg_URL } from "../../config/index";
import { strToMd5 } from "../../utli/md5";
export default {
  data() {
    // 验证账号信息
    var validateLoginId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号信息"));
      } else {
        callback();
      }
    };
    // 验证密码
    var validateLoginPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    // 验证确认密码
    var validateLoginPwd2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认密码"));
      } else if (value !== this.ruleForm.loginPwd) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    // 验证姓名
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入姓名"));
      } else {
        callback();
      }
    };
    // 验证电话
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入电话"));
      } else {
        callback();
      }
    };
    // 验证角色
    var validateRoleId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择角色"));
      } else {
        callback();
      }
    };
    return {
      BASE_URL_AdminImg,
      Upload_AdminImg_URL,
      tableData: [],
      count: 0,
      roleId: "",
      roleListToSearch:[],
      pageIndex: 1,
      roleList: [],
      drawer: false,
      isAdd: true,
      ruleForm: {
        //账号:xioac
        loginId: "",
        // 密码:iigcpl
        loginPwd: "",
        // 确认密码
        loginPwd2: "",
        // 姓名
        name: "",
        // 电话
        phone: "",
        // 角色编号
        roleId: "",
        // 头像
        photo: ""
      },
      rules: {
        // 验证账号
        loginId: [{ validator: validateLoginId, trigger: "blur" }],
        // 验证密码
        loginPwd: [{ validator: validateLoginPwd, trigger: "blur" }],
        loginPwd2: [{ validator: validateLoginPwd2, trigger: "blur" }],
        name: [{ validator: validateName, trigger: "blur" }],
        phone: [{ validator: validatePhone, trigger: "blur" }],
        roleId: [{ validator: validateRoleId, trigger: "change" }]
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
      const loginId = row.loginId;
      // 根据角色编号获取对象
      let res = await this.$get("/Admin/GetOne", { loginId });
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
      const id = row.id;
      // 获取头像照片名称
      const photo = row.photo;
      // 删除对应账号信息
      let { success, message } = await this.$post("Admin/Delete", {
        id,
        photo
      });
      if (success) {
        this.$msg_s(message);
        this.getTableData();
      } else {
        this.$msg_e(message);
      }
    },
    async getTableData() {
      let { data, count } = await this.$get("Admin/List", {
        roleId: this.roleId || 0,
        pageIndex: this.pageIndex,
        pageSize: 7
      });
      this.tableData = data;
      this.count = count;
    },
    async getRoleList() {
      let res = await this.$get("Role/List");
      this.roleList = res;
      this.roleListToSearch = res
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
            this.ruleForm.loginPwd = strToMd5(this.ruleForm.loginPwd);
            // 执行添加功能
            let { success, message } = await this.$post(
              "/Admin/Add",
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
              "/Admin/Upload",
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
        // 账号
        loginId: "",
        // 密码
        loginPwd: "",
        // 确认密码
        loginPwd2: "",
        // 姓名
        name: "",
        // 电话
        phone: "",
        // 角色编号
        roleId: "",
        // 头像
        photo: ""
      };
    },
    handleAvatarSuccess(res) {
      let { success, filename } = res;
      if (success) {
        this.ruleForm.photo = filename;
      }
    },
    //  照片上传之前的方法
    beforeAvatarUpload(file) {
      //  定义可以上传的图片格式
      let img_type_list = ["image/jpeg", "image/png", "image/gif"];
      const isJPG = img_type_list.includes(file.type);
      //  限制图片大小
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片可以是 JPG/png/gif 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    currentChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.getTableData();
    },
    searchClick(){
      this.getTableData()
    },
    addClick(){
        this.drawer = true
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
.avatar-uploader {
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader :hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>