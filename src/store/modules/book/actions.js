export const actions = {
    //书籍路径
    setFileName: ({ commit, state }, fileName) => {
        return commit('SET_FILENAME', fileName)
    },
    //标题菜单显示
    setMenuVisible: ({ commit, state }, menuVisible) => {
        return commit('SET_MENUVISIBLE', menuVisible)
    },
    //设置栏显示
    setSettingVisible: ({ commit, state }, settingVisible) => {
        //返回promise
        return commit('SET_SETTINGVISIBLE', settingVisible)
    },
    //字号
    setDefaultFontSize: ({ commit, state }, defaultFontSize) => {
        //返回promise
        return commit('SET_DEFAULTFONTSIZE', defaultFontSize)
    },
    //当前书籍对象
    setCurBook: ({ commit, state }, currentBook) => {
        //返回promise
        return commit('SET_CURRENT_BOOK', currentBook)
    },
    //更改字体弹框显示
    setFontFamilyVisible: ({ commit }, visible) => {
        return commit('SET_FONT_FAMILY_VISIBLE', visible)
    },
    //更改字体
    setDefaultFontFamily: ({ commit }, font) => {
        return commit('SET_DEFAULT_FONT_FAMILY', font)
    },
    //主题
    setDefaultTheme: ({ commit }, theme) => {
        return commit('SET_DEFAULT_THEME', theme)
    },
    //当前进度
    setProgress: ({ commit }, progress) => {
        return commit('SET_PROGRESS', progress)
    },
    //目录是否读完
    setBookAvailable: ({ commit }, bookAvailable) => {
        return commit('SET_BOOK_AVAILABLE', bookAvailable)
    },
    //章节数
    setSection: ({ commit }, section) => {
        return commit('SET_SECTION', section)
    },
    // 封面连接
    setCover: ({ commit }, cover) => {
        return commit('SET_COVER', cover)
    },
    //作者信息
    setMetadata: ({ commit }, metadata) => {
        return commit('SET_METADATA', metadata)
    },
    //一维目录数组
    setNavigation: ({ commit }, navigation) => {
        return commit('SET_NAVIGATION', navigation)
    },
    //reader获取偏移量，时ebook向y偏移
    setOffsetY({ commit }, offsetY) {
        return commit('SET_OFFSETY', offsetY)
    },
    //当前页是否为书签页
    setIsBookmark({ commit }, isBookmark) {
        return commit('SET_IS_BOOKMARK', isBookmark)
    },
    // 12/1234
    setPaginate: ({ commit }, paginate) => {
        return commit('SET_PAGINATE', paginate)
    },
    //所有页的地址 locations
    setPagelist: ({ commit }, pagelist) => {
        return commit('SET_PAGELIST', pagelist)
    },




    //未使用的
    setIsPaginating: ({ commit }, isPaginating) => {
        return commit('SET_IS_PAGINATING', isPaginating)
    },
    


    setSpeakingIconBottom({ commit }, speakingIconBottom) {
        commit('SET_SPEAKING_ICON_BOTTOM', speakingIconBottom)
    }
}