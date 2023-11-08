<template>
  <div class="loading" v-if="!complete">
    <el-icon class="is-loading">
      <Loading />
    </el-icon>
    正在加载
  </div>
  <div v-if="complete && dataok">
    <el-table v-if="radiolist" :show-header="false" :data="radiolist"
      style="width:100%;cursor:default;border-top-style:solid;border-top-color:#BBBBBB;border-top-width:1px;" stripe lazy
      class="list">
      <el-table-column width="80">
        <template v-slot="{ row }">
          <Myitem :shadow="false" :imgurl="`${row.picUrl}?param=60y60`" :routemode="true"
            :router="{ name: 'radiodetail', params: { id: row.id } }" class="cover"></Myitem>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip min-width="120">
        <template v-slot="{ row }">
          <mytitle :routemode="true" :router="{ name: 'radiodetail', params: { id: row.id } }">{{ row.name }}</mytitle>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip min-width="60">
        <template v-slot="{ row }">
          <div class="text_table"><svg-icon iconClass="bx-play" />
            <playnumber :number="row.playCount" />
          </div>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip min-width="60">
        <template v-slot="{ row }">
          <span class="text_table">声音{{ row.programCount }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip min-width="60">
        <template v-slot="{ row }">
          <mytitle size="small" color="light" :routemode="true"
            :router="{ name: 'userprofile', params: { id: row.dj.userId } }">
            by:{{ row.dj.nickname }}</mytitle>
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

import { reqSearch } from '@/api/music';
import { onActivated } from '@vue/runtime-core';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
export default {

  name: 'Radio',
  setup() {
    const route = useRoute();
    const store = useStore();
    let complete = ref(false);
    let dataok = ref(true);
    let radiolist = ref([])
    let keyword = ref('')
    let total = ref(0);
    let currentpage = ref(1);
    async function currentchange() {
      try {
        store.commit('LOAD')
        let result = await reqSearch(1009, keyword.value, 20, (currentpage.value - 1) * 20);
        if (result.code === 200) {
          radiolist.value = result.result.djRadios;
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
    async function getsearchradio(keyword, limit, offset) {
      let result = await reqSearch(1009, keyword, limit, offset);
      if (result.code === 200) {
        radiolist.value = result.result.djRadios;
        total.value = result.result.djRadiosCount;
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
            await getsearchradio(route.query.keyword, 20, 0);
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
    return { radiolist, complete, dataok, total, currentpage, currentchange }
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
  .cover {
    width: 60px;
    height: 60px;
  }

  .text_table {
    cursor: default;
    color: #BBBBBB;
    font-size: 12px;
  }
}
</style>