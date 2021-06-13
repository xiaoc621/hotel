!<!--  -->
<template>
  <div class="main">
    <div class="left" :style="{backgroundColor:themeColor, width:(!isCollapse?'200px':'auto')}">
      <div class="logo">cc</div>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        :background-color="themeColor"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isCollapse"
        router
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-user"></i>
            <span>账号管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/layout/role" >角色管理</el-menu-item>
            <el-menu-item index="/layout/admin">账号管理</el-menu-item>
          </el-menu-item-group>
          </el-submenu>

          <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-s-home"></i>
            <span>客房管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/layout/roomType">类型管理</el-menu-item>
            <el-menu-item index="/layout/room">客房管理</el-menu-item>
          </el-menu-item-group>
          </el-submenu>

        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-s-custom"></i>
            <span>客户管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/layout/guest">客户管理</el-menu-item>
          </el-menu-item-group>
          </el-submenu>
                  
         <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>权限管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/layout/permission">权限管理</el-menu-item>
          </el-menu-item-group>
          </el-submenu>
      </el-menu>
    </div>
    <div class="right">
      <div class="nav" :style="{backgroundColor:themeColor}">
        <div class="icon" @click="isCollapse=!isCollapse">
            <i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'" ></i>
        </div>
        <el-menu
          :default-active="activeIndex2"
          class="el-menu-demo"
          mode="horizontal"
          :background-color="themeColor"
          text-color="#fff"
          active-text-color="#ffd04b"
          style="min-width:650px"
          router
        >
          <el-menu-item index="/layout"><i class="el-icon-s-home"></i>Home</el-menu-item>
          <el-menu-item index="/layout/message"><i class="el-icon-s-comment"></i>Message</el-menu-item>
          <el-menu-item index="/layout/email"><i class="el-icon-message"></i>Email</el-menu-item>
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-help"></i>Theme</template>
            <el-menu-item @click="changeTheme(item.value)" v-for="(item, index) in theme" :key="index">{{item.name}}</el-menu-item>
            <!-- <el-menu-item index="4-2">灰色主题</el-menu-item>
            <el-menu-item index="4-3">红色主题</el-menu-item>
            <el-menu-item index="4-3">黑色主题</el-menu-item>
            <el-menu-item index="4-3">绿色主题</el-menu-item> -->
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-user-solid"></i>{{admin.name}}</template>
            <el-menu-item index="/layout/mine">个人中心</el-menu-item>
            <el-menu-item index="/layout/resetPwd">修改密码</el-menu-item>
            <el-menu-item @click="eixt">退出系统</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <div class="content">
      <router-view></router-view> 
      </div>
    </div>
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
export default {
  data() {
    return {
        activeIndex2: '1',
        // 主题颜色
        themeColor:localStorage.getItem('theme') || '#101f30',
        // 是否折叠左侧菜单
        isCollapse: false,
        
       
    };
  },
  created() {
      let loginId = localStorage.getItem('loginId')
      if (!loginId ) {
          this.$router.push('/login')
      }
      this.$get('/Admin/GetOne',{loginId}).then((res)=> {
        this.setAdmin(res)
        console.log(res,555)
        // 在浏览器中缓存，保存当前登录用户的角色编号
        // localStorage.setItem('roleId',res.roleId)
      })      
  },
  mounted(){
  },
  computed:{
      ...mapState('theme',['theme']),
      ...mapState('admin',['admin'])
  },
  methods: {
    ...mapMutations('admin',['setAdmin']),
    handleOpen(key, keyPath) {
    },
    handleClose(key, keyPath) {
    },
    changeTheme(color){
       this.themeColor = color
       localStorage.setItem('theme',color)
    },
    // 退出系统
    eixt(){
        sessionStorage.clear()
        localStorage.clear()
        this.$router.push('/login')
    },
   
  }
};
</script>
<style scoped lang="scss">
.main {
  width: 100vw;
  height: 100vh;
  display: flex;
  .left {
    .logo {
      width: 90%;
      color: white;
      font-size: 20px;
      text-align: center;
      padding: 8px 0;
      border: 1px solid #ccc;
      margin: 10px auto;
    }
  }
  .right {
    flex: 1;
    .nav {
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .icon{
          padding-left: 15px;
            i{
              color: white;
              font-size: 30px;
            }
         }
    }
  }
}
</style>