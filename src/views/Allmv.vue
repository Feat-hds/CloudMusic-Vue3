<template>
<el-scrollbar @scroll="scrollhandle">
    <div class="loading" v-if="!complete">
        <el-icon class="is-loading" ><Loading /></el-icon>
        正在加载
    </div>
  <div ref="container" v-if="complete&&dataok" class="router_container">
        <part class="header" title="全部MV">
            <div class="category_container">
                <div class="hotcat_container">
                    <span class="sort_title">地区:</span>
                    <div  v-for="(item,index) in catlistarea" :key="index" class='sort_container'>
                        <span @click="handleClick(item,1)" class="sort_child" :class="{'is-active':item===currentarea}">{{item}}</span>
                    </div>
                </div>
                <div class="hotcat_container">
                    <span class="sort_title">类型:</span>
                    <div  v-for="(item,index) in catlisttype" :key="index" class='sort_container'>
                        <span @click="handleClick(item,2)" class="sort_child" :class="{'is-active':item===currenttype}">{{item}}</span>
                    </div>
                </div>
                <div class="hotcat_container">
                    <span class="sort_title">排序:</span>
                    <div  v-for="(item,index) in catlistorder" :key="index" class='sort_container'>
                        <span @click="handleClick(item,3)" class="sort_child" :class="{'is-active':item===currentorder}">{{item}}</span>
                    </div>
                </div>
            </div>
        </part>
        <part>
            <div class="music_list">
                <div class="item_container"  v-for="(item,index) in mvlist" :key="index">
                    <Myitem :routemode="true" :router="{name:'videodetail',params:{id:item.id,type:'mv'}}" :imgurl="`${item.cover}?param=240y150`" class="item" :number="item.playCount"></Myitem>
                    <Mytitle :routemode="true" :router="{name:'videodetail',params:{id:item.id,type:'mv'}}" class="title">{{item.name}}</Mytitle>
                    <div class="artist_container">
                        <Mytitle size="small" color="light" v-for="(ar,i) in item.artists" :key="i" :routemode="true" :router="{name:'artistdetail',params:{id:ar.id}}" class="artist" >{{i>1?'/':''}}{{ar.name}}</Mytitle>
                    </div>
                </div>
            </div>
        </part>

  </div>
<el-empty v-else-if="complete&&!dataok" description="暂时没有数据"></el-empty>
</el-scrollbar>
</template>

<script>
import { ref } from '@vue/reactivity'
import { onActivated } from '@vue/runtime-core'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { reqMv } from '@/api/music'
import {ElMessage} from 'element-plus'
import __ from 'lodash'
import { useStore } from 'vuex'

