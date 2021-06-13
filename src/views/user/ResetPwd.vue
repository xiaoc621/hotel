!<!--  -->
<template>
  <div style="width:500px">
    <el-form
      siz="mini"
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
      class="demo-ruleForm"
    >
      <el-form-item label="原始密码" prop="oldLoginPwd">
        <el-input
          type="password"
          v-model="ruleForm.oldLoginPwd"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="最新密码" prop="newLoginPwd">
        <el-input
          type="password"
          v-model="ruleForm.newLoginPwd"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="loginPwd2">
        <el-input
          type="password"
          v-model="ruleForm.loginPwd2"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item class="dq">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >修改</el-button
        >
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { strToMd5 } from "../../utli/md5";
export default {
  data() {
    // 验证原始密码
    var validateOldLoginPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入原始密码"));
      } else {
        callback();
      }
    };
    // 验证最新密码
    var validateNewLoginPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入最新密码"));
      } else {
        callback();
      }
    };
    // 验证确认密码
    var validateLoginPwd2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入原始密码"));
      } else if (value !== this.ruleForm.newLoginPwd) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        // 管理员编号
        id:this.$store.state.admin.admin.id,
        // 原始密码
        oldLoginPwd: "",
        // 密码
        newLoginPwd: "",
        // 确认密码
        loginPwd2: ""
      },
      rules: {
        // 验证原始密码
        oldLoginPwd: [{ validator: validateOldLoginPwd, trigger: "blur" }],
        // 验证最新密码
        newLoginPwd: [{ validator: validateNewLoginPwd, trigger: "blur" }],
        // 确认密码
        loginPwd2: [{ validator: validateLoginPwd2, trigger: "blur" }]
      }
    };
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
            this.ruleForm.oldLoginPwd = strToMd5(this.ruleForm.oldLoginPwd);
            this.ruleForm.newLoginPwd = strToMd5(this.ruleForm.newLoginPwd);
            // 执行添加功能
            let { success, message } = await this.$post(
              "/Admin/ResetPwd",
              this.ruleForm
            );
            // 判断是否添加成功
            if (success) {
              this.$msg_s(message);
              this.resetForm("ruleForm");
            } else {
              this.$msg_e(message);
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
        // 管理员标编号
        id:this.$store.state.admin.admin.id,
        // 原始密码
         oldLoginPwd: "",
        // 密码
        newLoginPwd: "",
        // 确认密码
        loginPwd2: ""
      };
    }
  }
};
</script>
<style scoped>
/* @import url(); 引入css类 */
</style>