<template>
  <ul>
    <router-link :to="{name:'discovermusic'}" active-class="_active">发现音乐</router-link>
    <router-link :to="{name:'radio'}" active-class="_active">播客</router-link>
    <router-link :to="{name:'video'}" active-class="_active">视频</router-link>
    <router-link :to="{name:'privitefm'}" active-class="_active">私人FM</router-link>

  </ul>
</template>

<script>
export default {
    name:'MyMenu',
    setup(){

    }
}
</script>

<style lang="less" scoped>
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
        display: block;
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
        font-size: 17px;
        font-weight: bold;
        background-color: #F6F6F7;
    }
}

</style>