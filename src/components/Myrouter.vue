<template>
<!-- 主体内容部分 -->
      <div class="router_contain">
        <div class="router_warp" @click.stop="closedrawer">
          <router-view  v-slot="{Component}">
            <keep-alive>
                <component :is="Component"></component>
            </keep-alive>
          </router-view>
        </div>
        <div v-show="drawer" class="drawer">
                <part class="part" title="当前播放" subtitle="总共356首">
                    <div class="clearlist">
                        <svg-icon iconClass="bx-trash" class="trash"></svg-icon>
                        <span @click="clearlist" class="clear">清空列表</span>
                    </div>
                    <div class="list">
                        <el-scrollbar>
                            <el-table
                            :cell-class-name="tableCellClassName"
                            :show-header="false"
                            v-if="musiclist&&musiclist.length"
                            :data="musiclist"
                            style="width:100%;cursor:default"
                            stripe
                            lazy
                            class="list"
                            @row-dblclick="handledbclick"
                            >
                                <el-table-column show-overflow-tooltip min-width="16">
                                    <template v-slot="{$index}">
                                        <div class="icon_warp" v-if="$index===playon">
                                            <svg-icon class="active_icon" v-if="play" iconClass="bx-play"></svg-icon>
                                            <svg-icon class="active_icon" v-else iconClass="bx-pause"></svg-icon>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="标题" min-width="140">
                                    <template v-slot="{row,$index}">
                                    <span class="text_title" :class="{'playon':$index===playon}">{{row.name}}<span v-if="row.alia[0]" class="sub_info">({{row.alia[0]}})</span></span><tags class="row_tag" v-if="row.fee===1">VIP</tags><tags  class="row_tag" v-if="row.fee===8||row.fee===1">SQ</tags><tags  class="row_tag" v-if="row.mv!=0" :routemode="true" :router="{name:'videodetail',params:{id:row.mv,type:'mv'}}">MV</tags>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="歌手" min-width="60">
                                    <template v-slot="{row,$index}">
                                    <mytitle :class="{'playon':$index===playon}" v-for="(artist,i) in row.ar" :routemode="true" :router="{name:'artistdetail',params:{id:artist.id}}" size="small" color="light" :key="i">{{i>0?'/':''}}{{artist.name}}</mytitle>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip min-width="40" label="时长">
                                    <template v-slot="{row,$index}">
                                    <duration class="table_time" :class="{'playon':$index===playon}" :time="row.dt"></duration>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-empty description="列表中还没有歌曲" v-else></el-empty>
                        </el-scrollbar>
                    </div>
                </part>
        </div>
        <div v-if="loading" class="loading_cover">
            <el-icon class="is-loading" ><Loading /></el-icon>
            <span>正在加载</span>
        </div>
</div>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue';
export default {
    name:'Myrouter',
    setup(){
        const store=useStore();
        let musiclist=computed(()=>store.state.localplaylist)
        let playon=computed(()=>store.state.playon);
        let drawer=computed(()=> store.state.drawer)
        let loading=computed(()=>store.state.loading)
        let play=computed(()=>store.state.play)
        let nextlock=computed(()=>store.state.nextlock)
        let lyriclock=computed(()=>store.state.lyriclock)
        let commentlock=computed(()=>store.state.commentlock)
        function tableCellClassName({row,rowIndex}){
            row.index=rowIndex;
        }
        function clearlist(){
            if(musiclist.value&&musiclist.value.length){
                store.commit('CLEARLIST')
            }
        }
        function closedrawer(){
            if(drawer.value){
                store.commit('CLOSEDRAWER')
            }
        }
        function handledbclick(row){
            if(!nextlock.value&&!lyriclock.value&&!commentlock.value){
                store.commit('LOCK')
                store.dispatch('playon',row.index)
            }
        }
        return{musiclist,tableCellClassName,play,handledbclick,clearlist,closedrawer,drawer,loading,playon}
    }

}
</script>

<style lang="less" scoped>
.router_contain{
    position: relative;
    width:calc(100% - 202px);
    height: calc(100vh - 145px);
    .router_warp{
        height: 100%;
    }
    // border-style: solid;
    // border-color: blue;
    // border-width: 10px;
    // background-color: yellow;
    // width: calc(100vw - 500px);
    .loading_cover{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30px;
        color: #EC4141;
        z-index:999;
    }
    .list{
        .icon_warp{
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .active_icon{
            font-size: 16px;
            color:#EC4141;
            &:hover{
                color: #EC4141;
            }
        }
        .row_tag{
            margin-left: 5px;
            font-size: 10px;
        }
        .sub_info{
            color: #BBBBBB;
            font-size: 12px;
        }
        .table_time{
            cursor: default;
            font-size: 12px;
            color: #BBBBBB;
        }
        .icon{
            color: #BBBBBB;
            font-size: 20px;
            cursor: pointer;
            &:hover{
            color: #4A4A4A;
            }
        }
        .like{
            color: #EC4141;
            &:hover{
            color: #D73535;
            }
        }
        .text_title{
            font-size: 12px;
        }
        .playon{
            color:#EC4141;
            &:hover{
                color: #EC4141;
            }
        }
    }
    .drawer{
        .clearlist{
            display: flex;
            justify-content: flex-end;
            align-items: center;
            cursor: pointer;
            .trash{
                width: 13px;
                height: 13px;
                color: #676767;
            }
            .clear{
                font-size: 13px;
                color: #676767;
            }
            &:hover{
                .trash{
                    color: #373737;
                }
                .clear{
                    color: #373737;
                }
            }
        }

        top:0;
        left: calc(100% - 420px);
        position: absolute;
        width: 420px;
        height: 100%;
        background-color: white;
        box-shadow:-10px 0 10px -10px black;
        // opacity: 50%;
        z-index: 2000;
        .part{
            height: calc(100% - 69px);
            .list{
                // background-color: blue;
                width: 100%;
                height: 100%;
                cursor: default;
                .title{
                    font-size: 12px;
                }
                .artist{
                    font-size: 12px;
                }
                .time{
                    font-size: 12px;
                }
            }
        }

    }
}
</style>