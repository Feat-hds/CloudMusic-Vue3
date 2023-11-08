<template>
<el-scrollbar>
  <div class="loading" v-if="!complete">
      <el-icon class="is-loading" ><Loading /></el-icon>
      正在加载
  </div>
  <div v-if="complete&&dataok" class="router_container">
    <div class="list_header">
      <el-image :src="`${userinfo.profile.avatarUrl}?param=180y180`" class="avater">
          <template #error>
              <div class="image-slot">
                  <el-icon><Picture /></el-icon>
              </div>
          </template>
          <template #placeholder>
              <div class="image-slot-loading">
                  <el-icon class="is-loading" ><Loading /></el-icon>
                  loading
              </div>
          </template>
      </el-image>
      <div class="list_info">
        <div class="title">
            <div class="list_name">{{userinfo.profile.nickname}}</div>
            <svg-icon v-if="userinfo.profile.gender===1" class="gender male" iconClass="bx-male-sign"/><svg-icon class="gender female" v-else-if="userinfo.profile.gender===2" iconClass="bx-female-sign"/>
            <tags class="tag">LV{{userinfo.level}}</tags>
            <tags v-if="userinfo.profile.vipType" class="tag">VIP</tags>
        </div>
        <div class="followinfo">
          <div class="column border">
            <span class="number">{{userinfo.profile.eventCount}}</span>
            <span class="type">动态</span>
          </div>
          <div class="column border">
            <span class="number">{{userinfo.profile.follows}}</span>
            <span class="type">关注</span>
          </div>
          <div class="column">
            <span class="number">{{userinfo.profile.followeds}}</span>
            <span class="type">粉丝</span>
          </div>
        </div>
        <div v-if="userid!=userinfo.profile.userId">
          <el-button v-if="followed" @click="handlefollowe(userinfo.profile.userId,0)" class="button_userprofile" type="danger" round icon="CloseBold">已关注</el-button>
          <el-button v-else @click="handlefollowe(userinfo.profile.userId,1)" class="button_userprofile" type="danger" round plain icon="Plus">关注</el-button>
        </div>
        <el-tooltip
          v-if="userinfo.profile.description"
          class="box-item"
          effect="dark"
          :content="userinfo.profile.description"
          placement="bottom"
        >
          <div class="brief">个人介绍:{{userinfo.profile.description}}</div>
        </el-tooltip>
        <div class="brief" v-else>个人介绍: 暂无介绍</div>
       
      </div>
    </div>
    <el-tabs 
      v-model="activeName"
      tab-position="top"
      class="el-tabs"
    >
        <el-tab-pane lazy label="创建的歌单" name="createlist">
            <div v-if="musiclistlist.length" class="recommend_list">
                    <div class="music_item"  v-for="(item,index) in musiclistlist" :key="index">
                        <Myitem :imgurl="`${item.coverImgUrl}?param=150y150`" :routemode="true" :router="{name:'musiclistdetail',params:{id:item.id}}" :number="item.playCount" class="item"></Myitem>
                        <Mytitle :routemode="true" :router="{name:'musiclistdetail',params:{id:item.id}}" class="title">{{item.name}}</Mytitle>
                        <span class="text_table">{{item.trackCount}}首</span>
                    </div>
                </div>
            <el-empty v-else description="没有找到数据"></el-empty>
        </el-tab-pane>
        <el-tab-pane lazy label="收藏的歌单" name="collectlist">
            <div v-if="collectlist.length" class="recommend_list">
                    <div class="music_item"  v-for="(item,index) in collectlist" :key="index">
                        <Myitem :imgurl="`${item.coverImgUrl}?param=150y150`" :routemode="true" :router="{name:'musiclistdetail',params:{id:item.id}}" :number="item.playCount" class="item"></Myitem>
                        <Mytitle :routemode="true" :router="{name:'musiclistdetail',params:{id:item.id}}" class="title">{{item.name}}</Mytitle>
                      <span class="text_table">{{item.trackCount}}首</span>
                    </div>
                </div>
            <el-empty v-else description="没有找到数据"></el-empty>
        </el-tab-pane>
        <el-tab-pane lazy label="创建的播客" name="createradiolist" class="tabs_list">
        <el-table
            v-if="audiolist.length"
            :show-header="false"
            :data="audiolist"
            style="width:100%;cursor:default;border-top-style:solid;border-top-color:#BBBBBB;border-top-width:1px;"
            stripe
            lazy
            class="list"
          >
            <el-table-column width="80">
              <template v-slot="{row}">
              <Myitem :shadow="false" :imgurl="`${row.picUrl}?param=60y60`" :routemode="true" :router="{name:'radiodetail',params:{id:row.id}}" class="cover"></Myitem>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="120">
              <template v-slot="{row}">
                <mytitle :routemode="true" :router="{name:'radiodetail',params:{id:row.id}}" >{{row.name}}<tags class="row_tag" v-if="row.secondCategory">{{row.secondCategory}}</tags></mytitle>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="60">
              <template v-slot="{row}">
                <span class="text_table">声音<playnumber :number="row.programCount" /></span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="60">
              <template v-slot="{row}">
                <span class="text_table">收藏<playnumber :number="row.subCount" /></span>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-else description="没有找到数据"></el-empty>
        </el-tab-pane>
        <!-- <el-tab-pane lazy label="收藏的播客" name="collectradiolist" class="tabs_list">  
        <el-table
            :show-header="false"
            :data="musiclist"
            style="width:100%;cursor:default;border-top-style:solid;border-top-color:#BBBBBB;border-top-width:1px;"
            stripe
            lazy
            class="list"
          >
            <el-table-column width="80">
              <Myitem class="cover"></Myitem>
            </el-table-column>
            <el-table-column prop="title" show-overflow-tooltip min-width="120" />
            <el-table-column show-overflow-tooltip min-width="60">
              <template v-slot="{row}">
                <span class="text" >{{row.artist}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="60">
              <template v-slot="{row}">
                <span class="text">{{row.album}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="time" show-overflow-tooltip min-width="20" />
          </el-table>
        </el-tab-pane> -->
    </el-tabs>
  </div>
<el-empty v-else-if="complete&&!dataok" description="暂时没有数据"></el-empty>
</el-scrollbar>
</template>

<script>
import { ref } from '@vue/reactivity'
import { ElMessage } from 'element-plus';
import { reqUserplaylist,reqUseraudio,reqUserfollowe} from '@/api/music';
import {  onBeforeRouteUpdate, useRoute } from 'vue-router';
import { computed, onActivated, onBeforeMount, watch } from '@vue/runtime-core';
import { reqUserinfo } from '@/api/user';
import {useStore} from 'vuex'
export default {
    name:'Userprofile',
    setup(){
      const route=useRoute();
      const store=useStore();
      let userid=computed(()=>store.state.userid);
      let complete=ref(false);
      let dataok=ref(true);
      let activeName=ref('createlist');
      let musiclistlist=ref([])
      let userinfo=ref({})
      let userplaylistcount=0;
      let collectlist=ref([])
      let audiolist=ref([])
      let id=ref(null)
      let followed=ref(false);
      let islogin=computed(()=>store.state.islogin);
      async function handlefollowe(id,followe){
        try{
          if(islogin){
            let result=await reqUserfollowe(id,followe)
            if(result.code===200){
              if(followe===1){
                followed.value=true;
                store.commit('FOLLOWE')
              }
              else if(followe===0){
                followed.value=false;
                store.commit('UNFOLLOWE')
              }
            }
          }
          else{
            ElMessage.warning('请先登录在进行操作')
          }
        }
        catch(err){
          console.log(err)
          ElMessage.error('没有登录或登录环境不够安全，请使用二维码或短信验证重新登录后再尝试')
        }

      }
        async function getuserinfo(id){
            let result=await reqUserinfo(id);
            // console.log(result);
            if(result.code===200){
              userinfo.value=result;
              userplaylistcount=result.profile.playlistCount;
                // mvlist.value=result.data;
              followed.value=result.profile.followed;
              return true;
            }
            else return Promise.reject();
        }
        async function getuseraudio(id){
            let result=await reqUseraudio(id);
            // console.log(result);
            if(result.code===200){
              audiolist.value=result.djRadios;
                // mvlist.value=result.data;
              return true;
            }
            else return Promise.reject();
        }
        async function getuserlist(id){
            let result=await reqUserplaylist(id);
            // console.log(result);
            if(result.code===200){
              collectlist.value=result.playlist;
                // mvlist.value=result.data;
              musiclistlist.value=collectlist.value.splice(0,userplaylistcount);
            }
            else return Promise.reject();
        }
        onActivated(async ()=>{
          try{
            if(id.value!=route.params.id){
              complete.value=false;
              dataok.value=true;
                if(route.params.id){
                  // console.log(10)
                  await getuserinfo(route.params.id);
                  await getuserlist(route.params.id);
                  await getuseraudio(route.params.id);
                  id.value=route.params.id;
                }
                else throw Error('没有关键字')
            }
          }
          catch(err){
            ElMessage.error('网络异常，无法获取数据')
            console.log(err)
            dataok.value=false;
          }
          finally{
            complete.value=true;
          }
        })
        onBeforeRouteUpdate(async (to)=>{
          try{
            if(to.name==='userprofile'){
              complete.value=false;
              dataok.value=true;
                if(to.params.id){
                  // console.log(10)
                  await getuserinfo(to.params.id);
                  await getuserlist(to.params.id);
                  await getuseraudio(to.params.id);
                  id.value=to.params.id;
                }
                else throw Error('没有关键字')
            }
          }
          catch(err){
            ElMessage.error('网络异常，无法获取数据')
            console.log(err)
            dataok.value=false;
          }
          finally{
            complete.value=true;
          }
        })
        // onBeforeMount(async ()=>{
        //     try{
        //         await getuserinfo(route.params.id);
        //         await getuserlist(route.params.id);
        //         await getuseraudio(route.params.id);
        //         id.value=route.params.id;
        //     }
        //     catch(err){
        //         console.log(err.message)
        //         ElMessage.error('网络异常，获取数据失败')
        //         dataok.value=false;
        //     }
        //     finally{
        //         complete.value=true;
        //     }
            
        // })
      return{handlefollowe,userid,audiolist,followed,collectlist,userinfo,musiclistlist,activeName,complete,dataok}
    }
}
</script>

<style lang="less" scoped>

.router_container{
  height: calc(100vh - 204px);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  .list_header{
    cursor: default;
    height: 240px;
    padding-left: 30px;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    .avater{
      background-color: gray;
      border-radius: 90px;
      width: 180px;
      height: 180px;
    }
    .button_userprofile{
      margin-top: 10px;
    }
    .list_info{
      margin-left: 20px;
      // background-color: gray;
      height: 200px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      .title{
        display: flex;
        width: 100%;
        padding-bottom: 10px;
        justify-content: flex-start;
        align-items: center;
        border-bottom: 1px solid #BBBBBB;
        .gender{
          border-radius: 50px;
          border-width: 1px;
          border-style: solid;
          margin-left: 5px;
        }
        .male{
          border-color: #56B0DA;
          color: #56B0DA;
        }
        .female{
          border-color: #E8518E;
          color: #E8518E;
        }
        .list_name{
          margin-left: 10px;
          font-weight: bold;
          font-size: 24px;
          cursor: default;
        }
        .tag{
          margin-left: 10px;
        }
      }
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
      .brief{
        margin-top: 10px;
        font-size: 12px;
        width: 300px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #676767;
        cursor: default;
      }
    }
  }
  .el-tabs{
    align-self: center;
    width: 95%;
    .recommend_list{
        .music_item{
            margin: 5px 0;
            flex-shrink: 0;
        }
        .item{
            width: 150px;
            height: 150px;
            flex-shrink: 0;
        }
        .title{
            width: 150px;
            word-break: break-all;
            text-overflow: ellipsis; /* 文本溢出时显示省略号来代表被修剪的文本 */
            display: -webkit-box; /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 */
            -webkit-box-orient: vertical; /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 */
            -webkit-line-clamp: 2; /* 文本需要显示多少行 */
            overflow: hidden;
        }
        .text_table{
          font-size: 12px;
          color: #BBBBBB;
          cursor: default;
        }
        display: grid;
        grid-template-columns: repeat(5,1fr);    
    }
    .list{
      .cover{
          width: 60px;
          height: 60px;
      }
      .row_tag{
        margin-left: 5px;
        font-size: 10px;
      }
      .text_table{
        cursor: default;
        font-size: 12px;
        color: #BBBBBB;
      }
    }
  }
}
</style>
