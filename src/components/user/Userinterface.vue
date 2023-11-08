<template>
<!-- header用户信息的部分 -->
    <div class="user">
        <!-- 判断是否登陆显示对应界面 -->
        <div v-if="userinfocomplete&&!islogin" class="userinfo">
            <El-avatar :size="34" @click="clickopen" icon="UserFilled" class="usericon item">
            </El-avatar>     
            <span class="username item" @click="clickopen">未登录</span>
        </div>
        <div v-else-if="userinfocomplete&&islogin" class="userinfo">
            <myitem :loadingeffect="false" :hoveranim="false" :routemode="true" :shadow="false" :router="{name:'userprofile',params:{id:profile.userId}}" :imgurl="profile.avatarUrl+'?param=34y34'" class="avater"/>
            <!-- 用户信息弹窗界面以及按钮 -->
            <el-popover
                popper-class="popover_user"
                placement="bottom"
                :width="250"
                trigger="click"
            >
                <template #reference>
                        <span class="username item">{{profile.nickname}}</span>
                </template>
                <div class="popover_content">
                    <div class="numbers">
                        <div class="followinfo">
                            <div class="column border">
                                <span class="number">{{profile.eventCount}}</span>
                                <span class="type">动态</span>
                            </div>
                            <div class="column border">
                                <span class="number">{{followes}}</span>
                                <span class="type">关注</span>
                            </div>
                            <div class="column">
                                <span class="number">{{profile.followeds}}</span>
                                <span class="type">粉丝</span>
                            </div>
                        </div>
                    </div>
                    <el-button @click="sign" class="el_button" type="info" icon="Coin" :disabled="issign">{{issign?'已签到':'签到'}}</el-button>
                    <div class="row row_start">
                        <svg-icon iconClass="bx-medal"></svg-icon>
                        <span>等级</span>
                        <div class="arrow">
                            <span class="level">Lv {{userlevel}}</span>
                            <svg-icon class="arrow_icon" iconClass="bx-chevron-right"></svg-icon>
                        </div>
                    </div>
                    <div @click="routerto" class="row row_end">
                        <svg-icon iconClass="bxs-user-detail"></svg-icon>
                        <span>个人信息</span>
                        <div class="arrow">
                            <svg-icon class="arrow_icon" iconClass="bx-chevron-right"></svg-icon>
                        </div>
                    </div>
                    <el-button class="el_button" type="danger" icon="CircleClose" @click="logout">退出登录</el-button>
                </div>
            </el-popover>
        </div>
        <!-- 登录弹窗界面 -->
        <el-dialog :modal="false" :fullscreen="false" v-model="loginvisible" title="登录" center width="350px">
            <el-tabs 
                v-model="activeName"
                tab-position="bottom"
            >
                <el-tab-pane label="密码登录" name="bypassword">  
                    <div class="password login" >
                        <el-icon :size="90" color='#F29C9F'><Iphone /></el-icon>
                        <el-form :rules="rules_password" ref="passwordformref" :model='passwordform' label-position="left" label-width="0px">
                            <el-form-item
                             prop="phone" >
                                <el-input class="input my-input" placeholder="请输入手机号" v-model.number="passwordform.phone" prefix-icon="Cellphone" :maxlength="11"></el-input>
                            </el-form-item>
                            <el-form-item
                             prop="password">
                                <el-input class="input my-input" placeholder="请输入密码" :show-password="true" v-model="passwordform.password" :maxlength="20" type="password" prefix-icon="Lock"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button :disabled='login_disabled' color="#EA4848" size="large" class="login_button" @click="login_bypassword(passwordformref)">登录</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="二维码登录" name="byqrcode">
                    <div class="QR login">
                        <div v-if="login_qr_text" class="qrtext">
                            <b @click='login_byqrcode'>点击使用二维码登录</b>
                            <el-icon :size='25'><Pointer /></el-icon>
                        </div>
                        <div class="loading" v-else-if="!login_qr_text&&!qr_complete">
                            <el-icon class="is-loading" ><Loading /></el-icon>
                            正在加载
                        </div>
                        <img v-else-if="!login_qr_text&&qrshow" :src="qrcodeurl" alt="二维码">
                        <span v-else-if="!qrshow">二维码不存在或已失效</span>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="短信登录" name="bysms">
                    <div class="SMS login">
                        <el-icon :size="90" color='#F29C9F'><Iphone /></el-icon>
                        <el-form ref="SMSformref"  label-position="left" label-width="0px" :rules="rules_SMS" :model="SMSform">
                            <el-form-item prop="phone">
                                <el-input class="input my-input" placeholder="请输入手机号" v-model.number="SMSform.phone" prefix-icon="Cellphone" :maxlength="11"></el-input>
                            </el-form-item>
                            <el-form-item prop="sms">
                                <el-input prefix-icon="Key" class="captcha my-input" placeholder="请输入验证码" :maxlength="4" v-model.number="SMSform.sms"></el-input>
                                <el-button class="getcaptcha" :disabled='getcaptcha_disabled' color="#EA4848" @click="getcaptcha">{{getcaptcha_title}}</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button :disabled='login_disabled' class="login_button" color="#EA4848" size="large" @click="login_bysms(SMSformref)">登录</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
        <!-- 图标 -->
        <svg-icon @click="fullscreen" iconClass="bx-fullscreen" class="icon item"/>
