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
        <el-image :src="`${musiclistinfo.coverImgUrl}?param=180y180`" class="cover">
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
            <tags class="t">歌单</tags>
            <div class="list_name">{{ musiclistinfo.name }}</div>
          </div>
          <div class="owner">
            <myitem :shadow="false" :hoveranim="false" :routemode="true"
              :router="{ name: 'userprofile', params: { id: musiclistinfo.creator.userId } }"
              :imgurl="`${musiclistinfo.creator.avatarUrl}?param=24y24`" class="avatar" />
            <mytitle :routemode="true" :router="{ name: 'userprofile', params: { id: musiclistinfo.creator.userId } }"
              class="username">{{ musiclistinfo.creator.nickname }}</mytitle>
            <timetransform :time="musiclistinfo.createTime" class="created_time"></timetransform>
          </div>
          <div v-if="musiclistinfo.tags[0]" class="tag">
            <span class="tags">标签:</span>
            <tags v-for="(item, index) in musiclistinfo.tags" :key="index" class="t">{{ item }}</tags>
          </div>
          <div class="button_group">
            <el-button @click="addallandplay" type="danger" size="small" icon="CaretRight" round>播放全部</el-button>
            <el-button v-if="increatelist && incollectlist" type="info" size="small" icon="FolderAdd"
              @click="clickcollectit(musiclistinfo, 1)" plain round>收藏</el-button>
            <el-button v-else-if="increatelist" type="info" size="small" icon="FolderChecked"
              @click="clickcollectit(musiclistinfo, 2)" plain round>已收藏</el-button>
            <el-button @click="addall" type="info" size="small" icon="Plus" plain round>添加全部至播放列表</el-button>
          </div>
          <div class="detail">歌曲:{{ musiclistinfo.trackCount }} 播放:
            <playnumber :number="musiclistinfo.playCount" />
          </div>
          <el-tooltip v-if="musiclistinfo.description" class="box-item" effect="dark" :content="musiclistinfo.description"
            placement="bottom">
            <div v-if="musiclistinfo.description" class="brief">简介:{{ musiclistinfo.description }}</div>
          </el-tooltip>
        </div>
      </div>
      <el-tabs v-model="activeName" tab-position="top" class="el-tabs">
        <el-tab-pane label="歌曲列表" name="list" class="tabs_list">
          <el-table v-if="songlist.length" :data="songlist" style="width:100%;cursor:default" stripe lazy class="list"
            @row-dblclick="addmusicandplay">
            <el-table-column width="50" class="index">
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
                <span class="text_title" :class="{ 'playon': nowplaymusic && row.id === nowplaymusic.id }">{{ row.name
                }}<span v-if="row.alia[0]" class="sub_info">({{ row.alia[0] }})</span></span>
                <tags class="row_tag" v-if="row.fee === 1">VIP</tags>
                <tags class="row_tag" v-if="row.fee === 8 || row.fee === 1">SQ</tags>
                <tags class="row_tag" v-if="row.mv != 0" :routemode="true"
                  :router="{ name: 'videodetail', params: { id: row.mv, type: 'mv' } }">MV</tags>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="歌手" min-width="100">
              <template v-slot="{ row }">
                <mytitle v-for="(artist, i) in row.ar" :class="{ 'playon': nowplaymusic && row.id === nowplaymusic.id }"
                  :routemode="true" :router="{ name: 'artistdetail', params: { id: artist.id } }" size="small"
                  color="light" :key="i">{{ i > 0 ? '/' : '' }}{{ artist.name }}</mytitle>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="专辑" min-width="60">
              <template v-slot="{ row }">
                <mytitle size="small" color="light" :class="{ 'playon': nowplaymusic && row.id === nowplaymusic.id }"
                  :routemode="true" :router="{ name: 'albumsdetail', params: { id: row.al.id } }">{{ row.al.name }}
                </mytitle>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="40" label="时长">
              <template v-slot="{ row }">
                <duration class="table_time" :class="{ 'playon': nowplaymusic && row.id === nowplaymusic.id }"
                  :time="row.dt">
                </duration>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-else description="没有找到数据"></el-empty>
        </el-tab-pane>
        <el-tab-pane lazy :label="`评论(${musiclistinfo.commentCount})`" name="comment">
          <div class="comment">
            <part v-if="hotcomment.length" title="精彩评论">
              <Comments :type="2" :id="id" :commentslist="hotcomment"></Comments>
              <!-- <span v-for="(item,index) in hotcomment" :key="index">{{item}}</span> -->
            </part>
            <part v-if="comment.length" title="最新评论">
              <Comments :type="2" :id="id" :commentslist="comment"></Comments>
              <el-pagination :page-size="20" layout="prev, pager, next" :pager-count="7" :total="total"
                :hide-on-single-page="true" v-model:current-page="currentpage" @current-change="currentchange"
                class="pagination" />
            </part>
            <el-empty v-if="!comment.length && !hotcomment.length" description="暂时没有评论"></el-empty>
          </div>
        </el-tab-pane>
        <el-tab-pane lazy label="收藏者" name="collector">
          <div v-if="musiclistsubsribers.length" class="collector">
            <div class="user" v-for="(item, index) in musiclistsubsribers" :key="index">
              <myitem :hoveranim="false" :shadow="false" :routemode="true"
                :router="{ name: 'userprofile', params: { id: item.userId } }" :imgurl="`${item.avatarUrl}?param=90y90`"
                class="avater"></myitem>
              <div class="info">
                <mytitle :routemode="true" :router="{ name: 'userprofile', params: { id: item.userId } }">{{ item.nickname
                }}
                </mytitle>
                <svg-icon v-if="item.gender === 1" class="gender male" iconClass="bx-male-sign" /><svg-icon
                  class="gender female" v-else-if="item.gender === 2" iconClass="bx-female-sign" />
              </div>
            </div>
          </div>
          <el-empty v-else description="没有找到数据"></el-empty>
          <el-pagination :page-size="20" layout="prev, pager, next" :pager-count="7" :total="totalsub"
            :hide-on-single-page="true" v-model:current-page="currentsubpage" @current-change="currentsubchange"
            class="pagination" />
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
import { reqMusiclistdetail, reqMusiclistsubscribers, reqMusiclistcomment, reqSongdetail } from '@/api/music'
import { computed, onActivated, watch } from '@vue/runtime-core';
import { useStore } from 'vuex';
import __ from 'lodash'
export default {
  components: {
    Comments,
  },
  name: 'Musiclistdetail',
  setup() {
    const store = useStore()
    const route = useRoute();
    let complete = ref(false);
    let dataok = ref(true);
    let activeName = ref('list');
    let musiclistinfo = ref({})
    let musiclistsubsribers = ref([])
    let comment = ref([])
    let hotcomment = ref([])
    let likelist = computed(() => store.state.likelist)
    let createlist = computed(() => store.state.playlist)
    let collectlist = computed(() => store.state.collectlist)
    let musiclikeinfolist = ref([])
    let nowplaymusic = computed(() => store.getters.nowplaymusic);
    let total = ref(0);
    let currentpage = ref(1);
    let id = ref(null);
    let songlist = ref([])
    let nextlock = computed(() => store.state.nextlock)
    let lyriclock = computed(() => store.state.lyriclock)
    let commentlock = computed(() => store.state.commentlock)
    function addall() {
      if (!nextlock.value && !lyriclock.value && !commentlock.value) {
        store.commit('LOCK')
        store.dispatch('addall', songlist.value);
      }
    }
    function addallandplay() {
      if (!nextlock.value && !lyriclock.value && !commentlock.value) {
        store.commit('LOCK')
        store.dispatch('addallandplay', songlist.value)
      }
    }
    async function currentchange() {
      try {
        store.commit('LOAD')
        let result = await reqMusiclistcomment(id.value, 20, (currentpage.value - 1) * 20);
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
    let totalsub = ref(0);
    let currentsubpage = ref(1);
    async function currentsubchange() {
      try {
        store.commit('LOAD')
        let result = await reqMusiclistsubscribers(id.value, 20, (currentsubpage.value - 1) * 20);
        if (result.code === 200) {
          musiclistsubsribers.value = result.subscribers;
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
    let increatelist = computed(() => {
      if (createlist.value.some((num) => num.id === musiclistinfo.value.id)) return false
      else {
        return true;

      }
    })
    let incollectlist = computed(() => {
      if (collectlist.value.some((num) => num.id === musiclistinfo.value.id)) return false
      else return true;
    })
    function likeit(id, like) {
      store.dispatch('likeit', { id: id, like: like })
    }
    function collectit(music, like) {
      store.dispatch('collectit', { music: music, like: like })
    }
    const clickcollectit = __.throttle(collectit, 3000)
    const clicklikeit = __.throttle(likeit, 3000)

    watch([likelist, musiclistinfo], () => {
      if (musiclistinfo.value.trackIds) {
        let arr = [];
        for (let x of musiclistinfo.value.trackIds) {
          if (likelist.value.some((num) => x.id === num)) {
            arr.push(true);
          }
          else arr.push(false);
        }
        musiclikeinfolist.value = arr;
      }
    });
    async function getmusiclistdetail(id) {
      let result = await reqMusiclistdetail(id);
      if (result.code === 200) {
        musiclistinfo.value = result.playlist;
        if (musiclistinfo.value.trackIds) {
          let idsarr = '';
          for (let x in musiclistinfo.value.trackIds) {
            if (x > 0) {
              idsarr = idsarr + ',' + musiclistinfo.value.trackIds[x].id;
            }
            else {
              idsarr = idsarr + musiclistinfo.value.trackIds[x].id;
            }
          }
          let songsresult = await reqSongdetail(idsarr)
          if (songsresult.code === 200) {
            songlist.value = songsresult.songs;
          }
          else throw Error('获取歌曲列表失败')
        }
        return true;
      }
      else return Promise.reject();
    }
    async function getmusiclistcomment(id, limit, offset) {
      let result = await reqMusiclistcomment(id, limit, offset);
      if (result.code === 200) {
        comment.value = result.comments;
        hotcomment.value = result.hotComments;
        total.value = result.total;
        currentpage.value = 1;
        return true;
      }
      else return Promise.reject();
    }
    async function getmusiclistsubscribers(id, limit, offset) {
      let result = await reqMusiclistsubscribers(id, limit, offset);
      if (result.code === 200) {
        musiclistsubsribers.value = result.subscribers;
        totalsub.value = result.total
        currentsubpage.value = 1;
        return true;
      }
      else return Promise.reject();
    }
    onActivated(async () => {
      try {
        if (route.params.id != id.value) {
          complete.value = false;
          dataok.value = true;
          if (route.params.id) {
            await getmusiclistdetail(route.params.id);
            await getmusiclistsubscribers(route.params.id, 20, 0);
            await getmusiclistcomment(route.params.id, 20, 0)
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
        if (to.name === 'musiclistdetail') {
          complete.value = false;
          dataok.value = true;
          if (to.params.id) {
            await getmusiclistdetail(to.params.id);
            await getmusiclistsubscribers(to.params.id, 20, 0);
            await getmusiclistcomment(to.params.id, 20, 0)
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
    return { addmusicandplay, addall, songlist, addallandplay, addmusic, nowplaymusic, currentsubpage, currentsubchange, totalsub, total, currentpage, currentchange, id, route, clickcollectit, incollectlist, increatelist, likelist, musiclikeinfolist, comment, hotcomment, musiclistsubsribers, musiclistinfo, dataok, complete, activeName, clicklikeit }
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

      .tag {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 10PX;

        .tags {
          font-size: 14px;
          color: #676767;
        }

        .t {
          margin: 0 5px;
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

        .created_time {
          font-size: 12px;
          cursor: default;
          color: #676767;
          margin-left: 10px;
        }
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

      .text_title {
        font-size: 12px;
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

    .collector {
      display: grid;
      grid-template-columns: repeat(2, 1fr);

      .user {
        display: flex;
        align-items: center;
        margin: 10px 0;

        .info {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-left: 10px;

          .gender {
            border-radius: 50px;
            border-width: 1px;
            border-style: solid;
            margin-left: 5px;
          }

          .male {
            border-color: #56B0DA;
            color: #56B0DA;
          }

          .female {
            border-color: #E8518E;
            color: #E8518E;
          }
        }

        .avater {
          cursor: pointer;
          width: 90px;
          height: 90px;
          background-color: yellow;
          border-radius: 50px;
        }
      }

    }
  }
}</style>
