<template>
  <div class="loading" v-if="!complete">
    <el-icon class="is-loading">
      <Loading />
    </el-icon>
    正在加载
  </div>
  <div v-if="complete && dataok">
    <el-table v-if="musiclist.length" :data="musiclist" style="width:100%;cursor:default" stripe lazy class="list"
      row-key="number" @row-dblclick="addmusicandplay">
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
          <span class="text_title" :class="{ 'playon': nowplaymusic && row.id === nowplaymusic.id }" @click="test">{{
            row.name }}<span v-if="row.alia[0]" class="sub_info">({{ row.alia[0] }})</span></span>
          <tags class="row_tag" v-if="row.fee === 1">VIP</tags>
          <tags class="row_tag" v-if="row.fee === 8 || row.fee === 1">SQ</tags>
          <tags class="row_tag" v-if="row.mvid != 0" :routemode="true"
            :router="{ name: 'videodetail', params: { id: row.mv, type: 'mv' } }">MV</tags>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="歌手" min-width="100">
        <template v-slot="{ row }">
          <mytitle :class="{ 'playon': nowplaymusic && row.id === nowplaymusic.id }" v-for="(artist, i) in row.ar"
            :routemode="true" :router="{ name: 'artistdetail', params: { id: artist.id } }" size="small" color="light"
            :key="i">
            {{ i > 0 ? '/' : '' }}{{ artist.name }}</mytitle>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="专辑" min-width="60">
        <template v-slot="{ row }">
          <mytitle :class="{ 'playon': nowplaymusic && row.id === nowplaymusic.id }" size="small" color="light"
            :routemode="true" :router="{ name: 'albumsdetail', params: { id: row.al.id } }">{{ row.al.name }}</mytitle>
        </template>
      </el-table-column>
      <el-table-column prop="time" show-overflow-tooltip min-width="40" label="时长">
        <template v-slot="{ row }">
          <duration :class="{ 'playon': nowplaymusic && row.id === nowplaymusic.id }" class="table_time" :time="row.dt">
          </duration>
        </template>
      </el-table-column>
    </el-table>
    <el-empty v-else description="没有找到数据"></el-empty>
    <el-pagination :page-size="20" layout="prev, pager, next" :pager-count="7" :total="total" :hide-on-single-page="true"
      v-model:current-page="currentpage" @current-change="currentchange" class="pagination" />
  </div>
  <el-empty v-else-if="complete && !dataok" description="暂时没有数据"></el-empty>
</template>

<script>
import { ref } from '@vue/reactivity'
import { ElMessage } from 'element-plus';

import { computed, onActivated, watch } from '@vue/runtime-core';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { reqSearch } from '@/api/music'
import { useStore } from 'vuex';
import __ from 'lodash'
export default {

  name: 'Music',
  setup() {
    let complete = ref(false);
    let dataok = ref(true);
    const route = useRoute();
    const store = useStore();
    let musiclist = ref({});
    let keyword = ref('')
    let musiclikeinfolist = ref([])
    let likelist = computed(() => store.state.likelist)
    let total = ref(0);
    let currentpage = ref(1);
    let nowplaymusic = computed(() => store.getters.nowplaymusic)
    let nextlock = computed(() => store.state.nextlock)
    let lyriclock = computed(() => store.state.lyriclock)
    let commentlock = computed(() => store.state.commentlock)
    async function currentchange() {
      try {
        store.commit('LOAD')
        let result = await reqSearch(1, keyword.value, 20, (currentpage.value - 1) * 20);
        if (result.code === 200) {
          musiclist.value = result.result.songs;
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
    function likeit(id, like) {
      store.dispatch('likeit', { id: id, like: like })
    }
    const clicklikeit = __.throttle(likeit, 3000);
    watch([likelist, musiclist], () => {
      let arr = [];
      if (musiclist.value.length) {
        for (let x of musiclist.value) {
          if (likelist.value.some((num) => x.id === num)) {
            arr.push(true);
          }
          else {
            arr.push(false);
          }
        }
        musiclikeinfolist.value = arr;
      }
    });
    async function getsearchmusic(keyword, limit, offset) {
      let result = await reqSearch(1, keyword, limit, offset);
      if (result.code === 200) {
        musiclist.value = result.result.songs;
        total.value = result.result.songCount;
        currentpage.value = 1;
        return true;
      }
      else return Promise.reject();
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
    onBeforeRouteUpdate(async (to) => {
      try {
        if (to.name === 'searchmusic') {
          if (to.query.keyword) {
            complete.value = false;
            dataok.value = true;
            await getsearchmusic(to.query.keyword, 20, 0);
            keyword.value = to.query.keyword;
          }
          else throw Error('没有关键字')
        }
      }
      catch (err) {
        ElMessage.error('获取数据失败');
        console.log(err.message);
        dataok.value = false;
      }
      finally {
        complete.value = true;
      }
    })
    onActivated(async () => {
      try {
        if (route.query.keyword) {
          if (route.query.keyword != keyword.value) {
            complete.value = false;
            dataok.value = true;
            await getsearchmusic(route.query.keyword, 20, 0);
            keyword.value = route.query.keyword;
          }
        }
        else throw Error('没有关键字')
      }
      catch (err) {
        ElMessage.error('获取数据失败');
        console.log(err.message);
        dataok.value = false;
      }
      finally {
        complete.value = true;
      }
    })
    return { musiclikeinfolist, addmusic, nowplaymusic, currentpage, currentchange, total, addmusicandplay, clicklikeit, complete, dataok, musiclist, likeit }
  }
}
</script>


<style lang="less" scoped>
.pagination {
  width: 100%;
  display: flex;
  justify-content: center;
}

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
</style>