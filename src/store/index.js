import { createStore } from 'vuex'
import { reqCollectmusiclist, reqTrashmusic, reqPersonalfm, reqLikemusic, reqSubartist, reqSubalbum, reqSubradio, reqSongurl } from '@/api/music'
import { ElMessage } from 'element-plus';
import { toNumber } from '@vue/shared';

const state = {
    fmcommentlock: false,
    fmlyriclock: false,
    nextfmlock: false,
    commentlock: false,
    lyriclock: false,
    nextlock: false,
    playmode: 1,
    loading: false,
    drawer: false,
    player: false,
    islogin: false,
    issign: false,
    userid: '',
    userinfocomplete: false,
    playlist: [],
    collectlist: [],
    username: '',
    likelist: [],
    isartistlist: false,
    artistlist: [],
    subartisttotal: 0,
    subalbumtotal: 0,
    albumlist: [],
    isalbumlist: false,
    subradiototal: 0,
    radiolist: [],
    isradiolist: false,
    isvideolist: true,

    followe: 0,

    localplaylist: JSON.parse(localStorage.getItem('musicplaylist')),
    playon: toNumber(localStorage.getItem('playon')),


    fmlist: [],
    fmplayon: 0,
    newfm: false,
    fmurl: null,


    play: false,
    songurl: null,
    songddetail: null,

    time: 0,
    totime: null,
    newmusic: false,
    ordermode: toNumber(localStorage.getItem('ordermode'))
}
const mutations = {
    ADDALL(state, list) {
        if (state.localplaylist && state.localplaylist.length) {
            for (let x of list) {
                if (!state.localplaylist.some((r) => r.id === x.id)) {
                    // x.mytype = 1;
                    state.localplaylist.push(x);
                }
            }
        } else {
            state.localplaylist = list
            state.playon = 0;
            state.newmusic = true;
        }
        localStorage.setItem('musicplaylist', JSON.stringify(state.localplaylist))
        state.nextlock = false;
    },
    FMCOMMENTUNLOCK(state) {
        state.fmcommentlock = false;
    },
    FMLYRICUNLOCK(state) {
        state.fmlyriclock = false;
    },
    FMCOMMENTLOCK(state) {
        state.fmcommentlock = true;
    },
    FMLYRICLOCK(state) {
        state.fmlyriclock = true;
    },
    COMMENTUNLOCK(state) {
        state.commentlock = false;
    },
    LYRICUNLOCK(state) {
        state.lyriclock = false;
    },
    LOCK(state) {
        state.nextlock = true;
    },
    UNLOCK(state) {
        state.nextlock = false;
    },
    COMMENTLOCK(state) {
        state.commentlock = true;
    },
    LYRICLOCK(state) {
        state.lyriclock = true;
    },
    ADDMUSIC(state, row) {
        if (state.localplaylist && state.localplaylist.length) {
            if (!state.localplaylist.some((r) => r.id === row.id)) {
                // row.mytype = 1;
                state.localplaylist.push(row)
                localStorage.setItem('musicplaylist', JSON.stringify(state.localplaylist))
            }
        } else {
            // row.mytype = 1
            state.localplaylist = [row];
            state.playon = 0;
            state.newmusic = true;
            localStorage.setItem('musicplaylist', JSON.stringify(state.localplaylist))
            localStorage.setItem('playon', 0)
        }
        state.nextlock = false;
    },
    FMURL(state, url) {
        state.fmurl = url;
    },
    NEWFM(state) {
        state.newfm = true;
    },
    LOADFM(state) {
        state.newfm = false;
    },
    PLAYMODE(state, mode) {
        state.playmode = mode;
    },
    FMLIST(state, fmlist) {
        for (let x of fmlist) {
            // x.mytype = 1;
            state.fmlist.push(x);
        }
    },
    SONGURL(state, url) {
        state.songurl = url;
    },
    ORDERMODE(state, order) {
        state.ordermode = order;
    },
    NEWMUSIC(state) {
        state.newmusic = true;
    },
    LOADMUSIC(state) {
        state.newmusic = false;
    },
    TOTIME(state, time) {
        state.totime = time;
        state.nextlock = false;
    },
    SETTIME(state, time) {
        state.time = time;
    },
    UPDATEVIDEOLIST(state) {
        state.isvideolist = true;
    },
    LOADVIDEOLIST(state) {
        state.isvideolist = false;
    },
    PLAYMUSIC(state) {
        state.play = true;
    },
    PAUSEMUSIC(state) {
        state.play = false;
    },
    CLEARLIST(state) {
        state.localplaylist = [];
        state.playon = null;
        localStorage.removeItem('musicplaylist')
        localStorage.removeItem('playon')
        state.player = false;
        state.newmusic = false;
        state.play = false;
        state.nextlock = false;
    },
    SETFOLLOWE(state, n) {
        state.followe = n;
    },
    FOLLOWE(state) {
        state.followe++;
    },
    UNFOLLOWE(state) {
        state.followe--;
    },
    LOAD(state) {
        state.loading = true;
    },
    LOADCOMPLETE(state) {
        state.loading = false;
    },
    SUBRADIO(state, { radio, t }) {
        if (t === 0) {
            let n = state.radiolist.findIndex((num) => num.id === radio.id);
            state.radiolist.splice(n, 1);
            state.subradiototal = state.subradiototal - 1;
            // state.likelist = [1]
            ElMessage.success('取消收藏成功')
        } else {
            state.radiolist.unshift(radio);
            state.subradiototal = state.subradiototal + 1;
            ElMessage.success('收藏播客成功')
        }
    },
    SUBRADIOLIST(state, result) {
        state.radiolist = result.djRadios;
        state.subradiototal = result.count;
        state.isradiolist = true;
    },
    SUBALBUM(state, { album, t }) {
        if (t === 2) {
            let n = state.albumlist.findIndex((num) => num.id === album.id);
            state.albumlist.splice(n, 1);
            state.subalbumtotal = state.subalbumtotal - 1;
            // state.likelist = [1]
            ElMessage.success('取消收藏成功')
        } else {
            state.albumlist.unshift(album);
            state.subalbumtotal = state.subalbumtotal + 1;
            ElMessage.success('收藏专辑成功')
        }
    },
    SUBALBUMLIST(state, result) {
        state.albumlist = result.data;
        state.subalbumtotal = result.count;
        state.isalbumlist = true;
    },
    SETARTISTLIST(state, list) {
        state.artistlist = list
    },
    SUBARTIST(state, { artist, t }) {
        if (t === 2) {
            let n = state.artistlist.findIndex((num) => num.id === artist.id);
            state.artistlist.splice(n, 1);
            state.subartisttotal = state.subartisttotal - 1;
            // state.likelist = [1]
            ElMessage.success('取消收藏成功')
        } else {
            state.artistlist.unshift(artist);
            state.subartisttotal = state.subartisttotal + 1;
            ElMessage.success('收藏歌手成功')
        }
    },
    SUBARTISTTOTAL(state, total) {
        state.subartisttotal = total;
    },
    ARTISTLISTCOMPLETE(state) {
        state.isartistlist = true;
    },
    COLLECTIT(state, { music, like }) {
        if (like === 2) {
            let n = state.collectlist.findIndex((num) => num.id === music.id);
            state.collectlist.splice(n, 1);
            // state.likelist = [1]
            ElMessage.success('取消收藏成功')
        } else {
            state.collectlist.unshift(music);
            ElMessage.success('收藏歌单成功')
        }
    },
    LIKEIT(state, id) {
        if (state.likelist.some((num) => num === id)) {
            let n = state.likelist.findIndex((num) => num === id);
            state.likelist.splice(n, 1);
            // state.likelist = [1]
            ElMessage.success('成功取消喜欢')
        } else {
            state.likelist.unshift(id);
            ElMessage.success('成功添加喜欢')
        }
        let arr = [];
        for (let x of state.likelist) {
            arr.push(x);
        }
        state.likelist = arr;
    },
    LIKELIST(state, list) {
        state.likelist = list;
    },
    GETUSERPLAYLIST(state, { playlist, create }) {
        state.playlist = playlist.splice(0, create);
        state.collectlist = playlist;
    },
    SETUSERNAME(state, name) {
        state.username = name;
    },
    USERINFOCOMPLETE(state) {
        state.userinfocomplete = true;
    },
    USERID(state, uid) {
        state.userid = uid;
    },
    ISSIGN(state) {
        state.issign = true;
    },
    ISLOGIN(state) {
        state.islogin = true;
    },
    NOTLOGIN(state) {
        state.islogin = false;
    },
    CLOSEDRAWER(state) {
        state.drawer = false;
    },
    OPENDRAWER(state) {
        state.drawer = true;
    },
    OPENPLAYER(state) {
        state.player = true;
    },
    CLOSEPLAYER(state) {
        state.player = false;
    }
}
const actions = {
    async likeit({ commit, state }, { id, like }) {
        try {
            if (!state.islogin) {
                ElMessage.warning('请登录后在进行操作')
            } else {
                let result = await reqLikemusic(id, like)
                    // console.log(result)
                if (result.code === 200 && like) {
                    commit('LIKEIT', id)
                } else ElMessage.warning('喜欢/取消歌曲失败')
            }
        } catch (err) {
            console.log(err)
            ElMessage.error('网络异常，喜欢操作失败')
        }
    },
    async collectit({ commit, state }, { music, like }) {
        try {
            if (!state.islogin) {
                ElMessage.warning('请登录后在进行操作')
            } else {
                // console.log(music, like)
                let result = await reqCollectmusiclist(music.id, like)
                    // console.log(result)
                if (result.code === 200) {
                    commit('COLLECTIT', { music, like })
                } else ElMessage.warning('账号所处环境不够可靠，收藏/取消收藏失败')
            }
        } catch (err) {
            console.log(err)
            ElMessage.error('网络异常，收藏失败')

        }
    },
    async subartist({ commit, state }, { artist, t }) {
        try {
            if (!state.islogin) {
                ElMessage.warning('请登录后在进行操作')
            } else {
                // console.log(music, like)
                let result = await reqSubartist(artist.id, t)
                    // console.log(result)
                if (result.code === 200) {
                    commit('SUBARTIST', { artist, t })
                } else ElMessage.warning('账号所处环境不够可靠，收藏/取消收藏失败')
            }
        } catch (err) {
            console.log(err)
            ElMessage.error('网络异常，收藏失败')
        }
    },
    async subalbum({ commit, state }, { album, t }) {
        try {
            if (!state.islogin) {
                ElMessage.warning('请登录后在进行操作')
            } else {
                // console.log(music, like)
                let result = await reqSubalbum(album.album.id, t)
                    // console.log(result)
                if (result.code === 200) {
                    commit('SUBALBUM', { album: album.album, t })
                } else ElMessage.warning('账号所处环境不够可靠，收藏/取消收藏失败')
            }
        } catch (err) {
            console.log(err)
            ElMessage.error('网络异常，收藏失败')
        }
    },
    async subradio({ commit, state }, { radio, t }) {
        try {
            if (!state.islogin) {
                ElMessage.warning('请登录后在进行操作')
            } else {
                // console.log(music, like)
                let result = await reqSubradio(radio.id, t)
                    // console.log(result)
                if (result.code === 200) {
                    commit('SUBRADIO', { radio, t })
                } else ElMessage.warning('账号所处环境不够可靠，收藏/取消收藏失败')
            }
        } catch (err) {
            console.log(err)
            ElMessage.error('网络异常，收藏失败')
        }
    },
    async prevmusic({ dispatch, state, commit }) {
        if (state.playon > 0) { //当前不是第一首歌曲
            dispatch('playon', state.playon - 1)
        } else if (state.localplaylist.length > 1) { //当前是第一首歌曲但不是唯一的歌曲
            dispatch('playon', state.localplaylist.length - 1)
        } else commit('TOTIME', 0); //当前是惟一的一首歌则直接重新播放
    },
    async nextmusic_btn({ commit, dispatch, state }) {
        if (state.localplaylist.length === 1) {
            commit('TOTIME', 0);
        } else if (state.playon + 1 >= state.localplaylist.length) {
            dispatch('playon', 0)
        } else {
            dispatch('playon', state.playon + 1);
        }
    },
    async nextmusic({ commit, state, getters, dispatch }, isdelete) {
        if (isdelete) {
            let index = state.playon;
            try {
                if (state.playon < state.localplaylist.length - 1) { //有下一首歌时
                    state.localplaylist.splice(index, 1);
                    localStorage.setItem('musicplaylist', JSON.stringify(state.localplaylist))
                    let result = await reqSongurl(state.localplaylist[index].id)
                    if (result.code === 200) {
                        if (result.data[0].code === 404) {
                            ElMessage.error('歌曲暂无版权，已下架')
                            dispatch('nextmusic', true)
                        } else if (result.data[0].code === 200) {
                            state.songdetail = result.data[0];
                            state.songurl = result.data[0].url;
                            commit('NEWMUSIC')
                        } else {
                            ElMessage.error('该歌曲需要单独购买或者网易云会员才可播放')
                            dispatch('nextmusic', true);
                        }
                    } else throw Error('获取音乐地址失败')
                } else if (state.localplaylist.length > 1) { //
                    state.playon = 0;
                    localStorage.setItem('playon', 0)
                    state.localplaylist.pop();
                    localStorage.setItem('musicplaylist', JSON.stringify(state.localplaylist))
                    let result = await reqSongurl(state.localplaylist[0].id)
                    if (result.code === 200) {
                        if (result.data[0].code === 404) {
                            ElMessage.error('歌曲暂无版权，已下架')
                            dispatch('nextmusic', true)
                        } else if (result.data[0].code === 200) {
                            state.songdetail = result.data[0];
                            state.songurl = result.data[0].url;
                            commit('NEWMUSIC')
                        } else {
                            ElMessage.error('该歌曲需要单独购买或者网易云会员才可播放')
                            dispatch('nextmusic', true);
                        }
                    } else throw Error('获取音乐地址失败')
                } else {
                    commit('CLEARLIST')
                }
            } catch (err) {
                console.log(err)
                if (err.message) ElMessage.error(err.message)
                state.play = false;
            }
        } else {
            switch (state.ordermode) {
                case 0: //单曲循环
                    commit('TOTIME', 0);
                    break;
                case 1: //列表循环
                    if (state.localplaylist.length === 1) {
                        commit('TOTIME', 0);
                    } else if (state.playon + 1 >= state.localplaylist.length) {
                        dispatch('playon', 0)
                    } else {
                        dispatch('playon', state.playon + 1);
                    }
                    break;
                case 2: //列表随机
                    if (state.localplaylist.length === 1) {
                        commit('TOTIME', 0);
                    } else {
                        let random = Math.floor(Math.random() * state.localplaylist.length)
                        if (random != state.playon) {
                            dispatch('playon', random)
                        } else {
                            commit('TOTIME', 0)
                        }
                    }
                    break;
                default:
                    if (state.localplaylist.length === 1) {
                        commit('TOTIME', 0);
                    } else if (state.playon + 1 >= state.localplaylist.length) {
                        dispatch('playon', 0)
                    } else {
                        dispatch('playon', state.playon + 1);
                    }
                    break;
            }
        }

    },
    async playmusic({ commit, state, getters, dispatch }) { //播放当前音乐
        try {
            if (state.playmode) {
                if (getters.nowplaymusic) {
                    let result = await reqSongurl(getters.nowplaymusic.id)
                    if (result.code === 200) {
                        if (result.data[0].code === 404) {
                            ElMessage.error('歌曲暂无版权，已下架')
                            dispatch('nextmusic', true)
                        } else if (result.data[0].code === 200) {
                            state.songdetail = result.data[0];
                            state.songurl = result.data[0].url;
                        } else {
                            ElMessage.error('该歌曲需要单独购买或者网易云会员才可播放')
                            dispatch('nextmusic', true)
                        }
                    } else throw Error('获取音乐地址失败')
                } else {
                    throw Error('当前列表没有音乐')
                }
            } else {
                if (getters.nowplayfm) {
                    let result = await reqSongurl(getters.nowplayfm.id)
                    if (result.code === 200) {
                        if (result.data[0].code === 404) {
                            ElMessage.error('歌曲暂无版权，已下架')
                            dispatch('nextmusic', true)
                        } else if (result.data[0].code === 200) {
                            state.songdetail = result.data[0];
                            state.fmurl = result.data[0].url;
                        } else {
                            ElMessage.error('该歌曲需要单独购买或者网易云会员才可播放')
                            dispatch('nextmusic', true)
                        }
                    } else throw Error('获取音乐地址失败')
                } else {
                    throw Error('当前fm内没有音乐')
                }
            }
        } catch (err) {
            if (err.message) ElMessage.error(err.message)
            console.log(err)
        }
    },
    async playon({ commit, state, getters, dispatch }, index) { //播放列表第index个音乐
        try {
            if (index != state.playon) { //点击的不是当前正在播放的歌曲
                // console.log(row)
                let result = await reqSongurl(state.localplaylist[index].id)
                if (result.code === 200) {
                    if (result.data[0].code === 404) {
                        ElMessage.error('歌曲暂无版权，已下架')
                        dispatch('nextmusic', true)
                    } else if (result.data[0].code === 200) {
                        state.playon = index;
                        localStorage.setItem('playon', index)
                        state.songdetail = result.data[0];
                        state.songurl = result.data[0].url;
                        commit('NEWMUSIC')
                    } else {
                        ElMessage.error('该歌曲需要单独购买或者网易云会员才可播放')
                        dispatch('nextmusic', true)
                    }
                } else throw Error('获取音乐地址失败')
            } else if (!state.play && state.songurl) { //点击的是当前正在播放的歌曲，并且已获得url
                state.play = true;
            } else if (!state.play) { //点击的是当前歌曲，但还没有获得url
                dispatch("playmusic")
            }
        } catch (err) {
            console.log(err);
            if (err.message) ElMessage.error(err.message)
        } finally {
            state.nextlock = false;
        }
    },
    async addmusicandplay({ state, commit, dispatch }, row) { //添加音乐到列表，并播放
        try {
            // row.mytype = 1;
            if (state.localplaylist && state.localplaylist.length) { //列表内是否存在歌曲
                if (!state.localplaylist.some((r) => r.id === row.id)) { //是否列表内没有该歌曲
                    let result = await reqSongurl(row.id)
                    if (result.code === 200) {
                        if (result.data[0].code === 200) {
                            state.localplaylist.push(row);
                            localStorage.setItem('musicplaylist', JSON.stringify(state.localplaylist))
                            state.playon = state.localplaylist.length - 1;
                            localStorage.setItem('playon', state.playon)
                            state.playmode = 1;
                            state.songdetail = result.data[0];
                            state.songurl = result.data[0].url;
                            commit('NEWMUSIC')
                        } else if (result.data[0].code === 404) {
                            ElMessage.error('歌曲暂无版权，已下架')
                        } else {
                            ElMessage.error('该歌曲需要单独购买或者网易云会员才可播放')
                        }
                    } else throw Error('获取音乐地址失败')
                } else {
                    let index = state.localplaylist.findIndex((r) => r.id === row.id)
                    let result = await reqSongurl(state.localplaylist[index].id)
                    if (result.code === 200) {
                        if (result.data[0].code === 200) {
                            state.playon = index;
                            localStorage.setItem('playon', index)
                            state.playmode = 1;
                            state.songdetail = result.data[0];
                            state.songurl = result.data[0].url;
                            commit('NEWMUSIC')
                        } else if (result.data[0].code === 404) {
                            ElMessage.error('歌曲暂无版权，已下架')
                        } else {
                            ElMessage.error('该歌曲需要单独购买或者网易云会员才可播放')
                        }
                    } else throw Error('获取音乐地址失败')
                }
            } else { //列表内没有歌曲
                let result = await reqSongurl(row.id)
                if (result.code === 200) {
                    if (result.data[0].code === 200) {
                        state.localplaylist = [row];
                        localStorage.setItem('musicplaylist', JSON.stringify(state.localplaylist))
                        state.playon = 0;
                        localStorage.setItem('playon', 0)
                        state.playmode = 1;
                        state.songdetail = result.data[0];
                        state.songurl = result.data[0].url;
                        commit('NEWMUSIC')
                    } else if (result.data[0].code === 404) {
                        ElMessage.error('歌曲暂无版权，已下架')
                    } else {
                        ElMessage.error('该歌曲需要单独购买或者网易云会员才可播放')
                    }
                } else throw Error('获取音乐地址失败')
            }
        } catch (err) {
            console.log(err);
            if (err.message) ElMessage.error(err.message)
        } finally {
            state.nextlock = false;
        }
    },
    async nextfm({ state, commit }) {
        try {
            if (!state.nextfmlock && !state.fmcommentlock && !state.fmlyriclock) {
                state.nextfmlock = true;
                if (state.fmplayon < state.fmlist.length - 1) {
                    let result = await reqSongurl(state.fmlist[state.fmplayon + 1].id)
                    if (result.code === 200) {
                        state.fmplayon++;
                        state.fmurl = result.data[0].url;
                        commit('NEWFM')
                    } else throw Error('获取歌曲地址失败')
                } else {
                    let result = await reqPersonalfm();
                    if (result.code === 200) {
                        commit('FMLIST', result.data);
                        let url = await reqSongurl(state.fmlist[state.fmplayon + 1].id)
                        if (url.code === 200) {
                            state.fmplayon++;
                            state.fmurl = url.data[0].url;
                            commit('NEWFM')
                        } else throw Error('获取歌曲地址失败')
                    } else throw Error()
                }
            }
        } catch (err) {
            console.log(err)
            if (err.message) ElMessage.error(err.message);
        } finally {
            state.nextfmlock = false;
        }
    },
    async trashmusic({ getters, dispatch }) {
        try {
            let result = await reqTrashmusic(getters.nowplayfm.id);
            if (result.code === 200) {
                dispatch('nextfm')
            }
        } catch (err) {
            console.log(err)
            ElMessage.error('网络异常，移出歌曲失败')
        }
    },
    async addmusic({ state, commit, dispatch }, row) {
        if (state.playmode === 0) {
            dispatch('addmusicandplay', row)
        } else {
            commit('ADDMUSIC', row)
        }
    },
    async addallandplay({ state, dispatch, commit }, list) {
        state.localplaylist = list;
        localStorage.setItem('musicplaylist', JSON.stringify(state.localplaylist))
            // console.log(row)
        state.songurl = null;
        if (state.playmode === 0) state.playmode = 1;
        dispatch('playon', 0);
    },
    async addall({ state, dispatch, commit }, list) {
        if (state.playmode === 0) {
            dispatch('addallandplay', list);
        } else {
            commit('ADDALL', list)
        }
    }
}
const getters = {
    nowplaymusic(state) {
        if (state.localplaylist && state.localplaylist.length && state.playon != null) return state.localplaylist[state.playon];
        else return null;

    },
    nowplayfm(state) {
        if (state.fmlist.length) return state.fmlist[state.fmplayon];
        else return null;
    },
    islike(state, getters) {
        if (state.playmode) {
            if (state.likelist.some((music) => getters.nowplaymusic && music === getters.nowplaymusic.id)) return true;
            else return false;
        } else {
            if (state.likelist.some((music) => getters.nowplayfm && music === getters.nowplayfm.id)) return true;
            else return false;
        }
    },
    dt(state, getters) {
        if (state.playmode) {
            if (getters.nowplaymusic) {
                return getters.nowplaymusic.dt;
            } else return 0;
        } else {
            if (getters.nowplayfm) {
                return getters.nowplayfm.duration;
            } else return 0;
        }
    }
}

export default createStore({
    state,
    mutations,
    getters,
    actions

})