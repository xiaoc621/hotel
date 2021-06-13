!<!--  -->
<template>
  <div class="flex">
    <div>
      <el-image
        style="width: 200px; height: 220px"
        :src="BASE_URL_AdminImg + admin.photo"
      ></el-image>
    </div>
    <div class="content">
        <p>账号:{{admin.loginId}}</p>
        <p>姓名:{{admin.name}}</p>
        <p>电话:{{admin.phone}}</p>
        <p>角色:{{admin.role.roleName}}</p>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import { BASE_URL_AdminImg} from "../../config/index"
export default {
  data() {
    return {
        BASE_URL_AdminImg,
    };
  },
  computed:{
    ...mapState('admin',['admin'])
  },
  created() {},
  mounted() {
  }
};
</script>
<style scoped lang="scss">
.content{
    margin-left: 10px;
    p{
        line-height: 50px;
    } 
}
</style>