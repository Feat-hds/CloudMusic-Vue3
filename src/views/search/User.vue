<template>
  <div class="loading" v-if="!complete">
    <el-icon class="is-loading">
      <Loading />
    </el-icon>
    正在加载
  </div>
  <div v-if="complete && dataok">
    <el-table v-if="userlist" :show-header="false" :data="userlist"
      style="width:100%;cursor:default;border-top-style:solid;border-top-color:#BBBBBB;border-top-width:1px;" stripe lazy
      class="list">
      <el-table-column width="80">
        <template v-slot="{ row }">
          <Myitem :shadow="false" :imgurl="`${row.avatarUrl}?param=60y60`" :routemode="true"
            :router="{ name: 'userprofile', params: { id: row.userId } }" class="cover"></Myitem>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip min-width="120">
        <template v-slot="{ row }">
          <mytitle :routemode="true" :router="{ name: 'userprofile', params: { id: row.userId } }">{{ row.nickname
          }}<svg-icon v-if="row.gender === 1" class="gender male" iconClass="bx-male-sign" /><svg-icon
              class="gender female" v-else-if="row.gender === 2" iconClass="bx-female-sign" /></mytitle>
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

import { reqSearchbrief } from '@/api/music';
import { onActivated } from '@vue/runtime-core';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex'
export default {

  name: 'User',
  setup() {
    const route = useRoute();
    const store = useStore();
    let complete = ref(false);
    let dataok = ref(true);
    let userlist = ref([])
    let keyword = ref('')
    let total = ref(0);
    let currentpage = ref(1);
    async function currentchange() {
      try {
        store.commit('LOAD')
        let result = await reqSearchbrief(1002, keyword.value, 20, (currentpage.value - 1) * 20);
        if (result.code === 200) {
          userlist.value = result.result.userprofiles;
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
    async function getsearchuser(keyword, limit, offset) {
      let result = await reqSearchbrief(1002, keyword, limit, offset);
      if (result.code === 200) {
        userlist.value = result.result.userprofiles;
        total.value = result.result.userprofileCount;
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
            await getsearchuser(route.query.keyword, 20, 0);
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
    return { userlist, complete, dataok, currentpage, currentchange, total }
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
    border-radius: 30px;
  }

  .text_table {
    cursor: default;
    color: #BBBBBB;
    font-size: 12px;
  }

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
</style>