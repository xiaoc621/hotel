!<!--  -->
<template>
<div></div>
</template>

<script>
export default {
data() {
return {

}
},
//生命周期 - 创建完成（访问当前this实例）
async created() {
    // 从浏览器中获取缓存和密码
     let loginId = localStorage.getItem('loginId')
     let loginPwd = localStorage.getItem('loginPwd')
     if(!loginId || !loginPwd){
       this.$router.push('/login')
     }else{
        let {success,token} = await this.$get('./Admin/Login',{loginId,loginPwd})
        if(success){
        sessionStorage.setItem('token',token)
        this.$setToken()
        this.$router.push('/layout')
        }else{
        this.$router.push('/login')
    }

}
    

},
//生命周期 - 挂载完成（访问DOM元素）
mounted() {

}
}
</script>
<style scoped>
/* @import url(); 引入css类 */

</style>