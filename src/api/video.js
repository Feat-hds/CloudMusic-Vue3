import request from "./request"

export const reqVideodetail = (id) => { return request(`/video/detail?id=${id}`) }
export const reqVideourl = (id) => { return request(`/video/url?id=${id}`) }
export const reqCommentvideo = (id, limit = 20, offset = 0) => { return request(`/comment/video?id=${id}&limit=${limit}&offset=${offset}`) }
export const reqRelatedvideo = (id) => { return request(`/related/allvideo?id=${id}`) }
export const reqVideolikeinfo = (id) => { return request(`/video/detail/info?vid=${id}`) }
export const reqCollectvideo = (id, t) => { return request(`/video/sub?id=${id}&t=${t}`) }

export const reqLiketype = (id, type, t) => { return request(`/resource/like?t=${t}&type=${type}&id=${id}`) }
export const reqMvdetail = (id) => { return request(`/mv/detail?mvid=${id}`) }
export const reqMvurl = (id) => { return request(`/mv/url?id=${id}`) }
export const reqCommentmv = (id, limit = 20, offset = 0) => { return request(`/comment/mv?id=${id}&limit=${limit}&offset=${offset}`) }
export const reqRelatedmv = (id) => { return request(`/simi/mv?mvid=${id}`) }
export const reqMvlikeinfo = (id) => { return request(`/mv/detail/info?mvid=${id}`) }
export const reqCollectmv = (id, t) => { return request(`/mv/sub?mvid=${id}&t=${t}`) }