import request from "./request";

export const reqRadiodetail = (id) => { return request(`/dj/detail?rid=${id}`) } //电台详情
export const reqRadiosubscriber = (id, time = -1) => { return request(`/dj/subscriber?id=${id}&time=${time}`) } //电台订阅者列表
export const reqRadioprogram = (id, limit = 30, offset = 0) => { return request(`/dj/program?rid=${id}&limit=${limit}&offset=${offset}`) } //电台节目详情
export const reqAlbumdetail = (id) => { return request(`/album/?id=${id}`) } //专辑详情
export const reqAlbumdynamicdetail = (id) => { return request(`/album/detail/dynamic?id=${id}`) } //专辑详情
export const reqUseraudio = (id) => { return request(`/user/audio?uid=${id}`) } //创建的电台
export const reqSimiartist = (id) => { return request(`/simi/artist?id=${id}`) } //歌手mv
export const reqArtistmv = (id, limit = 20, offset = 0) => { return request(`/artist/mv?id=${id}&limit=${limit}&offset=${offset}`) } //歌手mv
export const reqArtistinfo = (id) => { return request(`/artist/detail?id=${id}`) } //歌手xinxi
export const reqArtistalbum = (id, limit = 30, offset = 0) => { return request(`/artist/album?id=${id}&limit=${limit}&offset=${offset}`) } //歌手全部专辑
export const reqArtistdesc = (id) => { return request(`/artist/desc?id=${id}`) } //歌手介绍
    //各种评论
export const reqAlbumcomment = (id, limit = 20, offset = 0) => { return request(`/comment/album?id=${id}&limit=${limit}&offset=${offset}`) }
export const reqVideocomment = (id, limit = 20, offset = 0) => { return request(`/comment/video?id=${id}&limit=${limit}&offset=${offset}`) }
export const reqHotcomment = (id, type = 0, limit = 20, offset = 0) => { return request(`/comment/hot?type=${type}&id=${id}&limit=${limit}&offset=${offset}`) }
export const reqDjcomment = (id, limit = 20, offset = 0) => { return request(`/comment/dj?id=${id}&limit=${limit}&offset=${offset}`) }
export const reqMvcomment = (id, limit = 20, offset = 0) => { return request(`/comment/mv?id=${id}&limit=${limit}&offset=${offset}`) }
export const reqMusiccomment = (id, limit = 20, offset = 0) => { return request(`/comment/music?id=${id}&limit=${limit}&offset=${offset}`) }
export const reqMusiclistcomment = (id, limit = 20, offset = 0) => { return request(`/comment/playlist?id=${id}&limit=${limit}&offset=${offset}`) }
    //歌单订阅者列表
export const reqMusiclistsubscribers = (id, limit = 20, offset = 0) => { return request(`/playlist/subscribers?id=${id}&limit=${limit}&offset=${offset}`) }
export const reqMusiclistdetail = (id) => { return request(`/playlist/detail?id=${id}`) } //歌单详情
export const reqLikelist = (uid) => { return request(`/likelist?uid=${uid}`) } //用户喜欢的歌单列表
export const reqSearchbrief = (type, keyword, limit = 30, offset = 0) => { return request(`/search?type=${type}&keywords=${keyword}&limit=${limit}&offset=${offset}`) } //搜索
export const reqLikeit = (id, like) => { return request(`/like?id=${id}&like=${like}`) } //喜欢歌曲
export const reqSearchmultimatch = (keyword) => { return request(`/search/multimatch?keywords=${keyword}`) } //搜索的感兴趣兴趣匹配
export const reqSubmvlist = (limit = 20, offset = 0) => { return request(`/mv/sublist?limit=${limit}&offset=${offset}`) } //收藏的MV列表
export const reqSubartistlist = (limit = 20, offset = 0) => { return request(`/artist/sublist?limit=${limit}&offset=${offset}`) } //收藏的歌手列表
export const reqSubalbumlist = (limit = 20, offset = 0) => { return request(`/album/sublist?limit=${limit}&offset=${offset}`) } //收藏的专辑列表
export const reqDjrecommend = () => { return request(`/personalized/djprogram?limit=5`) } //推荐电台
    // export const reqSubradiolist = () => { return request(`/dj/sublist`) } //订阅电台列表
export const reqSubradiolist = () => { return request(`/dj/sublist?ts=${Date.now()}`) } //订阅电台列表

export const reqSearch = (type, keyword, limit = 30, offset = 0) => { return request(`/cloudsearch?type=${type}&keywords=${keyword}&limit=${limit}&offset=${offset}`) } //搜索（结果更全）
export const reqBanner = () => { return request('/banner?type=0') } //首页轮播图
export const reqPersonalized = (number) => { return request(`/personalized?limit=${number}`) } //个性推荐
export const reqUserplaylist = (uid, limit = 5000, offset = 0) => { return request(`/user/playlist?uid=${uid}&limit=${limit}&offset=${offset}`) } //用户歌单列表
    // export const reqUsersubcount = () => { return request('/user/subcount') }; //获取用户收藏的歌单MV歌曲数量
export const reqUsersubcount = () => { return request(`/user/subcount?ts=${Date.now()}`) }; //获取用户收藏的歌单MV歌曲数量

