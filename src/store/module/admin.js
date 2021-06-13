export default{
    namespaced:true,
    state:{
        admin:{
          role:{}
        }
    },
    mutations:{
      setAdmin(state,val){
        state.admin = val
      }
    }
}