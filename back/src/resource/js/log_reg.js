export function test(username, password){
    let result = [];
    if(!/^[一-龥\w]{2,15}$/.test(username)){
        result['code'] = false;
        result['msg'] = '用户名必须是2-15位中英文字符';
        result['position'] = 1;
        return result;
    }
    if(password.length < 6 || password.length > 30){
        result['code'] = false;
        result['msg'] = '密码为6-30位字符';
        result['position'] = 2;
        return result;
    }
    result['code'] = true;
    result['msg'] = '';
    return result;
}
export function bgStyle(){
    window.onresize = function(obj){
        obj.pk = document.body.clientWidth;
        obj.pg = document.body.clientHeight;
    }
}
export function setCookie(key, value, hours){
    if(!hours) hours = 1;
    let timestamp = Date.parse(new Date());
    let date = new Date(timestamp + hours*3600*1000);
    document.cookie = key + "=" + escape(value) + ";expires=" + date.toGMTString();
}