export default {
    name:'Allmv',
    setup(){
        const catlistorder=['上升最快','最热','最新']
        const catlistarea=['全部','内地','港台','欧美','韩国','日本']
        const catlisttype=['全部','官方版','原声','现场版','网易出品']
        const route=useRoute();
        const router=useRouter();
        const store=useStore();
        let currentarea=ref('')
        let currentorder=ref('')
        let currenttype=ref('')
        let dataok=ref(true);//数据是否获取成功
        let complete=ref(false);//网络请求是否已经发送完成
        let mvlist=ref([])
        let container=ref(null)
        let more=false;
        let page=1;
        async function getmore(area,limit,order,offset,type){
            let result=await reqMv(area,limit,order,offset,type);
            // console.log(result);
            if(result.code===200){
                for(let x of result.data){
                    mvlist.value.push(x)
                }
                more=result.hasMore;
                page++;
                return true;
            }
            else return Promise.reject();
        }
        async function scroll({scrollTop}){
            if(more){
                if(container.value.scrollHeight<scrollTop+container.value.clientHeight+10){
                    try{
                        // console.log(container)
                        store.commit('LOAD')
                        await getmore(currentarea.value,30,currentorder.value,page*30,currenttype.value);
                    }
                    catch(err){
                        console.log(err)
                        ElMessage.error('网络异常，数据获取失败')
                    }
                    finally{
                        store.commit('LOADCOMPLETE')
                    }
                }
            }
        }
        const scrollhandle=__.throttle(scroll,1000)
        function handleClick(cat,n){
            if(n===1){
                if(cat!=currentarea.value){
                    router.push({name:'allmv',params:{type:currenttype.value,order:currentorder.value,area:cat}})
                }
            }
            else if(n===2){
                if(cat!=currenttype.value){
                    router.push({name:'allmv',params:{type:cat,order:currentorder.value,area:currentarea.value}})
                }
            }
            else if(n===3){
                if(cat!=currentorder.value){
                    router.push({name:'allmv',params:{type:currenttype.value,order:cat,area:currentarea.value}})
                }
            }
        }
        async function getmv(area,limit,order,offset,type){
            let result=await reqMv(area,limit,order,offset,type);
            // console.log(result);
            if(result.code===200){
                mvlist.value=result.data;
                more=result.hasMore;
                return true;
            }
            else return Promise.reject();
        }
        onBeforeRouteUpdate(async (to)=>{
            try{
                if(to.name==='allmv'){
                    complete.value=false;
                    dataok.value=true;
                    if(to.params.area&&to.params.order&&to.params.type){
                        await getmv(to.params.area,30,to.params.order,0,to.params.type);
                        currentarea.value=to.params.area;
                        currentorder.value=to.params.order;
                        currenttype.value=to.params.type;
                    }
                    else throw('网页参数错误')
                }
            }
            catch(err){
                console.log(err.message)
                ElMessage.error('网络异常，获取数据失败')
                dataok.value=false;
            }
            finally{
                complete.value=true;
            }
        })
        onActivated(async ()=>{
            try{
                if(route.params.area!=currentarea.value||route.params.order!=currentorder.value||route.params.type!=currenttype.value){
                    complete.value=false;
                    dataok.value=true;
                    if(route.params.area&&route.params.order&&route.params.type){
                        await getmv(route.params.area,30,route.params.order,0,route.params.type);
                        currentarea.value=route.params.area;
                        currentorder.value=route.params.order;
                        currenttype.value=route.params.type;
                    }
                    else throw('网页参数错误')
                }
            }
            catch(err){
                console.log(err.message)
                ElMessage.error('网络异常，获取数据失败')
                dataok.value=false;
            }
            finally{
                complete.value=true;
            }
            
        })
        return {handleClick,scrollhandle,container,mvlist,dataok,complete,currentarea,currentorder,currenttype,catlistorder,catlistarea,catlisttype}
    }
}
</script>
<style lang="less" scoped>

.router_container{
    height: calc(100vh - 145px);
    .header{
        .category_container{
            width: 100%;
            // background-color: yellow;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            flex-direction: column;

            .hotcat_container{
                margin: 5px 10px;
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                .sort_title{
                    cursor: default;
                    font-size: 12px;
                    color: #676767;
                    display: inline-block;
                    text-align: center;
                    padding: 2px 0;
                    margin-right: 10px;
                }
                .sort_container{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    // width: 60px;
                    // border-right-style: solid;
                    // border-right-color: #F2F2F2;
                    // border-width: 1px;
                    .sort_child{
                        display: inline-block;
                        text-align: center;
                        font-size: 12px;
                        color: #676767;
                        cursor: pointer;
                        padding: 2px 10px;
                        border-radius: 10px;
                        &:hover{
                            color: #373737;
                        }
                    }
                    .is-active{
                        color: #EC4141;
                        background-color: #FDF5F5;

                        &:hover{
                            color: #EC4141;
                            background: #FDEDED;
                        }
                    }
                }
            }
        }
    }
    .music_list{
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3,1fr);
        .item_container{
            margin:5px 0;
            .item{
                width: 240px;
                height: 150px;
            }
            .title{
                width: 240px;
                display: inline-block;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden
            }
        }
    }
}
</style>