<template>
    <div class="loading" v-if="!complete">
        <el-icon class="is-loading">
            <Loading />
        </el-icon>
        正在加载
    </div>
    <div v-if="complete && dataok" class="router_container">
        <el-scrollbar>
            <part class="part" title="我的播客" :issub="true" :subtitle="`(${total})`">
                <span class="subtitle">收藏的播客</span>
                <el-table v-if="subradiolist.length" :show-header="false" :data="subradiolist"
                    style="width:100%;cursor:default;border-top-style:solid;border-top-color:#BBBBBB;border-top-width:1px;"
                    stripe lazy class="list">
                    <el-table-column width="80">
                        <template v-slot="{ row }">
                            <Myitem :shadow="false" :routemode="true" :router="{ name: 'radiodetail', params: { id: row.id } }"
                                :imgurl="`${row.picUrl}?param=60y60`" class="cover"></Myitem>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip min-width="120">
                        <template v-slot="{ row }">
                            <Mytitle :routemode="true" :router="{ name: 'radiodetail', params: { id: row.id } }">{{ row.name }}
                            </Mytitle>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip min-width="60">
                        <template v-slot="{ row }">
                            <mytitle :routemode="true" :router="{ name: 'userprofile', params: { id: row.dj.userId } }"
                                color="light" size="small">by {{ row.dj.nickname }}</mytitle>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip min-width="20">
                        <template v-slot="{ row }">
                            <span class="text">声音:{{ row.programCount }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-empty v-else>没有收藏的播客</el-empty>
                <span class="subtitle">为你推荐</span>
                <div class="artist_list">
                    <div v-for="(item, index) in djrecommend" class="item_container" :key="index">
                        <myitem :shadow="false" :imgurl="`${item.picUrl}?param=150y150`" :routemode="true"
                            :router="{ name: 'radiodetail', params: { id: item.id } }" class="item"></myitem>
                        <Mytitle :routemode="true" :router="{ name: 'radiodetail', params: { id: item.id } }" class="radio">
                            {{ item.name }}</Mytitle>
                    </div>
                </div>
            </part>
        </el-scrollbar>
    </div>
    <el-empty v-else-if="complete && !dataok" description="暂时没有数据"></el-empty>
</template>

<script>
import { ref } from '@vue/reactivity';
import { computed, onBeforeMount } from '@vue/runtime-core';
import { reqSubradiolist, reqDjrecommend } from '@/api/music'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex';
export default {
    name: 'Myradio',
    setup() {
        const store = useStore();
        let dataok = ref(true);//数据是否获取成功
        let complete = ref(false);//网络请求是否已经发送完成
        let djrecommend = ref([])
        let subradiolist = computed(() => store.state.radiolist)
        let total = computed(() => store.state.subradiototal);
        let isradiolist = computed(() => store.state.isradiolist);
        async function getsubradiolist() {
            if (!isradiolist.value) {
                let result = await reqSubradiolist();
                if (result.code === 200) {
                    store.commit('SUBRADIOLIST', result)
                    return true;
                }
                else return Promise.reject();
            }
            else return true;
        }
        async function getdjrecommend() {
            let result = await reqDjrecommend();
            if (result.code === 200) {
                djrecommend.value = result.result.slice(0, 5);
                return true;
            }
            else return Promise.reject();
        }
        onBeforeMount(async () => {
            try {
                await getsubradiolist();
                await getdjrecommend()
            }
            catch (err) {
                console.log(err)
                ElMessage.error('网络异常，获取数据失败')
                dataok.value = false;
            }
            finally {
                complete.value = true;
            }

        })
        return { total, djrecommend, dataok, complete, subradiolist }
    }
}
</script>
<style lang="less" scoped>
.router_container {
    height: 100%;

    .subtitle {
        margin: 10px 10px;
        display: block;
        font-size: 16px;
        font-weight: bold;
        color: #373737;
        cursor: default;
    }

    .part {
        .title {
            margin: 10px 10px;
            display: block;
            font-size: 16px;
            font-weight: bold;
            color: #373737;
            cursor: default;
        }

        .list {
            .cover {
                width: 60px;
                height: 60px;
            }

            .text {
                font-size: 12px;
                color: #BBBBBB;
                cursor: default;
            }
        }
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
                text-overflow: ellipsis;
                /* 文本溢出时显示省略号来代表被修剪的文本 */
                display: -webkit-box;
                /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 */
                -webkit-box-orient: vertical;
                /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 */
                -webkit-line-clamp: 2;
                /* 文本需要显示多少行 */
                overflow: hidden;
            }
        }
    }
}</style>