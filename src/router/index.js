import Vue from 'vue'
import VueRouter from 'vue-router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    meta:{title:"cc酒店管理系统"},
    component:()=>import('../../src/views/index')
  },
  // 登录页
  {
    path:'/login',
    meta:{title:"登录页"},
    component:()=>import('../../src/views/login')
  },
  // 后台管理页
  {
    path:'/layout',
    meta:{title:"cc酒店管理系统"},
    component:()=>import('../../src/views/layout'),
    children:[
      {
        // 首页
        path:'',
        meta:{title:"首页"},
        component:()=>import('../views/user/Home')
      },
      {
        // 系统消息
        path:'message',
        meta:{title:"系统消息"},
        component:()=>import('../views/user/Message')
      },
      {
        // 电子邮件
        path:'email',
        meta:{title:"电子邮件"},
        component:()=>import('../views/user/Email')
      },
      {
        // 个人中心
        path:'mine',
        meta:{title:"个人中心"},
        component:()=>import('../views/user/Mine')
      },
      {
        // 修改密码
        path:'resetPwd',
        meta:{title:"修改密码"},
        component:()=>import('../views/user/ResetPwd')
      },
      {
        // 角色
        path:'role',
        meta:{title:"角色管理"},
        component:()=>import('../views/role/role')
      },
      {
        // 账号
        path:'admin',
        meta:{title:"账号管理"},
        component:()=>import('../views/admin/admin')
      },
      {
        // 客房类型
        path:'roomType',
        meta:{title:"客房类型管理"},
        component:()=>import('../../src/views/roomType/RoomType')
      },
      {
        // 客房管理
        path:'room',
        meta:{title:"客房管理"},
        component:()=>import('../../src/views/room/room')
      },
      {
        // 顾客管理
        path:'guest',
        meta:{title:"顾客管理"},
        component:()=>import('../../src/views/guest/guest')
      },
      {
        // 权限管理
        path:'permission',
        meta:{title:"权限管理",permission:[1]},
        component:()=>import('../../src/views/permission/permission')
      }
    ]
  },
  {
    path:'*',
    component:()=>import('../../src/views/err')
  }
]
// 创建路由对象
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 显示加载进度条
  NProgress.start();
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }
  // // 表示需要验证权限
  // if(to.meta && to.meta.permission){
  //    if (to.meta.permission.includes(parseInt(localStorage.getItem('roleId')))) {
  //       // 调用next方法，表示路由往下走
  //        next()
  //    }else{
  //       this.$router.push(from.path)
  //    }
  // }else{
  //   // 调用next方法，表示路由往下走
  //   next()
  // }
   next()
})

// 路由后置守卫
router.afterEach((to, from) => {
  // 关闭加载进度条
  NProgress.done() 
  // ...
})
// 导出对象
export default router
