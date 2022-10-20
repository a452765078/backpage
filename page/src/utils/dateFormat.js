/* 
1、 format 格式必须以 YYYY(年) MM(月) DD(日) hh(时) mm(分) ss(秒) 自由拼接，
    可自定义连接符，例如：YYYY-MM-DD hh:mm:ss
2、 date 可传入两种格式 (Date格式 、 时间戳格式)
*/
function transDate(format, date) {
    /* 将时间戳转换为 Date 格式 */
    const isNumber = /^[0-9]+.?[0-9]*/.test(date);
    if (isNumber) {
        const dateLength = `${date}`.length;
        // 不足13位补足
        const lessThan = date * Math.pow(10, 13 - dateLength);
        // 多于13位去除
        const moreThan = +`${date}`.substring(0, 13);
        const timestamp = dateLength < 13 ? lessThan
            : dateLength > 13 ? moreThan : date;
        date = new Date(timestamp);
    }

    // 剔除非 Date 格式的数据
    const isDateFormat = date instanceof Date;
    if (!isDateFormat) return '-';

    const transTime = (t) => { return t < 10 ? `0${t}` : t };
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = transTime(date.getMinutes());
    const seconds = transTime(date.getSeconds());
    const timeMap = {
        'Y+': year,		// 年
        'M+': month,	// 月
        'D+': day,		// 日
        'h+': hours,	// 时
        'm+': minutes,	// 分
        's+': seconds,	// 秒
    };

    for (const k in timeMap) {
        const ret = new RegExp(`(${k})`).exec(format);
        if (ret) {
            format = format.replace(ret[0], timeMap[k]);
        }
    }

    return format;
}

// 格式必须是 2021-12-26T16:00:00.000Z
function strToDate(str) {
    var year = parseInt(str.substr(0, 4))
    var month = parseInt(str.substr(6, 2))
    var day = parseInt(str.substr(9, 2))
    var h = parseInt(str.substr(11, 2))
    var m = parseInt(str.substr(14, 2))
    var s = parseInt(str.substr(17, 2))
    // return new Date(year,month,day,h,m,s)
    return `${year}年${month}月${day}日`
}


export default {
    transDate,
    strToDate
}