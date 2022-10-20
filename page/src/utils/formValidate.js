class FormValidate {
    validatePhone(rules, value, callback) {
        let isNumber = !isNaN(Number(value))

        if (value.length !== 11) {
            callback(new Error("电话号码长度必须是11位"))
        } else if (!isNumber) {
            callback(new Error("电话号码必须为数字"))
        }
        else {
            callback()
        }
    }
    validateEmail(rules, value, callback) {
        const regEmail = /[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,5}$/

        if (!regEmail.test(value)) {
            callback(new Error("必须是邮箱格式"))
        } else {
            callback()
        }
    }
}

// FormValidate.prototype.isNumber = function (val) {
//     let regPos = /^\-[0-9][0-9]*$/
//     if (regPos.test(val)) {
//         return true
//     } else {
//         return false
//     }
// }

//没法通过this 获取上面的方法。




export default new FormValidate()