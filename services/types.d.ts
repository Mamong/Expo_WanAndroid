interface Result<T> {
    data: T
    errorCode: number
    errorMsg: string
}

interface Tag {
    name: string,
    url: string
}

interface Article {
    isTop?: boolean
    adminAdd: boolean,
    apkLink: string,
    audit: 0 | 1,
    author: string,
    canEdit: boolean,
    chapterId: number,
    chapterName: string,
    collect: boolean,
    courseId: number,
    desc: string,
    descMd: string,
    envelopePic: string,
    fresh: boolean,
    host: string,
    id: number,
    isAdminAdd: boolean,
    link: string,
    niceDate: string,
    niceShareDate: string,
    origin: string,
    originId?: number,
    prefix: string,
    projectLink: string,
    publishTime: number,
    realSuperChapterId: number,
    selfVisible: 0 | 1,
    shareDate: string,
    shareUser: string,
    superChapterId: number,
    superChapterName: string,
    tags: Tag[],
    title: string,
    type: number,
    userId: number,
    visible: 0 | 1,
    zan: number
}


interface Banner {
    desc: string,
    id: number,
    imagePath: string,
    isVisible: 0 | 1
    order: number,
    title: string,
    type: number,
    url: string
}

interface Website {
    category: string,
    icon: string,
    id: number,
    link: string,
    name: string,
    order: number,
    visible: 0 | 1
}

interface Hotkey {
    id: number,
    link: string,
    name: string,
    order: number,
    visible: 0 | 1
}

interface Tree {
    //articleList:[],
    author: string,
    children: Tree[],
    courseId: number,
    cover: string,
    desc: string,
    id: number,
    lisense: string,
    lisenseLink: string,
    name: string,
    order: number,
    parentChapterId: number,
    type: number,
    userControlSetTop: boolean,
    visible: 0 | 1
}

interface Navi {
    cid: number,
    name: string,
    articles: Article[]
}

interface ListResponse<T> {
    curPage: number,
    datas: T[],
    offset: number,
    over: boolean,
    pageCount: number,
    size: number,
    total: number
}

interface UserInfo {
    admin: boolean,
    chapterTops: [],
    coinCount: number,
    collectIds: [],
    email: string,
    icon: string,
    id: number,
    nickname: number,
    type: number,
    token: string

    username: string
    password: string,
    repassword: string
}

interface CoinInfo {
    coinCount: number,
    rank: number,
    level: number,
    userId: number,
    username: string,
    nickname: string
}

interface CoinDetail {
    reason: string,
    desc: string,
    coinCount: number,
}
