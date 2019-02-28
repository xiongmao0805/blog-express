export function getCookie(key){
    if (document.cookie.length > 0){
        let start = document.cookie.indexOf(key + "=");
        if (start != -1){ 
            start = start + key.length + 1; 
            let end = document.cookie.indexOf(";", start);
            if (end == -1) end = document.cookie.length;
            return unescape(document.cookie.substring(start, end));
        } 
    }
    return "";
}
export function formatDate(){
    let date = new Date();
    let d = date.toLocaleDateString();
    let t = date.toLocaleTimeString();
    let s = t.substr(0,2);
    let arr = t.split(':')
    if(s == '上午'){
        t = '0' + t.substr(2);
    }else if(s = '下午'){
        let h = parseInt(arr[0].substr(2,3)) + 12;
        h = h >= 24 ? '00' : String(h); 
        t = h + ':' + arr[1] + ':' + arr[2];
    }
    return d + ' ' + t;
}