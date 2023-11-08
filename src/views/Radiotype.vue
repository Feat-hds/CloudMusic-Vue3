<template>
    <el-scrollbar @scroll="scrollhandle">
        <div class="loading" v-if="!complete">
            <el-icon class="is-loading">
                <Loading />
            </el-icon>
            正在加载
        </div>
        <div ref="container" v-if="complete && dataok" class="router_container">
            <part :title="catname">
                <div class="radiotype">
                    <div class="recommend">
                        <div class="item_container" v-for="(item, index) in radiolist" :key="index">
                            <myitem :shadow="false" :imgurl="`${item.picUrl}?param=130y130`" :routemode="true"
                                :router="{ name: 'radiodetail', params: { id: item.id } }" class="item" />
                            <div class="info">
                                <span class="title">{{ item.name }}</span>
                                <div class="brief text">{{ item.desc }}</div>
                                <div class="number text">声音:
                                    <playnumber :number="item.programCount" /> 收藏:
                                    <playnumber :number="item.subCount" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </part>
        </div>
        <el-empty v-else-if="complete && !dataok" description="暂时没有数据"></el-empty>
    </el-scrollbar>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { onActivated } from '@vue/runtime-core'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { reqRadiohottype } from '@/api/music'
import { useStore } from 'vuex'
import __ from 'lodash'
export default {
    name: 'Radiotype',
    setup() {
        const store = useStore();
        const route = useRoute();
        let type = reactive(['热门', '情感故事', '恋爱婚姻', '成长励志']);
        let radiolist = ref([]);
        let complete = ref(false);
        let dataok = ref(true);
        let catname = ref('')
        let id = ref(null)
        let more = false;
        let page = 1;
        let container = ref(null)
        async function getmore(type, limit, offset = 0) {
            let result = await reqRadiohottype(type, limit, offset)
            if (result.code === 200) {
                for (let x of result.djRadios) {
                    radiolist.value.push(x);
                }
                more = result.hasMore;
                page++;
                return true;
            }
            else return Promise.reject();
        }

        async function getdjhottype(type, limit, offset = 0) {
            let result = await reqRadiohottype(type, limit, offset);
            if (result.code === 200) {
                radiolist.value = result.djRadios;
                more = result.hasMore;
                return true;
            }
            else return Promise.reject();
        }
        async function scroll({ scrollTop }) {
            if (more) {
                if (container.value.scrollHeight < scrollTop + container.value.clientHeight + 10) {
                    try {
                        store.commit('LOAD')
                        await getmore(id.value, 30, page * 30);
                    }
                    catch (err) {
                        console.log(err)
                        ElMessage.error('网络异常，数据获取失败')
                    }
                    finally {
                        store.commit('LOADCOMPLETE')
                    }
                }
            }
        }
        const scrollhandle = __.throttle(scroll, 1000)
        onActivated(async () => {
            if (id.value != route.params.type) {
                complete.value = false;
                dataok.value = true;
                radiolist.value = [];
                try {
                    await getdjhottype(route.params.type, 30, 0);
                    catname.value = route.params.name;
                    id.value = route.params.type
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
            if (to.name === 'radiotype') {
                complete.value = false;
                dataok.value = true;
                radiolist.value = [];
                try {

                    await getdjhottype(to.params.type, 30, 0);
                    catname.value = to.params.name;
                    id.value = to.params.type
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
        return { catname, container, scrollhandle, radiolist, complete, dataok, type }
    }
}
</script>
<style lang="less" scoped>
.router_container {
    height: calc(100vh - 145px);

    .radiotype {
        .recommend {
            display: grid;
            grid-template-columns: repeat(2, 1fr);

            .item_container {
                cursor: default;
                display: flex;
                justify-content: space-between;
                margin: 10px 0;
                align-items: center;
                width: 300px;
                border-radius: 5px;

                .item {
                    flex-shrink: 0;
                    width: 130px;
                    height: 130px;
                }

                .info {
                    margin-left: 10px;
                    width: 250px;
                    display: flex;
                    justify-content: flex-start;
                    align-items: flex-start;
                    flex-direction: column;

                    .title {
                        width: 250px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        color: #676767;
                        cursor: pointer;

                        &:hover {
                            color: #373737;
                        }
                    }

                    .brief {
                        margin-top: 20px;
                        width: 250px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }

                    .text {
                        color: #BBBBBB;
                        font-size: 12px;
                    }

                    .number {
                        margin-top: 10px;
                        margin-right: 10px;
                    }

                }

            }
        }
    }

}
</style>