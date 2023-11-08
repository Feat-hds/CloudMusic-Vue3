<template>
<!-- 头部 -->
  <div class="header">
        <div class="my_icon" @click="toindex">
            <PartlyCloudy class="brand_icon"/>
            <p>CloudMusic</p>
        </div>
        <ArrowLeft @click="routerback" class="lr_icon"/>
        <ArrowRight @click="routerforward" class="lr_icon"/>
        <!-- 搜索部分 -->
        <div class="search">
            <el-popover
                popper-class="popover_search"
                placement="bottom"
                :width="300"
                trigger="click"
            >
                <template #reference>
                    <!-- 搜索框 -->
                    <El-input @keydown.enter="routerto(searchkeyword)" class="search_input" maxlength="20" v-model="searchkeyword" placeholder="搜索" prefix-icon="Search" size="small"></El-Input>
                </template>
                <!-- 热搜和历史记录弹窗 -->
                <div class="searchword_container">
                    <el-scrollbar>
                    <div class="history">
                        <template v-for="(item,index) in historylist" :key="index">
                        <el-tag
                            type="info"
                            class="mx-1"
                            v-if="index<=12"
                            closable
                            @click="clickhandle(item)"
                            :disable-transitions="false"
                            @close="handleClose(index)"
                            effect="plain"
                            round
                        >
                            {{item}}
                        </el-tag>
                        </template>
                    </div>
                    <div v-if="historylist.length" class="delete_history" @click="deletehistory"><svg-icon class="trash_history" iconClass="bx-trash"/>清除历史记录</div>
                    <div class="loading" v-if="!complete">
                        <el-icon class="is-loading" ><Loading /></el-icon>
                        正在加载
                    </div>
                    <part  v-if="complete&&dataok" title="热搜榜">
                        <div class="hot_keyword">
                            <div @click="clickhandle(item.searchWord)" class="row" v-for="(item,index) in hotwordlist" :key="index">
                                <span class="index" :class="{'red':index<3}">{{index+1}}</span>
                                <span class="keyword" :class="{'deep':index<3}">{{item.searchWord}}</span>
                                <span class="score">{{item.score}}</span>
                                <span v-if="item.iconType===1" class="hot">HOT</span>
                            </div>
                        </div>
                    </part>
                    <el-empty v-else-if="complete&&!dataok" description="暂时没有数据"></el-empty>
                    </el-scrollbar>
                </div>
            </el-popover>
        </div>
        <User class="user"></User>

  </div>

</template>

<script>
import User from '@/components/user/Userinterface.vue'
import { ref } from '@vue/reactivity';  
import {useRouter,useRoute} from 'vue-router'
import { onBeforeMount } from '@vue/runtime-core';
import {reqSearchhot} from '@/api/user'
export default {
    name:'Header',
    components:{
        User
    },
    setup(){
        const router=useRouter();
        let searchkeyword=ref('')   //输入框内绑定的值
        let hotwordlist=ref([]);    //热搜词列表
        let complete=ref(false);
        let dataok=ref(true);
        let historylist=ref([]);    //历史记录列表
        function routerback(){
            router.back();
        }
        function routerforward(){
            router.forward();
        }
        function toindex(){//路由导航跳转到首页发现音乐
            router.push(
                {
                    name:'discovermusic',
                }
            )
        }
        function deletehistory(){
            localStorage.removeItem('historykeyword');
            historylist.value=[];
        }
        function routerto(keyword){ //路由跳转
            if(keyword){
                if(!historylist.value.some((item)=>item===keyword)){
                    historylist.value.unshift(keyword);
                    let word=JSON.stringify(historylist.value)
                    localStorage.setItem('historykeyword',word)
                }
                router.push({
                    path:'/search/music',
                    query:{
                        keyword:encodeURIComponent(keyword),
                    }
                })
            }
        }
        function clickhandle(item){ //点击热搜和历史记录的路由跳转功能
            searchkeyword.value=item;
            routerto(item);
        }
        function handleClose(index){ //删除历史搜索记录
            historylist.value.splice(index,1);
            let word=JSON.stringify(historylist.value)
            localStorage.setItem('historykeyword',word)
        }
        async function gethotsearch(){ //请求热搜榜
            let result = await reqSearchhot();
            // console.log(result);
            if(result.code===200){
                hotwordlist.value=result.data;
                return true;
            }
            else return Promise.reject()
        }
        
        onBeforeMount(()=>{
            let str=localStorage.getItem('historykeyword')
            if(str){
                historylist.value=JSON.parse(str)
            }
            try{
                gethotsearch();
            }
            catch(err){
                console.log(err);
                ElMessage.error('网络异常，获取热搜失败');
                dataok.value=false;
            }
            finally{
                complete.value=true;
            }

        })
        return {
            searchkeyword,
            hotwordlist,
            toindex,
            complete,
            dataok,
            routerto,
            historylist,
            handleClose,
            clickhandle,
            deletehistory,
            routerback,
            routerforward,
        }
    }
}
</script>

<style lang="less" scoped>
    .header{
        background-color: #EC4141;
        display: flex;
        width: 100%;
        height: 55px;
        font-size: 16px;
        align-items: center;
        justify-content: flex-start;
        flex-direction: row;
        .user{
            margin-right: 60px;
        }
        .my_icon{
            display: flex;
            justify-content: row;
            align-items: center;
            margin-left: 10px;
            margin-right: 75px;
            &:hover{
                cursor: pointer;
            }
            p{
                font-size: 19px;
                color: whitesmoke;
            }
            .brand_icon{
                width: 2em;
                height: 2em;
                margin:0 5px;
                color:whitesmoke
            }
        }
        .lr_icon{
                background-color: #E13E3E;
                border-radius: 1em;
                border-width: 0.2em;
                border-color: #E13E3E;
                border-style: solid;
                width: 1.2em;
                height: 1.2em;
                margin:0 5px;
                color:whitesmoke;
                cursor: pointer;
        }
        .search{
            width: 170px;
            }
        }
</style>
<style lang="less">
.popover_search{
    .searchword_container{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        width: 300px;
        height: 450px;
        .delete_history{
            width: 300px;
            text-align: right;
            color: #BBBBBB;
            font-size: 12px;
            cursor: pointer;
            &:hover{
                color: #676767;
            }
        }
        .history{
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            align-content: flex-start;
            width: 280px;
            padding: 0 10px;
            flex-wrap: wrap;
            .mx-1{
                margin: 5px 5px;
                cursor: pointer;
                &:hover{
                    background-color: #BBBBBB;
                }
            }
        }
        .trash_history{
            position: relative;
            top: 1px;
        }
        .hot_keyword{
            width: 300px;
            .row{
                height: 50px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding: 0 10px;

                cursor: pointer;
                width: 280px;
                overflow: hidden;
                &:hover{
                    background-color: #F2F2F2;
                }
                .score{
                    color: #CCCCCC;
                    font-size: 10px;
                    margin-right: 5px;
                }
                .index{
                    color:#CCCCCC;
                    display: inline-block;
                    margin-right: 10px;
                    font-size: 18px;
                }
                .red{
                    color: #FF3A3A;
                    font-weight: bold;
                }
                .keyword{
                    margin-right: 10px;
                    display: inline-block;
                    font-size: 18px;
                    color:#333333
                }
                .deep{
                    font-weight: bold;
                }
                .hot{
                    color: #FF3D3D;
                    font-style:italic;
                    font-weight: bold;
                }
            }
        }
    }
}
</style>