<template>
    <div class="mylist">
        <p @click="showmylist=(!showmylist)">创建的歌单<ArrowDown class="arrowdown" :class="{'rotate':showmylist}"/></p>
        <ul v-if="mylist.length" v-show="showmylist">
            <router-link class="list_router" v-for="(item,index) in mylist" :key="index" :to="{name:'musiclistdetail',params:{id:item.id}}" active-class="_active"><svg-icon v-if="item.specialType===5" iconClass="bx-heart" class="list_icon"></svg-icon><svg-icon v-else iconClass="bxs-playlist" class="list_icon"></svg-icon>{{item.name}}</router-link>
        </ul>
        <div v-else class="empty" >没有创建的歌单</div>
        <p @click="showcollectlist=(!showcollectlist)">收藏的歌单<ArrowDown class="arrowdown" :class="{'rotate':showcollectlist}"/></p>
        <ul v-if="collectlist.length" v-show="showcollectlist">
            <router-link class="list_router" v-for="(item,index) in collectlist" :key="index" :to="{name:'musiclistdetail',params:{id:item.id}}" active-class="_active"><svg-icon iconClass="bxs-playlist" class="list_icon"></svg-icon>{{item.name}}</router-link>
        </ul>
        <div v-else class="empty">没有收藏的歌单</div>
    </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import {computed} from 'vue'
import { useStore } from 'vuex'
export default {
    name:'MyList',
    setup(){
        const store = useStore();
        let showmylist=ref(true);
        let showcollectlist=ref(true);
        let mylist=computed(()=>store.state.playlist)
        let collectlist=computed(()=>store.state.collectlist)
        return {showmylist,showcollectlist,mylist,collectlist}
    }
}
</script>

<style lang="less" scoped>
p{
    padding-left: 20px;
    margin-top: 30px;
    margin-bottom: 0px;
    font-size: 13px;
    color:#999999;
    cursor: pointer;
    .rotate{
        transform: rotate(180deg);
    }
    .arrowdown{
        width: 0.8em;
        height: 0.8em;
        margin:0 2px;
        color:#999999;
    }
}
ul{
    padding-left: 10px;
    padding-top: 10px;
    // li{
    //     height: 35px;
    //     width:85%;
    //     line-height: 35px;
    //     font-size: 15px;
    //     list-style: none;
    //     padding-left: 10px;
    //     margin-bottom: 5px;
    //     border-radius: 5px;
    // }
    // li:hover{
    //     background-color: #F6F6F7;
    //     cursor: pointer;
    // }
    .list_router{
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: black;
        -webkit-tap-highlight-color: none;
        -webkit-user-select: none;
        -moz-user-focus: none;
        -moz-user-select: none;
        text-decoration: none;
        display: inline-block;
        height: 35px;
        width:85%;
        line-height: 35px;
        font-size: 15px;
        list-style: none;
        padding-left: 10px;
        margin-bottom: 5px;
        border-radius: 5px;
    }
    a:hover{
        background-color: #F6F6F7;
        cursor: pointer;
    }
    ._active{
        // font-size: 17px;
        // font-weight: bold;
        background-color: #F6F6F7;
    }
}
.empty{
    text-align: center;
    color: #999999;
    font-size: 12px;
    cursor: default;
    margin-top: 10px;
}
</style>