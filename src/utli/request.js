import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {BASE_URL} from '../config/index'

 const instance = axios.create({
    baseURL:BASE_URL,
    timeout:20000,
})

let setToken = function () {
    instance.defaults.headers.common['token'] = sessionStorage.getItem(token);
}

let get = async function(url,params) {
    const data = await instance.get(url,{params})
    return data
}

let post = async function(url,params) {
    const data = await instance.post(url,params)
    return data
}

// 3.请求拦截
instance.interceptors.request.use(
    config => {
      NProgress.start()
      return config;
    },
    err => {
        NProgress.done() 
      console.log(err);
    }
  );

  // 4.响应拦截
  instance.interceptors.response.use(
    result => {
      NProgress.done() 
      return result.data;
    },
    err => {
      NProgress.done() 
      console.log(err);
    }
  );

  export {get,post,setToken}