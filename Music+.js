const $config = argsify($config_str)
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
const headers = {
    'User-Agent': UA,
}

const appConfig = {
    ver: 1,
    name: 'q音',
    message: '',
    desc: '',
    tabLibrary: {
        name: '探索',
        groups: [
            // {
            //     name: '推荐',
            //     type: 'song',
            //     ext: {
            //         id: '1',
            //     },
            // },
            {
                name: '榜單',
                type: 'album',
                ext: {
                    id: 'topList',
                },
            },
        ],
    },
    tabSearch: {
        name: '搜索',
        category: ['song', 'artist', 'album', 'playlist'],
    },
    tabMe: {
        name: '我的',
    },
}

async function getConfig() {
    return jsonify(appConfig)
}

async function getSongs(ext) {
    const { page, id, from } = argsify(ext)
    if (page > 1) {
        return jsonify({
            list: [],
        })
    }

    let songs = []

    const { data } = await $fetch.get('https://www.missevan.com/sound/newhomepagedata', {
        headers,
    })
    // $print(`***data: ${data}`)
    argsify(data).info.music.forEach((genre) => {
        genre.objects_point.forEach((each) => {
            songs.push({
                id: `${each.id}`,
                name: each.soundstr,
                cover: each.front_cover,
                duration: parseInt(each.duration / 100),
                artist: {
                    id: `${each.user_id}`,
                    name: each.username,
                },
                ext: {
                    id: each.id,
                },
            })
        })
    })

    return jsonify({
        list: songs,
    })
}

async function getArtists(ext) {
    const { page, id, from } = argsify(ext)
    return jsonify({
        list: [],
    })
}

async function getPlaylists(ext) {
    const { page, id, from } = argsify(ext)
    if (page > 1) {
        return jsonify({
            list: [],
        })
    }

    if (id == '3') {
        return jsonify({
            list: [
                {
                    id: '70445',
                    name: '不想了',
                    cover: 'https://static.maoercdn.com/dramacovers/202311/24/8f4c56ed08c9977154029b5111d24c3e122559.jpg',
                    artist: {
                        id: '01',
                        name: '花卷',
                        cover: '',
                    },
                    ext: {
                        id: '70445',
                    },
                },
            ],
        })
    }

    return jsonify({
        list: [],
    })
}

async function getAlbums(ext) {
    const { page, id, from } = argsify(ext)
    if (page > 1) {
        return jsonify({
            list: [],
        })
    }
    let cards = []

    // 榜單
    if (id == 'topList') {
        const { data } = await $fetch.get(
            'https://u.y.qq.com/cgi-bin/musicu.fcg?_=1577086820633&data=%7B%22comm%22%3A%7B%22g_tk%22%3A5381%2C%22uin%22%3A123456%2C%22format%22%3A%22json%22%2C%22inCharset%22%3A%22utf-8%22%2C%22outCharset%22%3A%22utf-8%22%2C%22notice%22%3A0%2C%22platform%22%3A%22h5%22%2C%22needNewCode%22%3A1%2C%22ct%22%3A23%2C%22cv%22%3A0%7D%2C%22topList%22%3A%7B%22module%22%3A%22musicToplist.ToplistInfoServer%22%2C%22method%22%3A%22GetAll%22%2C%22param%22%3A%7B%7D%7D%7D',
            {
                headers: {
                    Cookie: 'uin=',
                },
            }
        )
        argsify(data).topList.data.group.forEach((each) => {
            each.toplist.forEach((e) => {
                cards.push({
                    id: `${e.topId}`,
                    name: e.title,
                    cover: e.headPicUrl || e.frontPicUrl,
                    artist: {
                        id: 'qq',
                        name: '',
                    },
                    ext: {
                        id: `${e.topId}`,
                        type: 'toplist',
                        period: e.period,
                    },
                })
            })
        })
    }

    return jsonify({
        list: cards,
    })
}

async function getAlbumInfo(ext) {
    ext = argsify(ext)
    const { id, type } = ext
    let songs = []

    if (type === 'toplist') {
        let _a
        const period = ext.period
        const url = `https://u.y.qq.com/cgi-bin/musicu.fcg?g_tk=5381&data=%7B%22detail%22%3A%7B%22module%22%3A%22musicToplist.ToplistInfoServer%22%2C%22method%22%3A%22GetDetail%22%2C%22param%22%3A%7B%22topId%22%3A${id}%2C%22offset%22%3A0%2C%22num%22%3A100%2C%22period%22%3A%22${
            (_a = period) !== null && _a !== void 0 ? _a : ''
        }%22%7D%7D%2C%22comm%22%3A%7B%22ct%22%3A24%2C%22cv%22%3A0%7D%7D`
        const { data } = await $fetch.get(url, {
            headers: {
                Cookie: 'uin=',
            },
        })
        let artist = {
            id: 'qq',
            name: '',
            cover: '',
        }
        let info = argsify(data).detail.data.data
        argsify(data).detail.data.songInfoList.forEach((e) => {
            // $print(JSON.stringify(e, null, 2))
            songs.push({
                id: e.mid,
                name: e.singer[0].name + ' - ' + e.name,
                cover: e?.album?.mid ? `https://y.gtimg.cn/music/photo_new/T002R800x800M000${e.album.mid}.jpg` : '',
                duration: e.interval ?? 1,
                artist: {
                    id: e.singer[0].mid,
                    name: e.singer[0].name,
                    cover: '',
                },
                ext: {
                    id: e.mid || e.songmid,
                },
            })
        })

        return jsonify({
            item: {
                id: `${id}`,
                name: info.title,
                cover: info.headPicUrl || info.frontPicUrl,
                artist,
                songs,
            },
        })
    }
    // const { data } = await $fetch.get(`https://www.missevan.com/sound/soundalllist?albumid=${id}`, {
    //     headers,
    // })
    // const info = argsify(data).info

    // let artist = {
    //     id: `${info.owner.id}`,
    //     name: info.owner.username,
    //     cover: info.owner.avatar2,
    // }
    // info.sounds.forEach((each) => {
    //     songs.push({
    //         id: `${each.id}`,
    //         name: each.soundstr,
    //         cover: each.front_cover,
    //         duration: parseInt(each.duration / 100),
    //         artist: artist,
    //         ext: {
    //             url: each.soundurl,
    //         },
    //     })
    // })
    return jsonify({
        item: {
            id: `${info.album.id}`,
            name: info.album.title,
            cover: info.album.front_cover,
            artist,
            songs,
            ext: {
                id: `${info.album.id}`,
            },
        },
    })
}

async function search(ext) {
    ext = argsify(ext)
}

async function getSongInfo(ext) {
    const { id } = argsify(ext)

    if (id != undefined) {
        const { data } = await $fetch.get(`https://lxmusicapi.onrender.com/url/tx/${id}/320k`, {
            headers: {
                'X-Request-Key': 'share-v2',
            },
        })
        const soundurl = argsify(data).url
        if (soundurl != undefined) {
            return jsonify({ urls: [soundurl] })
        }
    }

    return jsonify({ urls: [] })
}