<template>
    <el-scrollbar>
        <div class="loading" v-if="!complete">
            <el-icon class="is-loading">
                <Loading />
            </el-icon>
            正在加载
        </div>
        <div v-if="complete && dataok" class="recommend_container">
            <div class="header_card">
                <div class="card">
                    <mytitle color="light" :routemode="true"
                        :router="{ name: 'radiotype', params: { type: cat.id, name: cat.name } }" class="cat"
                        v-for="(cat, index) in radiocatlist" :key="index"><svg-icon class="icon"
                            iconClass="bx-category" />{{ cat.name }}</mytitle>
                </div>
            </div>
            <part v-if="radiorec.length" title="推荐播客">
                <div class="recommend_list">
                    <div class="music_item" v-for="(item, index) in radiorec" :key="index">
                        <Myitem :shadow="false" :imgurl="`${item.picUrl}?param=150y150`" :routemode="true"
                            :router="{ name: 'radiodetail', params: { id: item.id } }" class="item"></Myitem>
                        <Mytitle :routemode="true" :router="{ name: 'radiodetail', params: { id: item.id } }" class="title">
                            <tags class="tags" color="gray">{{ item.secondCategory }}</tags>{{ item.name }}
                        </Mytitle>
                    </div>
                </div>
            </part>
            <part :routemode="true"
                :router="{ name: 'radiotype', params: { type: item.categoryId, name: item.categoryName } }"
                v-for="(item, index) in radiohotcat" :key="index" :title="item.categoryName">
                <div class="radio_type">
                    <div class="music_item" v-for="(radio, i) in radiolist[index]" :key="i">
                        <Myitem :shadow="false" :imgurl="`${radio.picUrl}?param=150y150`" :routemode="true"
                            :router="{ name: 'radiodetail', params: { id: radio.id } }" class="item"></Myitem>
                        <Mytitle class="title" :routemode="true"
                            :router="{ name: 'radiodetail', params: { id: radio.id } }">
                            <tags class="tags" color="gray">{{ radio.secondCategory }}</tags>{{ radio.name }}
                        </Mytitle>
                    </div>
                </div>
            </part>
        </div>
        <el-empty v-else-if="complete && !dataok" description="暂时没有数据"></el-empty>
    </el-scrollbar>
</template>

<script>
import { ref } from '@vue/reactivity';
import { computed, onBeforeMount } from '@vue/runtime-core';
import { reqRadiorecommend, reqRadiocat, reqRadiocatrec, reqRadiohotcat } from '@/api/music'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
export default {
    name: 'Radio',
    setup() {
        const store = useStore();
        let dataok = ref(true);//数据是否获取成功
        let complete = ref(false);//网络请求是否已经发送完成
        let radiocatlist = ref([])
        let radiolist = ref([])
        let radiorec = ref([])
        let radiohotcat = ref([])
        let islogin = computed(() => store.state.islogin)
        async function getdjcat() {
            let result = await reqRadiocat();
            if (result.code === 200) {
                radiocatlist.value = result.categories;
                return true;
            }
            else return Promise.reject();
        }
        async function getprivaterecdj() {
            if (islogin.value) {
                let result = await reqRadiorecommend();
                if (result.code === 200) {
                    radiorec.value = result.djRadios;
                    return true;
                }
                else return Promise.reject();
            }
        }
        async function getdjrec(type) {
            let result = await reqRadiocatrec(type);
            if (result.code === 200) {
                let arr = result.djRadios.slice(0, 5);
                radiolist.value.push(arr);
                return true;
            }
            else return Promise.reject();
        }
        async function getdjhotcat() {
            let result = await reqRadiohotcat();
            if (result.code === 200) {
                radiohotcat.value = result.data.slice(0, 6);
                return true;
            }
            else return Promise.reject();
        }
        onBeforeMount(async () => {
            try {
                await getprivaterecdj();
                await getdjhotcat()
                await getdjcat();
                for (let x of radiohotcat.value) {
                    await getdjrec(x.categoryId);
                }
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

        return { radiorec, radiohotcat, radiocatlist, radiolist, dataok, complete }
    }
}
</script>

<style lang="less" scoped>
.recommend_container {
    width: 100%;
    height: 100%;

    .header_card {
        width: 100%;
        display: flex;
        justify-content: center;

        .card {
            background-color: #FEF4F4;
            border-radius: 10px;
            width: 600px;
            padding: 20px 10px;
            display: grid;
            grid-template-columns: repeat(5, 1fr);

            .icon {
                color: #EC4141;
                margin-right: 5px;
            }
        }
    }

    .recommend_list {
        .music_item {
            margin: 5px 0;
            flex-shrink: 0;
        }

        .item {
            width: 150px;
            height: 150px;
            flex-shrink: 0;
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

        display: grid;
        grid-template-columns: repeat(5, 1fr);
    }

    .radio_type {
        .music_item {
            margin: 5px 0;
            flex-shrink: 0;
        }

        .item {
            width: 150px;
            height: 150px;
            flex-shrink: 0;
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

        display: grid;
        grid-template-columns: repeat(5, 1fr);
    }
}

.test {
    background-color: black;
    width: 500px;
    height: 200px;
}</style>