</div>
</template>

<script>
import {computed, onBeforeMount, reactive, ref} from 'vue'
import { reqDailysignin,reqUserinfo,reqGetCaptcha, reqLoginStatus, reqLogout, reqPhoneCaptchaLogin, reqPhonePasswordLogin, reqQrCheck, reqQrCreate, reqQrKey, reqVerifyCaptcha } from '@/api/user'
import {ElMessage} from 'element-plus'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import { reqUserplaylist, reqUsersubcount,reqLikelist } from '@/api/music';

export default {
    name:"User",
    setup(){
        const store=useStore();
        const router=useRouter();
        let userid=computed(()=>store.state.userid);
        let islogin=computed(()=>store.state.islogin);//用户是否已登陆
        let issign=computed(()=>store.state.issign); //用户是否签到
        let userlevel=ref(1); //用户等级
        let followes=computed(()=>store.state.followe)
        let activeName=ref('bypassword');    //EL-tabs的标签名
        const passwordform=reactive({    //密码形式的表单
            phone:'',   //电话输入框
            password:'',    //登录密码输入框
        })
        const SMSform=reactive({     //短信验证形式的表单
            phone:'',   //电话输入框
            sms:'',    //验证码输入框
        })
        let getcaptcha_disabled=ref(false);//获取验证码按钮是否可用
        let loginvisible = ref(false);  //el-dialog需要的用来控制是否显示弹窗
        const passwordformref=ref('')//密码登录验证的Ref
        const SMSformref=ref('')//短信验证的ref
        let account=ref(''); //账户信息
        let profile=ref('');//用户基本信息
        let login_disabled=ref(false);//控制登录按钮是否可用，防止多次触发登陆
        let userinfocomplete=computed(()=>store.state.userinfocomplete); //用户信息是否已经读取完成，防止闪屏
        let logout_disabled=ref(false); //登出按钮是否可用
        let getcaptcha_title= ref('获取验证码')
        let login_qr_text=ref(true); //二维码按钮是否显示
        let qrcodeurl=ref(''); //二维码url
        let qrshow=ref(true);
        let qr_complete=ref(false);
        function routerto(){
            router.push({name:'userprofile',params:{id:profile.value.userId}})
        }
        function clickopen(){
            loginvisible.value=true;
            ElMessage.warning('可以使用网易云音乐的账号进行登录')
        }
        function fullscreen(){
            if(document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
            } else if(document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
            } else if(document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
            } else if(document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
            }
            else{
                ElMessage.warning('您的浏览器不支持此功能')
            }
        }
        const rules_password=reactive({//通过密码登录的方式进行表单验证的规则
            phone: [
                    { required: true, message: '请输入手机号' ,trigger:'blur'},
                    { pattern:/^[1]([3-9])[0-9]{9}$/, message: '请正确输入手机号' ,trigger:'blur'},
            ],
            password:[
                { required: true, message: '请输入密码',trigger:'blur'},
                { min:4, message: '请正确输入密码' ,trigger:'blur'},
            ]
        })
        const rules_SMS=reactive({//通过密码登录的方式进行表单验证的规则
            phone: [
                    { required: true, message: '请输入手机号' ,trigger:'blur'},
                    { pattern:/^[1]([3-9])[0-9]{9}$/, message: '请正确输入手机号' ,trigger:'blur'},
            ],
            sms: [
                { required: true, message: '请输入验证码',trigger:'blur'},
                { pattern:/[0-9]{4}/, message: '请正确输入验证码' ,trigger:'blur'},
            ]
        })
        async function getcaptcha(){ //获取验证码按钮回调方法
            const reg=/^[1]([3-9])[0-9]{9}$/
            if(reg.test(SMSform.phone)){
                getcaptcha_disabled.value=true;
                let time=60;
                let interval = setInterval(()=>{    //倒计时60s重新发送
                    if (time<=0){
                        getcaptcha_title.value='获取验证码'
                        getcaptcha_disabled.value=false;
                        clearInterval(interval)
                    }else{
                        time--;
                        getcaptcha_title.value=`等待${time}s`
                    }
                },1000)
                try{
                    await reqGetCaptcha(SMSform.phone); 
                }
                catch(err){
                    ElMessage.error('获取验证码失败,请调整网络环境后重新尝试')
                    console.log(err.message)
                }
            }else{
                ElMessage.error('请正确输入手机号码')
            }

            
        }
        async function loginstatus(){ //获取登录状态，挂载在onbeforemount上，组件创建时调用一次
            try{
                let result=await reqLoginStatus();
                // console.log(result)
                if(result.data.code === 200&&result.data.account.anonimousUser){
                    account.value=result.data.account;
                    // profile.value=result.data.profile;
                    store.commit('NOTLOGIN');


                    // let userprofile=await reqAccount();

                }
                else if(result.data.code === 200&&!(result.data.account.anonimousUser)&&result.data.profile&&result.data.account.status>=0){
                    account.value=result.data.account;
                    store.commit('ISLOGIN')
                    store.commit('USERID',result.data.account.id);
                    let userprofile=await reqUserinfo(userid.value);
                    // console.log(userprofile)
                    if(userprofile.code===200){
                        if(userprofile.pcSign){
                            store.commit('ISSIGN')
                        }
                        store.commit('SETFOLLOWE',userprofile.profile.follows)
                        let playlistresult = await reqUserplaylist(userid.value);
                        // console.log(playlistresult.playlist);
                        if (playlistresult.code === 200) {
                            let listresult = await reqUsersubcount();
                            // console.log(listresult)
                            if (listresult.code === 200) {
                                let createnumber = listresult.createdPlaylistCount;
                                // console.log(createnumber)
                                store.commit('GETUSERPLAYLIST', { playlist: playlistresult.playlist, create: createnumber })
                            } else {
                                throw Error('请求用户歌单信息失败');
                            }
                        } else {
                            throw Error('请求用户歌单列表失败');
                        }
                        let likelistresult=await reqLikelist();
                        if(likelistresult.code===200){
                            store.commit('LIKELIST',likelistresult.ids)
                        }
                        else{
                            throw Error('获取用户喜欢音乐列表失败')
                        }
                        userlevel.value=userprofile.level;
                        profile.value=userprofile.profile;
                        store.commit('SETUSERNAME',userprofile.profile.nickname)
                    }else{
                        throw Error('获取用户信息失败')
                    }
                }else{
                    store.commit('NOTLOGIN');
                }
            }
            catch(err){
                ElMessage.error('网络异常，信息获取失败')
                console.log(err)
            }
            finally{
                store.commit('USERINFOCOMPLETE');
            }
        }
        async function login_bypassword(formEL){ //通过密码登录按钮的回调函数，如果成功则刷新页面
            await formEL.validate((valid)=>{ //点击登录时在进行一次表单验证，通过才进行登陆操作
                if(valid){
                    login_disabled.value=true;
                }else{
                    ElMessage.error('请正确填写账户信息')
                }
            })
            try{
                if(login_disabled.value){
                    let result = await reqPhonePasswordLogin(passwordform.phone,passwordform.password);
                    if(result.code === 200){
                        ElMessage.success('登陆成功,5s后刷新页面')
                        account.value=result.account;
                        // profile.value=result.profile;
                        store.commit('ISLOGIN')
                        setTimeout("location.reload()",5000)
                    }
                    else{
                        ElMessage.error('登陆失败，账号或者密码不正确');
                        login_disabled.value=false;
                    }
                }
            }
            catch(err){
                ElMessage.error('登陆失败请求发送失败，请调整网络环境后重新尝试')
                console.log(err.message)
                login_disabled.value=false;
            }

        }
        async function login_bysms(formEL){
            await formEL.validate((valid)=>{ //点击登录时在进行一次表单验证，通过才进行登陆操作
                if(valid){
                    login_disabled.value=true;
                }else{
                    ElMessage.error('请正确填写账号信息')
                }
            })
            try{
                if(login_disabled.value){
                    let result2 = await reqVerifyCaptcha(SMSform.phone,SMSform.sms)
                    console.log(result2);
                    if(result2.code===200){
                        let result = await reqPhoneCaptchaLogin(SMSform.phone,SMSform.sms);
                        console.log(result);
                        if(result.code === 200){
                            ElMessage.success('登陆成功，5s后刷新页面')
                            
                            account.value=result.account;
                            // profile.value=result.profile;
                            store.commit('ISLOGIN')
                            setTimeout("location.reload()",5000)
                        }
                        else{
                            ElMessage.error('登陆失败，验证码或账号错误');
                            login_disabled.value=false;
                        }
                    }               
                }
            }
            catch(err){
                ElMessage.error('登陆请求发送失败，请调整网络环境后重新尝试')
                console.log(err.message)
            }
            finally{
                login_disabled.value=false;
            }
        }
        async function logout(){ //登出用户
            logout_disabled.value=true;
            try{
                let result=await reqLogout();
                if(result.code===200){
                    ElMessage.success('退出成功，3s后刷新页面');
                    account.value=null;
                    profile.value=null;
                    store.commit('NOTLOGIN')
                    setTimeout("location.reload()",3000);
                }
                else{
                    ElMessage.error('退出失败，请调整网络环境后重新尝试');
                    logout_disabled.value=false;
                }
            }
            catch(err){
                ElMessage.error('退出失败，请调整网络环境后重新尝试');
                console.log(err.message)
                logout_disabled.value=false;
            }
        }
        async function login_byqrcode(){
            login_qr_text.value=false;
            try{
                const keyresult=await reqQrKey();
                if(keyresult.code===200){
                    const key=keyresult.data.unikey;
                    const qrcode=await reqQrCreate(key);
                    console.log(qrcode);
                    qrcodeurl.value=qrcode.data.qrimg;
                    qr_complete.value=true;
                    let requestqr = setInterval(async () => {
                        let result = await reqQrCheck(key);
                        console.log(result);
                        if(result.code===800){
                            ElMessage.error(result.message)
                            qrshow.value=false;
                            store.commit('ISLOGIN')
                            clearInterval(requestqr);
                        }else if(result.code===803){
                            ElMessage.success('登陆成功，5s后自动刷新页面')
                            clearInterval(requestqr)
                            setTimeout("location.reload()",5000)
                        }
                    }, 5000);
                }

            }
            catch(err){
                ElMessage('获取二维码失败，调整网络环境后重新尝试')
                qrshow.value=false;
                qr_complete.value=true;
                clearInterval(requestqr)
                console.log(error.message)
            }
        }
        async function sign(){
            try{
                let result=await reqDailysignin();
                if(result.code===200){
                    store.commit('ISSIGN')
                    ElMessage.success('签到成功')
                }else{
                    ElMessage.error('请不要重复签到')
                    throw Error('重复签到')
                }
            }catch(err){
                console.log(err)
                ElMessage.error('签到失败')
            }

        }
        onBeforeMount(()=>{
            loginstatus();
            // ElMessage.success('登陆成功')
        });
        return {sign,followes,routerto,clickopen,qr_complete,userlevel,fullscreen,issign,islogin,qrshow,qrcodeurl,login_byqrcode,login_qr_text,SMSformref,passwordformref,login_bysms,getcaptcha_title,getcaptcha_disabled,logout_disabled,rules_SMS,rules_password,SMSform,passwordform,userinfocomplete,logout,login_disabled,profile,account,login_bypassword,loginstatus,getcaptcha,loginvisible,activeName};
    },
}
</script>
<style lang="less" scoped>
    .user{
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content:flex-end;
        height: 30px;

        .login_button{
                width: 250px;
                margin: 10px auto;
            }
        .userinfo{
            display: flex;
            align-items: center;
            .avater{
                width: 34px;
                height: 34px;
                border-radius: 17px;
            }
        }
        .login{
            width: 100%;
            height: 300px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
        }
        .QR{
            .qrtext{
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            b{
                cursor: pointer;
                margin: 10px 0;
            }
        }
        .SMS{
            height: 300px;
            .input{
                display: flex;
                justify-content: center;
                width: 250px;
                // margin: 10px 0;
            }
            .captcha{
                width: 148px;
            }
        }
        .password{
            .input{
                width: 250px;
            }
        }
        .item{
            margin: 0 8px;
        }
        .usericon{
            cursor: pointer;
        }
        .username{
            font-size: 12px;
            color: #FBD9D9;
            cursor: pointer;
            &:hover{
                color:#FFFFFF;
            }
        }
        .icon{
            font-size: 25px;
            color:#FBD9D9;
            cursor: pointer;
        }
}
</style>
<style lang="less">
        .popover_user{
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            .popover_content{
                width: 250px;
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                align-items: center;
                .numbers{
                    cursor: default;
                    display: flex;
                    width: 300px;
                    justify-content: space-around;
                    align-items:center;
                    .followinfo{
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        margin-top: 10PX;
                        .border{
                        border-right: 1px solid #BBBBBB;
                        }
                        .column{
                        // margin-right: 20px;
                        padding: 0 20px;
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        justify-content: space-between;
                            .type{
                                color: #BBBBBB;
                                font-size: 12px;
                            }
                            .number{
                                font-size: 20px;
                            }
                        }
                    }
                }
                .row{
                    font-size: 16px;
                    padding: 5px 5px;
                    width: 95%;
                    align-self: flex-start;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    &:hover{
                        background-color: #F0F1F2;
                    }
                    .arrow{
                        flex-grow: 1;
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;

                    }
                }
                .row_start{
                    margin-top: 5px;
                    border-top: 1px solid #BBBBBB;
                }
                .row_end{
                    border-top: 1px solid #BBBBBB;
                    border-bottom: 1px solid #BBBBBB;
                    margin-bottom: 10px;
                }
                .el_button{
                    margin-top: 10px;
                    margin-bottom: 10px;
                }
            }
        }
</style>