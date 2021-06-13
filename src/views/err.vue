!<!--  -->
<template>
<div>
    <img src="../../public/404/404.jpg" alt="" @click="gotohome">
</div>
</template>

<script>
export default {
data() {
return {

}
},
methods: {
    gotohome(){
        this.$router.push('/layout')
    }
},

}
</script>
<style scoped>
img{
    width: 100%;
}
</style>