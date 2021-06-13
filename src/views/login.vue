!<!--  -->
<template>
<div class="main">
   <canvas id="particle-canvas" width="1167" height="835"></canvas>
  <div class="content">
  <div class="login">
    <h3>cc酒店管理</h3>
    <el-form siz="mini" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
    <el-form-item label="账号" prop="loginId">
      <el-input v-model="ruleForm.loginId" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="loginPwd">
      <el-input type="password" v-model="ruleForm.loginPwd" autocomplete="off" @keydown.native.enter="loginPwdEnter"></el-input>
    </el-form-item>
    <el-form-item class="jzw" label="">
        <el-checkbox v-model="ruleForm.checkMe">记住我</el-checkbox>
    </el-form-item>
    <el-form-item class="dq">
      <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
    <el-button @click="resetForm('ruleForm')">取消</el-button>
    </el-form-item>
  </el-form>
  </div>
  </div>
   
</div>
</template>

<script>
import {strToMd5} from '../utli/md5'
import {start} from '../assets/js/login'
export default {
    mounted() {
        start()
    },
    data() {
     var validateloginId = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账号'));
        }else{
            callback()
        }
      };
      var validateloginPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }else{
            callback()
        }
      };
      return {
        ruleForm: {
          // 登录名
          loginId: '',
          //   登录密码
          loginPwd: '',
          checkMe:false
        },
        rules: {
          loginId: [{ validator: validateloginId, trigger: 'blur' }],
          loginPwd: [{ validator: validateloginPwd, trigger: 'blur' }]
        }
      };
    },
    methods: {
    //   表单提交
      submitForm(formName) {
        this.$refs[formName].validate(async(valid) => {
          if (valid) {
              this.ruleForm.loginPwd = strToMd5(this.ruleForm.loginPwd)
              let {message,success,token} = await this.$get('./Admin/Login',this.ruleForm)
            //   是否登录成功
              if(success){
                 sessionStorage.setItem('token',token)
                //  在浏览器中保存登录名
                 localStorage.setItem("loginId",this.ruleForm.loginId)
 
                //  判断是否需要记住密码
                 if(this.ruleForm.checkMe){
                     localStorage.setItem("loginId",this.ruleForm.loginPwd)
                 }
                //  将token信息放到请求头中
                 this.$setToken()
                //  跳转到后台页面
                 this.$router.push('/layout')
              }else{
                  this.$msg_e(message);
              }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    //   表单验证
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      loginPwdEnter(){
        this.submitForm('ruleForm')
      }
    }
  }
</script>
<style scoped>
/* @import url(); 引入css类 */
.main{
    width: 100vw;
    height: 100vh;
    position: relative;
}
.content{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.login{
    width:500px;
    border: 1px solid #ccc;
    padding-top: 20px;
    padding-right: 40px;
    border-radius: 8px;
}
.login h3{
    font-size: 30px;
    color: white;
    margin-left: 190px;
    margin-bottom: 20px;
}
#particle-canvas {
  width: 100%;
  height: 100vh;
  background: linear-gradient(to bottom, rgb(10, 10, 50) 0%,rgb(60, 10, 60) 100%);
  vertical-align: middle;
}
.dq{
    margin-left: 110px;
}
.jzw{
    margin: 5px;
}
</style>