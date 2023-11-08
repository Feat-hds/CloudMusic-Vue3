<template>
  <div class="loading" v-if="!complete">
    <el-icon class="is-loading">
      <Loading />
    </el-icon>
    正在加载
  </div>
  <div v-if="complete && dataok">
    <el-table v-if="artistlist" :show-header="false" :data="artistlist"
      style="width:100%;cursor:default;border-top-style:solid;border-top-color:#BBBBBB;border-top-width:1px;" stripe lazy
      class="list">
      <el-table-column width="80">
        <template v-slot="{ row }">
          <Myitem :shadow="false" :routemode="true" :router="{ name: 'artistdetail', params: { id: row.id } }"
            :imgurl="`${row.picUrl}?param=60y60`" class="cover"></Myitem>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip min-width="60">
        <template v-slot="{ row }">
          <mytitle :routemode="true" :router="{ name: 'artistdetail', params: { id: row.id } }">{{ row.name }}<span
              v-if="row.alias[0]" class="sub_info">({{ row.alias[0] }})</span></mytitle>
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

import { reqSearchbrief } from '@/api/music'
import { onActivated } from '@vue/runtime-core';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
export default {

  name: 'Artist',
  setup() {
    const store = useStore();
    let complete = ref(false);
    let dataok = ref(true);
    let artistlist = ref([])
    const route = useRoute();
    let keyword = ref('')
    let total = ref(0);
    let currentpage = ref(1);
    async function currentchange() {
      try {
        store.commit('LOAD')
        let result = await reqSearchbrief(100, keyword.value, 20, (currentpage.value - 1) * 20);
        if (result.code === 200) {
          artistlist.value = result.result.artists;
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
    async function getsearchartist(keyword, limit, offset) {
      let result = await reqSearchbrief(100, keyword, limit, offset);
      if (result.code === 200) {
        artistlist.value = result.result.artists;
        total.value = result.result.artistCount;
        currentpage.value = 1;
        return true;
      }
      else return Promise.reject();
    }

    onActivated(async () => {
      try {
        if (route.query.keyword) {
          if (route.query.keyword != keyword.value) {
            complete.value = false;
            dataok.value = true;
            await getsearchartist(route.query.keyword, 20, 0);
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

    return { artistlist, dataok, complete, total, currentchange, currentpage }
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
  .sub_info {
    color: #BBBBBB;
    font-size: 12px;
  }

  .cover {
    width: 60px;
    height: 60px;
  }

  .text {
    cursor: pointer;
    color: #616162;

    &:hover {
      color: #343434;
    }
  }
}
</style>