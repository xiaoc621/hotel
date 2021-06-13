import {get,post} from '../utli/request'

export let list = async function(){
    let res = await get('/Role/List');
    return res
}

export let add = async function(params){
    let res = await get('/Role/Add',params);
    return res
}

export let getOne = async function(params){
    let res = await get('/Role/getOne',params);
    return res
}

export let update = async function(params){
    let res = await get('/Role/Update',params);
    return res
}

export let del = async function(params){
    let res = await get('/Role/delete',params);
    return res
}