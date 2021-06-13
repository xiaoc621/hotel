import {get,post,setToken} from '../utli/request'
export default{
    install:function(vue) {
        vue.mixin({
            methods: {
                $get(url,params){
                     return get(url,params)
                },
                $post(url,params){
                    return post(url,params)
               },
                $setToken(){
                    setToken
               },
                $msg_s(message,duration=3000){
                this.$message({
                    showClose: true,
                    message,
                    type: 'success',
                    duration
                  });
               },
               $msg_w(message,duration=3000){
                this.$message({
                    showClose: true,
                    message,
                    type: 'warning',
                    duration
                  });
               },
            //错误消息框
               $msg_e(message,duration=3000){
                this.$message({
                    showClose: true,
                    message,
                    type: 'err',
                    duration
                  });
               },
            // 
              $con_f(message){
               return new Promise ((resolve,reject)=>{
                this.$confirm(message)
                .then(res => {
                    resolve()
                })
                .catch(_ => {});
               })
              }
            },
        })
    }
}