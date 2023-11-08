<template>
  <el-scrollbar>
    <div class="loading" v-if="!complete">
      <el-icon class="is-loading">
        <Loading />
      </el-icon>
      正在加载
    </div>
    <el-dialog v-model="dialogTableVisible" title="提示">
      <span style="margin-left:20px">声音相关功能暂时不可使用</span>
      <template #footer>
        <el-button type="danger" round plain @click="dialogTableVisible = false">确认</el-button>
      </template>
    </el-dialog>
    <div v-if="complete && dataok" class="router_container">
      <div class="list_header">
        <el-image :src="`${radiodetail.picUrl}?param=180y180`" class="cover">
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
            <tags class="t">播客</tags>
            <div class="list_name">{{ radiodetail.name }}</div>
          </div>
          <div class="owner">
            <myitem :shadow="false" :hoveranim="false" :routemode="true"
              :router="{ name: 'userprofile', params: { id: radiodetail.dj.userId } }"
              :imgurl="`${radiodetail.dj.avatarUrl}?param=24y24`" class="avatar" />
            <mytitle :routemode="true" :router="{ name: 'userprofile', params: { id: radiodetail.dj.userId } }"
              class="username">
              {{ radiodetail.dj.nickname }}</mytitle>
          </div>
          <div class="button_group">
            <el-button @click="adddjandplay(null)" type="danger" size="small" icon="CaretRight" round>播放全部</el-button>
            <el-button v-if="issub" @click="subradio(radiodetail, 0)" type="info" size="small" icon="FolderChecked" plain
              round>已收藏</el-button>
            <el-button v-else @click="subradio(radiodetail, 1)" type="info" size="small" icon="FolderAdd" plain
              round>收藏</el-button>
            <el-button @click="adddjandplay(null)" type="info" size="small" icon="Plus" plain round>添加全部至播放列表</el-button>
          </div>
          <div class="desc">
            <tags v-if="radiodetail.secondCategory" class="row_tag">{{ radiodetail.secondCategory }}</tags>
            <span radiodetail.desc class="brief">{{ radiodetail.desc }}</span>
          </div>
        </div>
      </div>
      <el-tabs v-model="activeName" tab-position="top" class="el-tabs">
        <el-tab-pane :label="`声音(${voicecount})`" name="list" class="tabs_list">
          <el-table v-if="radiolist" :show-header="false" :data="radiolist"
            style="width:100%;cursor:default;border-top-style:solid;border-top-color:#BBBBBB;border-top-width:1px;" stripe
            lazy class="list" @row-dblclick="adddjandplay">
            <el-table-column width="80">
              <template v-slot="{ row }">
                <Myitem @click="adddjandplay(row)" :shadow="false" :imgurl="`${row.coverUrl}?param=60y60`" class="cover">
                </Myitem>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="180">
              <template v-slot="{ row }">
                <mytitle hover="default">{{ row.name }}</mytitle>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="60">
              <template v-slot="{ row }">
                <div class="text_table"><svg-icon iconClass="bx-play" />
                  <playnumber :number="row.listenerCount" />
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="60">
              <template v-slot="{ row }">
                <span class="text_table"><svg-icon iconClass="bx-like"></svg-icon>
                  <playnumber :number="row.likedCount" />
                </span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="60">
              <template v-slot="{ row }">
                <timetransform class="text_table" :time="row.createTime" />
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="50">
              <template v-slot="{ row }">
                <duration class="text_table" :time="row.duration" />
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-else description="没有找到数据"></el-empty>
        </el-tab-pane>
        <el-tab-pane lazy :label="`收藏者(${subcount})`" name="collector">
          <div v-if="radiosubscriber" class="collector">
            <div class="user" v-for="(item, index) in radiosubscriber" :key="index">
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

        </el-tab-pane>
      </el-tabs>
    </div>
    <el-empty v-else-if="complete && !dataok" description="暂时没有数据"></el-empty>
  </el-scrollbar>
</template>

<script>
import { ref } from '@vue/reactivity'
import { ElMessage } from 'element-plus';

import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { reqRadioprogram, reqRadiosubscriber, reqRadiodetail, reqSubradiolist } from '@/api/music'
import { computed, onActivated } from '@vue/runtime-core';
import { useStore } from 'vuex';
export default {
  name: 'Radiodetail',
  setup() {
    const store = useStore();
    const route = useRoute();
    let complete = ref(false);
    let dataok = ref(true);
    let activeName = ref('list');
    let radiolist = ref({})
    let radiosubscriber = ref([])
    let radiodetail = ref({})
    let voicecount = ref(0)
    let subcount = ref(0)
    let id = ref(null)
    let islogin = computed(() => store.state.islogin)
    let subradiolist = computed(() => store.state.radiolist)
    let isradiolist = computed(() => store.state.isradiolist);
    let dialogTableVisible = ref(false);
    function adddjandplay(row) {
      dialogTableVisible.value = true;
    }
    async function getsubradiolist() {
      if (!isradiolist.value && islogin.value) {
        let result = await reqSubradiolist();
        if (result.code === 200) {
          store.commit('SUBRADIOLIST', result)
          return true;
        }
        else return Promise.reject();
      }
      else return true;
    }
    function subradio(radio, t) {
      store.dispatch('subradio', { radio, t })
    }
    let issub = computed(() => {
      if (radiodetail.value.id) {
        if (subradiolist.value.some((num) => num.id === radiodetail.value.id)) return true;
        else return false;
      }
    })
    async function getradioprogram(id, limit, offset) {
      let result = await reqRadioprogram(id, limit, offset);
      if (result.code === 200) {
        radiolist.value = result.programs
        voicecount.value = result.count;
        return true;
      }
      else return Promise.reject();
    }
    async function getradiosubscriber(id, time = -1) {
      let result = await reqRadiosubscriber(id, time);
      if (result.code === 200) {
        radiosubscriber.value = result.subscribers;
        return true;
      }
      else return Promise.reject();
    }
    async function getradiodetail(id) {
      let result = await reqRadiodetail(id);
      if (result.code === 200) {
        radiodetail.value = result.data;
        subcount.value = result.data.subCount;
        return true;
      }
      else return Promise.reject();
    }
    onActivated(async () => {
      try {
        if (id.value != route.params.id) {
          complete.value = false;
          dataok.value = true;
          if (route.params.id) {
            await getradiodetail(route.params.id)
            await getradioprogram(route.params.id, 500, 0);
            await getradiosubscriber(route.params.id);
            await getsubradiolist();
            id.value = route.params.id
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
        if (to.name === 'radiodetail') {
          complete.value = false;
          dataok.value = true;
          if (to.params.id) {
            await getradiodetail(to.params.id)
            await getradioprogram(to.params.id, 30, 0);
            await getradiosubscriber(to.params.id)
            id.value = to.params.id
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
    return { issub, subradio, dialogTableVisible, adddjandplay, voicecount, subcount, radiodetail, radiosubscriber, radiolist, dataok, complete, activeName }
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

    .desc {
      display: flex;
      align-items: center;

      .row_tag {
        font-size: 12px;
      }
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
        margin-left: 5px;
      }
    }
  }

  .el-tabs {
    align-self: center;
    width: 95%;

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
          border-radius: 50px;
        }
      }

    }
  }
}
</style>
