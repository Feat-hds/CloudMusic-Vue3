<template>
  <el-scrollbar>
    <div class="loading" v-if="!complete">
      <el-icon class="is-loading">
        <Loading />
      </el-icon>
      正在加载
    </div>
    <div v-if="complete && dataok" class="router_container">
      <div class="list_header">
        <el-image :src="`${artistinfo.cover}?param=180y180`" class="cover">
          <template #error>
            <div class="image-slot">
              <el-icon>
                <Picture />
              </el-icon>
            </div>
          </template>
          <template #placeholder>
            <div class="image-slot-loading">
              <el-icon class="is-loading">
                <Loading />
              </el-icon>
              loading
            </div>
          </template>
        </el-image>
        <div class="list_info">
          <div class="title">
            <tags class="t">歌手</tags>
            <div class="list_name">{{ artistinfo.name }}</div>
          </div>
          <div class="button_group">
            <el-button v-if="issub" @click="subartist(artistinfo, 2)" type="info" size="small" icon="FolderChecked" plain
              round>已收藏</el-button>
            <el-button v-else @click="subartist(artistinfo, 1)" type="info" size="small" icon="FolderAdd" plain
              round>收藏</el-button>
          </div>
          <div class="detail_info">单曲: {{ artistinfo.musicSize }} 专辑: {{ artistinfo.albumSize }} MV: {{ artistinfo.mvSize
          }}
          </div>
        </div>
      </div>
      <el-tabs v-model="activeName" tab-position="top" class="el-tabs">
        <el-tab-pane label="专辑" name="list" class="tabs_list">
          <div class="album_list">
            <part>
              <div v-if="albumlist.length" class="recommend_list">
                <div class="music_item" v-for="(item, index) in albumlist" :key="index">
                  <Myitem :shadow="false" :imgurl="`${item.picUrl}?param=150y150`" :routemode="true"
                    :router="{ name: 'albumsdetail', params: { id: item.id } }" class="item"></Myitem>
                  <Mytitle :routemode="true" :router="{ name: 'albumsdetail', params: { id: item.id } }" class="title">
                    {{ item.name }}</Mytitle>
                  <timetransform :time="item.publishTime" class="create_time" />
                </div>
              </div>
              <el-empty v-else description="没有找到数据"></el-empty>
            </part>
          </div>
        </el-tab-pane>
        <el-tab-pane lazy label="MV" name="mv">
          <part>
            <div v-if="mvlist.length" class="recommend_mv">
              <div class="music_item" v-for="(item, index) in mvlist" :key="index">
                <Myitem :imgurl="`${item.imgurl}?param=300y140`" :routemode="true"
                  :router="{ name: 'videodetail', params: { type: 'mv', id: item.id } }" :number="item.playCount"
                  class="item">
                </Myitem>
                <Mytitle :routemode="true" :router="{ name: 'videodetail', params: { type: 'mv', id: item.id } }"
                  class="title">
                  {{ item.name }}</Mytitle>
                <Mytitle v-if="item.artist" :routemode="true"
                  :router="{ name: 'artistdetail', params: { id: item.artist.id } }" class="title" size="small"
                  color="light">{{ item.artist.name }}</Mytitle>
              </div>
            </div>
            <el-empty v-else description="没有找到数据"></el-empty>
          </part>
        </el-tab-pane>
        <el-tab-pane lazy label="歌手详情" name="detail">
          <div class="detail">
            <part v-for="(item, index) in desc" :key="index" :title="item.ti">
              <div class="text">{{ item.txt }}</div>
            </part>
          </div>
        </el-tab-pane>
        <el-tab-pane lazy label="相似歌手" name="recommendartist">
          <div v-if="similist.length" class="artist_list">
            <div v-for="(item, index) in similist" class="item_container" :key="index">
              <myitem :shadow="false" :routemode="true" :router="{ name: 'artistdetail', params: { id: item.id } }"
                :imgurl="`${item.picUrl}?param=150y150`" class="item"></myitem>
              <Mytitle :routemode="true" :router="{ name: 'artistdetail', params: { id: item.id } }" class="title">{{
                item.name }}
              </Mytitle>
            </div>
          </div>
          <el-empty v-else description="没有找到数据"></el-empty>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-empty v-else-if="complete && !dataok" description="暂时没有数据"></el-empty>
  </el-scrollbar>
</template>

<script>
import { ref } from '@vue/reactivity'
import { ElMessage } from 'element-plus';
import { computed, onActivated } from '@vue/runtime-core';
import { reqArtistinfo, reqArtistalbum, reqArtistdesc, reqArtistmv, reqSimiartist, reqSubartistlist } from '@/api/music'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { useStore } from 'vuex';


