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
        <el-image :src="`${musiclistinfo.album.picUrl}?param=180y180`" class="cover">
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
            <tags class="t">专辑</tags>
            <div class="list_name">{{ musiclistinfo.album.name }}</div>
          </div>

          <div class="button_group">
            <el-button @click="addallandplay" type="danger" size="small" icon="CaretRight" round>播放全部</el-button>
            <el-button v-if="issub" @click="subalbum(musiclistinfo, 2)" type="info" size="small" icon="FolderChecked"
              plain round>已收藏</el-button>
            <el-button v-else @click="subalbum(musiclistinfo, 1)" type="info" size="small" icon="FolderAdd" plain
              round>收藏</el-button>

            <el-button @click="addall" type="info" size="small" icon="Plus" plain round>添加全部至播放列表</el-button>
          </div>
          <div class="owner">
            歌手:<mytitle :routemode="true"
              :router="{ name: 'artistdetail', params: { id: musiclistinfo.album.artist.id } }" class="username">{{
                musiclistinfo.album.artist.name }}</mytitle>
          </div>
          <div>时间:
            <timetransform class="created_time" :time="musiclistinfo.album.publishTime" />
          </div>
        </div>
      </div>
      <el-tabs v-model="activeName" tab-position="top" class="el-tabs">
        <el-tab-pane label="歌曲列表" name="list" class="tabs_list">
          <el-table v-if="musiclistinfo.songs.length" :data="musiclistinfo.songs" style="width:100%;cursor:default" stripe
            lazy class="list" @row-dblclick="addmusicandplay">
            <el-table-column width="50" type="index" class="index">
              <template v-slot="{ row, $index }">
                <span class="text_title" :class="{ 'playon': nowplaymusic && row.id === nowplaymusic.id }">{{ $index + 1
                }}</span>
              </template>
            </el-table-column>
            <el-table-column width="80">
              <template v-slot="{ row, $index }">
                <svg-icon v-if="musiclikeinfolist[$index]" iconClass="bxs-heart" class="icon like"
                  @click="clicklikeit(row.id, false)"></svg-icon>
                <svg-icon v-else iconClass="bx-heart" class="icon" @click="clicklikeit(row.id, true)"></svg-icon>
                <svg-icon @click="addmusic(row)" style="margin-left:10px" iconClass="bx-plus" class="icon"></svg-icon>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="标题" min-width="160">
              <template v-slot="{ row }">
                <span class="text_title" :class="{ 'playon': nowplaymusic && row.id === nowplaymusic.id }"
                  @click="test">{{ row.name }}<span v-if="row.alia[0]" class="sub_info">({{ row.alia[0] }})</span>
                  <tags class="row_tag" v-if="row.fee === 1">VIP</tags>
                  <tags class="row_tag" v-if="row.fee === 8 || row.fee === 1">SQ</tags>
                  <tags class="row_tag" v-if="row.mv != 0" :routemode="true"
                    :router="{ name: 'videodetail', params: { id: row.mv, type: 'mv' } }">MV</tags>
                </span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="歌手" min-width="100">
              <template v-slot="{ row }">
                <mytitle :class="{ 'playon': nowplaymusic && row.id === nowplaymusic.id }" v-for="(artist, i) in row.ar"
                  :routemode="true" :router="{ name: 'artistdetail', params: { id: artist.id } }" size="small"
                  color="light" :key="i">{{ i > 0 ? '/' : '' }}{{ artist.name }}</mytitle>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="专辑" min-width="60">
              <template v-slot="{ row }">
                <mytitle :class="{ 'playon': nowplaymusic && row.id === nowplaymusic.id }" size="small" color="light"
                  :routemode="true" :router="{ name: 'albumsdetail', params: { id: row.al.id } }">{{ row.al.name }}
                </mytitle>
              </template>
            </el-table-column>
            <el-table-column prop="time" show-overflow-tooltip min-width="40" label="时长">
              <template v-slot="{ row }">
                <duration :class="{ 'playon': nowplaymusic && row.id === nowplaymusic.id }" class="table_time"
                  :time="row.dt">
                </duration>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-else description="没有找到数据"></el-empty>
        </el-tab-pane>
        <el-tab-pane lazy :label="commenttotal ? `评论(${commenttotal})` : ''" name="comment">
          <div class="comment">
            <part v-if="hotcomment.length" title="精彩评论">
              <Comments :type="3" :id="id" :commentslist="hotcomment"></Comments>
              <!-- <span v-for="(item,index) in hotcomment" :key="index">{{item}}</span> -->
            </part>
            <part v-if="comment.length" title="最新评论">
              <Comments :type="3" :id="id" :commentslist="comment"></Comments>
            </part>
            <el-empty v-else description="没有找到数据"></el-empty>
            <el-pagination :page-size="20" layout="prev, pager, next" :pager-count="7" :total="total"
              :hide-on-single-page="true" v-model:current-page="currentpage" @current-change="currentchange"
              class="pagination" />
          </div>
        </el-tab-pane>
        <el-tab-pane lazy label="专辑详情" name="collector">
          <part v-if="musiclistinfo.album.description" title="专辑介绍">
            <div class="text_info">{{ musiclistinfo.album.description }}</div>
          </part>
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
import Comments from '@/components/Comments.vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { reqAlbumdetail, reqAlbumcomment, reqSubalbumlist } from '@/api/music'
import { computed, onActivated, watch } from '@vue/runtime-core';
import { useStore } from 'vuex';
import __ from 'lodash'
export default {
  components: {
    Comments,
  },
  name: 'Musicdetail',
  setup() {
    const route = useRoute();
    const store = useStore();
    let complete = ref(false);
    let dataok = ref(true);
    let activeName = ref('list');
    let nextlock = computed(() => store.state.nextlock)
    let lyriclock = computed(() => store.state.lyriclock)
    let commentlock = computed(() => store.state.commentlock)
    function addmusicandplay(row) {
      if (!nextlock.value && !lyriclock.value && !commentlock.value) {
        store.commit('LOCK')
        store.dispatch('addmusicandplay', row);
      }
    }
    function addmusic(row) {
      if (!nextlock.value && !lyriclock.value && !commentlock.value) {
        store.commit('LOCK')
        store.dispatch('addmusic', row)
      }
    }
    let likelist = computed(() => store.state.likelist)
    let musiclikeinfolist = ref([])
    let musiclistinfo = ref({})
    let comment = ref([])
    let hotcomment = ref([])
    let commenttotal = ref(0);
    let id = ref(null);
    let subalbumlist = computed(() => store.state.albumlist)
    let isalbumlist = computed(() => store.state.isalbumlist);
    let total = ref(0);
    let currentpage = ref(1);
    let nowplaymusic = computed(() => store.getters.nowplaymusic)
    let islogin = computed(() => store.state.islogin)
    function addall() {
      if (!nextlock.value && !lyriclock.value && !commentlock.value) {
        store.commit('LOCK')
        store.dispatch('addall', musiclistinfo.value.songs);
      }
    }
    function addallandplay() {
      if (!nextlock.value && !lyriclock.value && !commentlock.value) {
        store.commit('LOCK')
        store.dispatch('addallandplay', musiclistinfo.value.songs)
      }
    }
    function likeit(id, like) {
      store.dispatch('likeit', { id: id, like: like })
    }
    const clicklikeit = __.throttle(likeit, 3000)
    watch([likelist, musiclistinfo], () => {

      if (musiclistinfo.value.songs) {
        let arr = [];
        for (let x of musiclistinfo.value.songs) {
          if (likelist.value.some((num) => x.id === num)) {
            arr.push(true);
          }
          else arr.push(false);
        }
        musiclikeinfolist.value = arr;
      }
    });
    async function currentchange() {
      try {
        store.commit('LOAD')
        let result = await reqAlbumcomment(id.value, 20, (currentpage.value - 1) * 20);
        if (result.code === 200) {
          comment.value = result.comments;
          return true;
        }
        else return Promise.reject();
      }
      catch (err) {
        console.log(err)
        ElMessage.error('网络异常，获取数据失败');
      }
      finally {
        store.commit('LOADCOMPLETE')
      }
    }
    function subalbum(album, t) {
      store.dispatch('subalbum', { album, t })
    }
    async function getsubalbumlist(limit, offset) {
      if (!isalbumlist.value && islogin.value) {
        let result = await reqSubalbumlist(limit, offset);
        if (result.code === 200) {
          store.commit('SUBALBUMLIST', result)
          return true;
        }
        else return Promise.reject();
      }
      else return true;
    }
    async function getmusiclistdetail(id) {
      let result = await reqAlbumdetail(id);
      if (result.code === 200) {
        musiclistinfo.value = result;
        return true;
      }
      else return Promise.reject();
    }
    async function getmusiclistcomment(id, limit, offset) {
      let result = await reqAlbumcomment(id, limit, offset);
      if (result.code === 200) {
        comment.value = result.comments;
        hotcomment.value = result.hotComments;
        commenttotal.value = result.total;
        total.value = result.total;
        currentpage.value = 1;
        return true;
      }
      else return Promise.reject();
    }
    let issub = computed(() => {
      if (musiclistinfo.value.album) {
        if (subalbumlist.value.some((num) => num.id === musiclistinfo.value.album.id)) return true;
        else return false;
      }
    })
    onActivated(async () => {
      try {
        if (route.params.id != id.value) {
          complete.value = false;
          dataok.value = true;
          if (route.params.id) {
            await getmusiclistdetail(route.params.id);
            await getmusiclistcomment(route.params.id, 20, 0);
            await getsubalbumlist(1000, 0)
            id.value = route.params.id;
          }
          else throw Error('没有关键字')
        }
      }
      catch (err) {
        ElMessage.error('网络异常，无法获取数据')
        console.log(err)
        dataok.value = false;
      }
      finally {
        complete.value = true;
      }
    })
    onBeforeRouteUpdate(async (to) => {
      try {
        if (to.name === 'albumsdetail') {
          complete.value = false;
          dataok.value = true;
          if (to.params.id) {
            await getmusiclistdetail(to.params.id);
            await getmusiclistcomment(to.params.id, 20, 0)
            await getalbumdynamic(to.params.id)
            id.value = to.params.id;
          }
          else throw Error('没有关键字')
        }
      }
      catch (err) {
        ElMessage.error('网络异常，无法获取数据')
        console.log(err)
        dataok.value = false;
      }
      finally {
        complete.value = true;
      }
    })
    return { addmusic, subalbum, addall, addallandplay, total, musiclikeinfolist, clicklikeit, nowplaymusic, currentpage, currentchange, id, addmusicandplay, commenttotal, issub, comment, hotcomment, musiclistinfo, dataok, complete, activeName }
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

  .pagination {
    width: 100%;
    display: flex;
    justify-content: center;
  }

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

      .owner {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 10PX;

        .avatar {
          width: 24px;
          height: 24px;
          border-radius: 5px;
        }

        .username {
          margin-left: 10px;
          color: #507DAF;

          &:hover {
            color: #0B58B0;
          }
        }

      }

      .created_time {
        font-size: 12px;
        cursor: default;
        color: #BBBBBB;
        margin-top: 5px;
        margin-left: 10px;
      }

      .button_group {
        margin-top: 10px;

      }

      .detail {
        margin-top: 10px;
        font-size: 12px;
        color: #676767;
        cursor: default;
      }

      .brief {
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

  .el-tabs {
    align-self: center;
    width: 95%;

    .list {
      .row_tag {
        margin-left: 5px;
        font-size: 10px;
      }

      .sub_info {
        color: #BBBBBB;
        font-size: 12px;
      }

      .table_time {
        cursor: default;
        font-size: 12px;
        color: #BBBBBB;
      }

      .icon {
        color: #BBBBBB;
        font-size: 20px;
        cursor: pointer;

        &:hover {
          color: #4A4A4A;
        }
      }

      .like {
        color: #EC4141;

        &:hover {
          color: #D73535;
        }
      }

      .playon {
        color: #EC4141;

        &:hover {
          color: #EC4141;
        }
      }
    }

    .comment {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 800px;
    }

    .text_info {
      color: #616162;
      font-size: 14px;
      text-indent: 2em;
      cursor: default;
    }
  }
}</style>
