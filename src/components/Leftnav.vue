<template>
<!-- 左边导航条 -->
    <el-scrollbar class="scrollbar navbar" >
        <div>
            <MyMenu />
            <div class="loading" v-if="!userinfocomplete">
                <el-icon class="is-loading" ><Loading /></el-icon>
                正在加载
            </div>
            <div v-else-if="islogin">
                <Mymusic/>
                <MyList/>
            </div>
            <div v-else>
                <span class="info">登录后获得更多信息</span>
            </div>
        </div>

    </el-scrollbar>
</template>

<script>

import MyMenu from "@/components/leftnavcomp/MyMenu.vue";
import MyList from '@/components/leftnavcomp/MyList.vue';
import Mymusic from "@/components/leftnavcomp/Mymusic.vue";
import {useStore} from 'vuex';
import { computed } from 'vue';
export default {
    name:'Leftnav',
    components:{
        MyMenu,
        MyList,
        Mymusic,
    },
    setup(){
        const store=useStore();
        let islogin=computed(()=>store.state.islogin);
        let userinfocomplete=computed(()=>store.state.userinfocomplete);
        return {userinfocomplete,islogin}
    }
}
</script>

<style lang="less" scoped>
.navbar{
    flex-grow: 0;
    flex-shrink: 0;
    // align-self: flex-start;
    height: calc(100vh - 145px);
    width: 200px;
    // align-self: stretch;
    border-right-style: solid;
    border-right-width: 2px;
    border-right-color: #E1E1E1;
    // overflow: none;
    // &:hover{
    //     overflow: auto;
    // }

}
    .info{
        text-align: center;
        font-size: 16px;
        color: #BBBBBB;
        line-height: 50px;
        width: 100%;
        display: inline-block;
        cursor: default;
    }
.loading{
    text-align: center;
    line-height: 50px;
}

</style>