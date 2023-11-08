import request from "./request"
export const reqPhonePasswordLogin = (phone, password) => {
        const encode_password = encodeURIComponent(password) //对密码进行编码，否则特殊字符不识别
        return request(`/login/cellphone?phone=${phone}&password=${encode_password}`)
    } //手机密码登录

// export const reqDailysignin = () => { return request(`/daily_signin`) } //签到
export const reqDailysignin = () => { return request(`/daily_signin?ts=${Date.now()}`) } //签到
export const reqSearchhot = () => { return request(`/search/hot/detail`) }

// export const reqAccount = () => { return request(`/user/account?`) } //获取
export const reqAccount = () => { return request(`/user/account?ts=${Date.now()}`) } //获取账号信息
export const reqPhoneCaptchaLogin = (phone, captcha) => { return request(`/login/cellphone?phone=${phone}&captcha=${captcha}`) } //手机短信验证码登录

export const reqLoginStatus = () => { return request(`/login/status?ts=${Date.now()}`) } //验证登录状态
    // export const reqLoginStatus = () => { return request(`/login/status`) } //验证登录状态
export const reqUserinfo = (uid) => { return request(`/user/detail?uid=${uid}`) } //获取用户细节信息
    // export const reqLogout = () => { return request(`/logout`) } //登出账号
export const reqLogout = () => { return request(`/logout?ts=${Date.now()}`) } //登出账号
export const reqGetCaptcha = (phone) => { return request(`/captcha/sent?phone=${phone}`) } //给输入手机号发送验证码
export const reqVerifyCaptcha = (phone, captcha) => { return request(`/captcha/verify?phone=${phone}&captcha=${captcha}&ts=${Date.now()}`) } //验证验证码是否正确
export const reqQrKey = () => { return request(`/login/qr/key?ts=${Date.now()}`) } //获取Qrkey
export const reqQrCreate = (key) => { return request(`/login/qr/create?key=${key}&qrimg=true&timestamp=${Date.now()}`) } //获取Qrcode
export const reqQrCheck = (key) => { return request(`/login/qr/check?key=${key}&timestamp=${Date.now()}`) } //获取qr状态，800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies)