<template>
    <div class="mymusic">

        <p>我的音乐</p>
        <ul>
            <router-link :to="{name:'lastestmusic'}" active-class="_active"><svg-icon iconClass="bx-timer"/>最近播放</router-link>
            <router-link :to="{path:'/myradio'}" active-class="_active"><svg-icon iconClass="bx-podcast"/>我的播客</router-link>
            <router-link :to="{path:'/collection'}" active-class="_active"><svg-icon iconClass="bx-star"/>我的收藏</router-link>
        </ul>
    </div>
</template>

<script>
export default {
    name:'Mymusic',
}
</script>

<style lang="less" scoped>
p{
    padding-left: 20px;
    margin-top: 30px;
    margin-bottom: 0px;
    font-size: 13px;
    color:#999999;
}
ul{
    padding-left: 10px;
    padding-top: 10px;
    a{
        color: black;
        -webkit-tap-highlight-color: none;
        -webkit-user-select: none;
        -moz-user-focus: none;
        -moz-user-select: none;
        text-decoration: none;
        display: flex;
        align-items: center;
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
</style>