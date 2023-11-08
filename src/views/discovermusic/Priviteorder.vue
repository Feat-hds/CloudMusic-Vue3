<template>
    <el-scrollbar>
        <div class="loading" v-if="!complete">
            <el-icon class="is-loading">
                <Loading />
            </el-icon>
            正在加载
        </div>
        <div v-if="complete && dataok" class="router_container">
            <part :title="islogin ? `${username}的雷达歌单` : '你的雷达歌单'">
                <div class="part first">
                    <div class="item_container" v-for="(item, index) in recommendlist" :key="index">
                        <myitem :routemode="true" :router="{ name: 'musiclistdetail', params: { id: item.id } }"
                            :imgurl="`${item.picUrl}?param=150y150`" class="item" :number="item.playCount"></myitem>
                        <Mytitle :routemode="true" :router="{ name: 'musiclistdetail', params: { id: item.id } }" class="title">
                            {{ item.name }}</Mytitle>
                    </div>
                </div>
            </part>
            <part title="推荐歌单">
                <div class="part second">
                    <div class="item_container" v-for="(item, index) in personalizedlist" :key="index">
                        <myitem :routemode="true" :router="{ name: 'musiclistdetail', params: { id: item.id } }"
                            :imgurl="`${item.picUrl}?param=150y150`" class="item" :number="item.playCount"></myitem>
                        <Mytitle :routemode="true" :router="{ name: 'musiclistdetail', params: { id: item.id } }" class="title">
                            {{ item.name }}</Mytitle>
                    </div>
                </div>
            </part>
        </div>
        <el-empty v-else-if="complete && !dataok" description="暂时没有数据"></el-empty>
    </el-scrollbar>
</template>

<script>
import { ref } from '@vue/reactivity';
import { reqDailyplaylist, reqPersonalized } from '@/api/music'
import { computed, onBeforeMount } from '@vue/runtime-core';
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex';
export default {

    name: 'Priviteorder',
    setup() {
        const store = useStore()
        let username = computed(() => store.state.username)
        let islogin = computed(() => store.state.islogin)
        let dataok = ref(true);//数据是否获取成功
        let complete = ref(false);//网络请求是否已经发送完成
        let recommendlist = ref([]);
        let personalizedlist = ref([]);
        async function getdailyplaylist() {
            let result = await reqDailyplaylist(8);
            if (result.code === 200) {
                recommendlist.value = result.recommend.slice(0, 8);
                return true;
            }
            else return Promise.reject();
        }
        async function getpersonalized() {
            let result = await reqPersonalized(30);
            if (result.code === 200) {
                personalizedlist.value = result.result;
                return true;
            }
            else return Promise.reject();
        }
        onBeforeMount(async () => {
            try {
                await getdailyplaylist();
                await getpersonalized();
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
        return { personalizedlist, username, recommendlist, islogin, dataok, complete }
    }
}
</script>
<style lang="less" scoped>
.router_container {
    .part {
        .item_container {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            margin: 5px 0;

            .item {
                width: 150px;
                height: 150px;
            }

            .title {
                width: 150px;
                word-break: break-all;
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

    .first {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
    }

    .second {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
    }

    height: calc(100vh - 204px);
}</style>