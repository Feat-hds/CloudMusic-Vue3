import { createRouter, createWebHashHistory, } from "vue-router";
import store from '@/store/index.js'
import { ElMessage } from "element-plus";


const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
            path: '/discovermusic',
            name: 'discovermusic',
            redirect: '/discovermusic/priviterecommend',
            children: [{
                    path: 'priviterecommend',
                    name: 'priviterecommend',
                    component: () =>
                        import ('@/views/discovermusic/Priviterecommend.vue'),
                },
                {
                    path: 'priviteorder',
                    name: 'priviteorder',
                    component: () =>
                        import ('@/views/discovermusic/Priviteorder.vue'),
                },
                {
                    path: 'rank',
                    name: 'rank',
                    component: () =>
                        import ('@/views/discovermusic/Rank.vue'),
                },
                {
                    path: 'musiclist',
                    name: 'musiclist',
                    component: () =>
                        import ('@/views/discovermusic/Musiclist.vue'),
                },
                {
                    path: 'artist',
                    name: 'artist',
                    component: () =>
                        import ('@/views/discovermusic/Artist.vue'),
                },
                {
                    path: 'newestmusic',
                    name: 'newestmusic',
                    redirect: '/discovermusic/newestmusic/topsong',
                    component: () =>
                        import ('@/views/discovermusic/Newestmusic.vue'),
                    children: [{
                            path: 'topsong',
                            name: 'topsong',
                            component: () =>
                                import ('@/views/discovermusic/newestmusic/Topsong.vue')
                        },
                        {
                            path: 'topalbum',
                            name: 'topalbum',
                            component: () =>
                                import ('@/views/discovermusic/newestmusic/Topalbum.vue')
                        },
                    ]
                },
            ],
            component: () =>
                import ('@/views/Discovermusic')
        },
        {
            path: '/privitefm',
            name: 'privitefm',
            component: () =>
                import ('@/views/Privitefm'),
            beforeEnter: (to, from, next) => {
                if (store.state.islogin) {
                    next()
                } else {
                    next({ name: 'discovermusic' })
                    ElMessage.error('请登录后在访问该页面')
                }
            }
        },
        {
            path: '/radio',
            name: 'radio',
            component: () =>
                import ('@/views/Radio')
        },
        {
            path: '/search',
            name: 'search',
            redirect: '/search/music',
            component: () =>
                import ('@/views/Search'),
            children: [{
                    path: 'music',
                    name: 'searchmusic',
                    component: () =>
                        import ('@/views/search/Music.vue'),
                },
                {
                    path: 'artist',
                    name: 'searchartist',
                    component: () =>
                        import ('@/views/search/Artist.vue'),
                },
                {
                    path: 'album',
                    name: 'searchalbum',
                    component: () =>
                        import ('@/views/search/Album.vue'),
                },
                {
                    path: 'video',
                    name: 'searchvideo',
                    component: () =>
                        import ('@/views/search/Video.vue'),
                },
                {
                    path: 'musiclist',
                    name: 'searchmusiclist',
                    component: () =>
                        import ('@/views/search/Musiclist.vue'),
                },
                {
                    path: 'radio',
                    name: 'searchradio',
                    component: () =>
                        import ('@/views/search/Radio.vue'),
                },
                {
                    path: 'voice',
                    name: 'searchvoice',
                    component: () =>
                        import ('@/views/search/Voice.vue'),
                },
                {
                    path: 'user',
                    name: 'searchuser',
                    component: () =>
                        import ('@/views/search/User.vue'),
                },
            ],
        },
        {
            path: '/myradio',
            name: 'myradio',
            component: () =>
                import ('@/views/Myradio'),
            beforeEnter: (to, from, next) => {
                if (store.state.islogin) {
                    next()
                } else {
                    next({ name: 'discovermusic' })
                    ElMessage.error('请登录后在访问该页面')
                }
            }
        },
        {
            path: '/collection',
            name: 'collection',
            redirect: '/collection/album',
            component: () =>
                import ('@/views/Collection'),
            beforeEnter: (to, from, next) => {
                if (store.state.islogin) {
                    next()
                } else {
                    next({ name: 'discovermusic' })
                    ElMessage.error('请登录后在访问该页面')
                }
            },
            children: [{
                    path: 'album',
                    component: () =>
                        import ('@/views/collection/Album.vue')
                },
                {
                    path: 'artist',
                    component: () =>
                        import ('@/views/collection/Artist.vue')
                },
                {
                    path: 'Video',
                    component: () =>
                        import ('@/views/collection/Video.vue')
                },
            ]
        },
        {
            path: '/radiotype/:type/:name',
            name: 'radiotype',
            component: () =>
                import ('@/views/Radiotype')
        },
        {
            path: '/videodetail/:type/:id',
            name: 'videodetail',
            component: () =>
                import ('@/views/Videodetail')
        },
        {
            path: '/radiodetail/:id',
            name: 'radiodetail',
            component: () =>
                import ('@/views/Radiodetail')
        },
        {
            path: '/dailyrecommend/',
            name: 'dailyrecommend',
            component: () =>
                import ('@/views/Dailyrecommend'),
            beforeEnter: (to, from, next) => {
                if (store.state.islogin) {
                    next()
                } else {
                    next({ name: 'discovermusic' })
                    ElMessage.error('请登录后在访问该页面')
                }
            },
        },
        {
            path: '/highqualitymusiclist/:cat',
            name: 'highqualitymusiclist',
            component: () =>
                import ('@/views/Highqualitymusiclist.vue')
        },
        {
            path: '/lastestmusic',
            name: 'lastestmusic',
            component: () =>
                import ('@/views/Lastestplay'),
            beforeEnter: (to, from, next) => {
                if (store.state.islogin) {
                    next()
                } else {
                    next({ name: 'discovermusic' })
                    ElMessage.error('请登录后在访问该页面')
                }
            }
        },
        {
            path: '/musiclistdetail/:id',
            name: 'musiclistdetail',
            component: () =>
                import ('@/views/Musiclistdetail')
        },
        {
            path: '/allmv/:area/:type/:order',
            name: 'allmv',
            component: () =>
                import ('@/views/Allmv.vue')
        },
        {
            path: '/video',
            name: 'video',
            redirect: '/video/videolist',
            component: () =>
                import ('@/views/Video.vue'),
            children: [{
                    path: 'videolist',
                    component: () =>
                        import ('@/views/video/Videolist.vue'),
                },
                {
                    path: 'mv',
                    component: () =>
                        import ('@/views/video/Mv.vue'),
                },
            ]
        },
        {
            path: '/albumsdetail/:id',
            name: 'albumsdetail',
            component: () =>
                import ('@/views/Albumsdetail.vue')
        },
        {
            path: '/artistdetail/:id',
            name: 'artistdetail',
            component: () =>
                import ('@/views/Artistdetail.vue')
        },
        {
            path: '/userprofile/:id',
            name: 'userprofile',
            component: () =>
                import ('@/views/Userprofile')

        }
    ]
})
router.beforeEach((to, from, next) => {
    //如果访问不存在的路由则跳转到默认的findmusic路由
    if (to.matched.length === 0) {
        next({ path: '/discovermusic' })
    } else next();
})
export default router;