export const reqPersonalizedmv = (number) => { return request(`/personalized/mv?limit=${number}`) } //个性化推荐的mv
export const reqPersonalizednewsong = (number) => { return request(`/personalized/newsong?limit=${number}`) } //个性化推荐新歌
export const reqExclusivevideo = (number) => { return request(`/personalized/privatecontent?limit=${number}`) } //网易独家出品mv推荐
export const reqDailyplaylist = (number) => { return request(`/recommend/resource?limit=${number}`) } //每日推荐歌单
export const reqHighqualityplaylist = (cat, number, before = 0) => { return request(`/top/playlist/highquality?cat=${cat}&limit=${number}&before=${before}`) } //获取精品歌单
export const reqHotcat = () => { return request(`/playlist/hot`) } //歌单的热门分类列表
export const reqAllcat = () => { return request(`/playlist/highquality/tags`) } //精品歌单的分类列表
export const reqPlaylist = (cat, limit, offset = 0, order = 'hot') => { return request(`/top/playlist?limit=${limit}&order=${order}&cat=${cat}&offset=${offset}`) } //获取分类下歌单列表
export const reqPlaylistdetail = (id, limit) => { return request(`/playlist/track/all?&id=${id}&limit=${limit}`) } //获取歌单所有歌曲
export const reqToplist = () => { return request(`/toplist`) }
export const reqArtistlist = (limit, offset = 0, type = -1, area = -1, initial = -1) => { return request(`/artist/list?type=${type}&limit=${limit}&offset=${offset}&area=${area}&initial=${initial}`) } //请求歌手对应分类的列表
export const reqTopsong = (type = 0) => { return request(`/top/song?type=${type}`) } //请求最新的音乐
export const reqMv = (area = '全部', limit = 30, order = '最新', offset = 0, type = "全部") => { return request(`/mv/all?area=${area}&limit=${limit}&order=${order}&offset=${offset}&type=${type}`) } //请求对应分类下的MV列表
export const reqVideocat = () => { return request(`/video/category/list`) } //请求视频分类列表
export const reqVideogrouplist = () => { return request(`/video/group/list`) } //请求视频分类列表
export const reqVideolist = (id, offset = 0) => { return request(`/video/group?id=${id}&offset=${offset}`) } //请求对应分类下的视屏列表
    // export const reqRecentsong = () => { return request(`/record/recent/song`) }
export const reqRecentsong = () => { return request(`/record/recent/song?ts=${Date.now()}`) } //请求最近听过的歌曲

// export const reqPersonalfm = () => { return request(`/personal_fm`) }
export const reqPersonalfm = () => { return request(`/personal_fm?ts=${Date.now()}`) } //请求个人FM内容

export const reqMusicdetail = (id) => { return request(`/song/detail?ids=${id}`) } //请求音乐的信息
export const reqTrashmusic = (id) => { return request(`/fm_trash?id=${id}`) } //音乐放进垃圾桶


export const reqRadiorecommend = () => { return request(`/dj/recommend`) } //请求推荐播客
export const reqRadiocat = () => { return request(`/dj/catelist`) } //请求播客分类列表
export const reqRadiocatrec = (type, offset = 0) => { return request(`/dj/recommend/type?type=${type}&offset=${offset}`) } //请求播客分类下的推荐播客列表
export const reqRadiohotcat = () => { return request(`/dj/category/recommend`) } //请求热门播客列表
export const reqRadioprivaterec = () => { return request(`/dj/personalize/recommend?limit=5`) } //请求播客个性推荐
export const reqRadiohottype = (type, limit = 30, offset = 0) => { return request(`/dj/radio/hot?cateId=${type}&limit=${limit}&offset=${offset}`) } //请求播客热门分类下的列表
export const reqLikemusic = (id, like) => { return request(`/like?id=${id}&like=${like}`) } //喜欢/取消喜欢音乐
export const reqCollectmusiclist = (id, like) => { return request(`/playlist/subscribe?id=${id}&t=${like}`) } //收藏歌单，可能会因没有验证而失败
    //请求各种用户的订阅列表
export const reqSubartist = (id, t) => { return request(`/artist/sub?id=${id}&t=${t}`) }
export const reqSubalbum = (id, t) => { return request(`/album/sub?id=${id}&t=${t}`) }
export const reqSubradio = (id, t) => { return request(`/dj/sub?rid=${id}&t=${t}`) }
export const reqDailyrecommend = () => { return request(`/recommend/songs`) }
export const reqTopalbum = (area, type, limit = 50, offset = 0) => { return request(`/top/album?area=${area}&type=${type}&limit=${limit}&offset=${offset}`) }
export const reqUserfollowe = (id, t) => { return request(`/follow?id=${id}&t=${t}`) }
export const reqExclusivemv = (limit = 30, offset = 0) => { return request(`/mv/exclusive/rcmd?limit=${limit}&offset=${offset}`) }
export const reqSongurl = (id, br = 320000) => { return request(`/song/url?id=${id}&br=${br}`) }
export const reqCommentlike = (id, cid, t, type) => { return request(`/comment/like?id=${id}&cid=${cid}&t=${t}&type=${type}`) }
export const reqSongdetail = (idarr) => { return request(`/song/detail?ids=${idarr}`) }


export const reqLyric = (id) => { return request(`/lyric?id=${id}`) }


export const reqPersonalizedprogramrecommend = (number) => { return request(`/program/recommend?limit=${number}`) }