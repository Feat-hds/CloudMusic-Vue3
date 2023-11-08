<template>
  <el-scrollbar>
    <part title="最近播放" :issub="complete && dataok" :subtitle="`最近${musiclist.total}首`">
      <el-button @click="addallandplay" icon="CaretRight" type="danger" round>播放全部</el-button>
      <el-button @click="addall" icon="Plus" type="info" round>添加全部到列表</el-button>
      <div class="loading" v-if="!complete">
        <el-icon class="is-loading">
          <Loading />
        </el-icon>
        正在加载
      </div>
      <el-table v-if="complete && dataok" :data="musiclist.list" style="width:100%;cursor:default" stripe lazy class="list"
        @row-dblclick="addmusicandplay">
        <el-table-column width="50" type="index" class="index">
          <template v-slot="{ row, $index }">
            <span class="text_title" :class="{ 'playon': nowplaymusic && row.data.id === nowplaymusic.id }">{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column width="40" type="index" class="index">
          <template v-slot="{ row }">
            <svg-icon @click="addmusic(row)" style="margin-left:10px" iconClass="bx-plus" class="icon"></svg-icon>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="音乐标题" min-width="160">
          <template v-slot="{ row }">
            <span class="text_title"
              :class="{ 'playon': nowplaymusic && row.data.id === nowplaymusic.id }">{{ row.data.name }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="歌手" min-width="60">
          <template v-slot="{ row }">
            <mytitle size="small" color="light" :class="{ 'playon': nowplaymusic && row.data.id === nowplaymusic.id }"
              :routemode="true" :router="{ name: 'artistdetail', params: { id: artist.id } }"
              v-for="(artist, index) in row.data.ar" :key="index">{{ index > 0 ? '/' : '' }}{{ artist.name }}</mytitle>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip min-width="60" label="播放时间">
          <template v-slot="{ row }">
            <Timetransform class="sub_title" :class="{ 'playon': nowplaymusic && row.data.id === nowplaymusic.id }"
              :time="row.playTime" />
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-else-if="complete && !dataok" description="暂时没有数据"></el-empty>
    </part>
  </el-scrollbar>
</template>

<script>
import { computed, onBeforeMount, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { reqRecentsong } from '@/api/music'
import Timetransform from '@/components/Timetransform.vue'
import { useStore } from 'vuex'
export default {
  name: 'Lastestplay',
  components: {
    Timetransform,
  },
  setup() {
    const store = useStore();
    let dataok = ref(true);//数据是否获取成功
    let complete = ref(false);//网络请求是否已经发送完成
    let musiclist = ref([])
    let nowplaymusic = computed(() => store.getters.nowplaymusic)
    let nextlock = computed(() => store.state.nextlock)
    let lyriclock = computed(() => store.state.lyriclock)
    let commentlock = computed(() => store.state.commentlock)
    function addall() {
      if (!nextlock.value && !lyriclock.value && !commentlock.value) {
        store.commit('LOCK')
        store.dispatch('addall', musiclist.value);
      }
    }
    function addallandplay() {
      if (!nextlock.value && !lyriclock.value && !commentlock.value) {
        store.commit('LOCK')
        store.dispatch('addallandplay', musiclist.value)
      }
    }
    function addmusicandplay(row) {
      if (!nextlock.value && !lyriclock.value && !commentlock.value) {
        store.commit('LOCK')
        store.dispatch('addmusicandplay', row.data);
      }
    }
    function addmusic(row) {
      if (!nextlock.value && !lyriclock.value && !commentlock.value) {
        store.commit('LOCK')
        store.dispatch('addmusic', row)
      }
    }
    async function getrecentsong() {
      let result = await reqRecentsong();
      if (result.code === 200) {
        musiclist.value = result.data;
        return true;
      }
      else return Promise.reject();
    }
    onBeforeMount(async () => {
      try {
        await getrecentsong();
      }
      catch (err) {
        console.log(err.message)
        ElMessage.error('网络异常，获取数据失败')
        dataok.value = false;
      }
      finally {
        complete.value = true;
      }

    })
    return { musiclist, addall, addallandplay, addmusic, nowplaymusic, addmusicandplay, dataok, complete }
  }
}
</script>

<style lang='less' scroped>
.icon {
  color: #BBBBBB;
  font-size: 20px;
  cursor: pointer;

  &:hover {
    color: #4A4A4A;
  }
}

.text_title {
  font-size: 12px;
}

.sub_title {
  cursor: default;
  font-size: 12px;
  color: #BBBBBB;
}

.playon {
  color: #EC4141;

  &:hover {
    color: #EC4141;
  }
}
</style>