export default {
  name: 'Artistdetail',
  setup() {
    const store = useStore();
    const route = useRoute();
    let complete = ref(false);
    let dataok = ref(true);
    let activeName = ref('list');
    let islike = ref(false);
    let albumlist = ref([]);
    let artistinfo = ref({});
    let mvlist = ref([]);
    let desc = ref([]);
    let similist = ref([]);
    let id = ref(null);
    let islogin = computed(() => store.state.islogin);
    let isartistlist = computed(() => store.state.isartistlist);
    let artistlist = computed(() => store.state.artistlist);
    let issub = computed(() => {
      if (artistinfo.value.id) {
        if (artistlist.value.some((num) => num.id === artistinfo.value.id)) return true;
        else return false;
      }
    })
    function subartist(artist, t) {
      store.dispatch('subartist', { artist: artist, t: t })
    }
    async function getsubartistlist(limit, offset) {
      if (!isartistlist.value && islogin.value) {
        let result = await reqSubartistlist(limit, offset);
        if (result.code === 200) {
          store.commit('ARTISTLISTCOMPLETE')
          store.commit('SETARTISTLIST', result.data);
          store.commit('SUBARTISTTOTAL', result.count);
          return true;
        }
        else return Promise.reject();
      }
      else return true;
    }
    async function getartistalbum(id) {
      let result = await reqArtistalbum(id);
      if (result.code === 200) {
        albumlist.value = result.hotAlbums;
      }
      else return Promise.reject();
    }
    async function getartistinfo(id) {
      let result = await reqArtistinfo(id);
      if (result.code === 200) {
        artistinfo.value = result.data.artist;
      }
      else return Promise.reject();
    }
    async function getartistmv(id) {
      let result = await reqArtistmv(id);
      if (result.code === 200) {
        mvlist.value = result.mvs;
      }
      else return Promise.reject();
    }
    async function getartistdesc(id) {
      let result = await reqArtistdesc(id);
      if (result.code === 200) {
        desc.value = result.introduction;
      }
      else return Promise.reject();
    }
    async function getsimiartist(id) {
      let result = await reqSimiartist(id);
      if (result.code === 200) {
        similist.value = result.artists;
      }
      else return Promise.reject();
    }
    onActivated(async () => {
      if (route.params.id != id.value) {
        complete.value = false;
        dataok.value = true;
        try {
          if (route.params.id) {
            await getartistinfo(route.params.id);
            await getartistalbum(route.params.id);
            await getsimiartist(route.params.id);
            await getartistmv(route.params.id);
            await getartistdesc(route.params.id);
            await getsubartistlist(500, 0);
            id.value = route.params.id;
          }
          else throw Error('没有关键字')
        }
        catch (err) {
          console.log(err)
          ElMessage.error('网络异常，获取数据失败')
          dataok.value = false;
        }
        finally {
          complete.value = true;
        }
      }
    })
    onBeforeRouteUpdate(async (to) => {
      if (to.name === 'artistdetail') {
        complete.value = false;
        dataok.value = true;
        try {
          if (to.params.id) {
            await getartistinfo(to.params.id);
            await getartistalbum(to.params.id);
            await getsimiartist(to.params.id);
            await getartistmv(to.params.id)
            await getartistdesc(to.params.id)
            id.value = to.params.id
          }
          else throw Error('没有关键字')
        }
        catch (err) {
          console.log(err)
          ElMessage.error('网络异常，获取数据失败')
          dataok.value = false;
        }
        finally {
          complete.value = true;
        }

      }
    })
    return { subartist, issub, similist, desc, mvlist, complete, dataok, artistinfo, albumlist, activeName, islike }
  }
}
</script>

<style lang="less" scoped>
.router_container {
  height: calc(100vh - 204px);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  .list_header {

    cursor: default;
    height: 240px;
    padding-left: 30px;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    .cover {
      background-color: gray;
      width: 180px;
      height: 180px;
    }

    .list_info {
      margin-left: 20px;
      // background-color: gray;
      height: 200px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      .title {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .list_name {
          margin-left: 10px;
          font-weight: bold;
          font-size: 24px;
          cursor: default;
        }
      }

      .button_group {
        margin-top: 10px;

      }

      .detail_info {
        margin-top: 10px;
        font-size: 14px;
        color: #676767;
        cursor: default;
      }
    }
  }

  .el-tabs {
    align-self: center;
    width: 95%;

    .detail {
      .text {
        color: #616162;
        font-size: 14px;
        text-indent: 2em;
        cursor: default;
      }
    }

    .album_list {
      .recommend_list {
        .music_item {
          margin: 5px 0;
          flex-shrink: 0;
        }

        .item {
          width: 150px;
          height: 150px;
          flex-shrink: 0;
        }

        .title {
          width: 150px;
          overflow: hidden;
          word-break: break-all;
          text-overflow: ellipsis;
          /* 文本溢出时显示省略号来代表被修剪的文本 */
          display: -webkit-box;
          /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 */
          -webkit-box-orient: vertical;
          /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 */
          -webkit-line-clamp: 2;
          /* 文本需要显示多少行 */
        }

        .create_time {
          font-size: 12px;
          color: #BBBBBB;
        }

        display: grid;
        grid-template-columns: repeat(5, 1fr);
      }
    }

    .recommend_mv {
      .music_item {
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        margin: 5px 0;

        .item {
          width: 300px;
          height: 140px;
        }

        .title {
          width: 300px;
          word-break: break-all;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden
        }
      }

      display: grid;
      grid-template-columns:repeat(3, 1fr);
    }

    .artist_list {
      display: grid;
      grid-template-columns: repeat(5, 1fr);

      .item_container {
        margin: 5px 0;

        .item {
          width: 150px;
          height: 150px;
        }

        .title {
          width: 150px;
          display: inline-block;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden
        }
      }
    }
  }
}</style>
