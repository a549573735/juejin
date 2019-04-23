exports.filterText = function (title) {
    const regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
    var nickname_filter="";
    if(regStr.test(title)){
        nickname_filter = title.replace(regStr,"");
        nickname_filter = removeBlank(nickname_filter);
        return nickname_filter;
    }
    return title;
}

function removeBlank(str){
    str = str.trim();
    var ret = "";
    for(var i = 0; i < str.length; i++){
        if(str[i] != ''){
            ret+=str[i];
        }
    }
    return ret;
}