import md5 from 'md5-node'

function strToMd5(str) {
    return md5(md5(str).split('').reverse().join(''))
}
export{
    strToMd5
}