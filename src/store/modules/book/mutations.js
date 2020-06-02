import { getFontFamily, saveFontFamily, getFontSize, saveFontSize, saveTheme, getTheme, getProgress, saveProgress } from '../../../utils/localStorage'
export const mutations = {
    //书籍文件路径
    'SET_FILENAME': (state, fileName) => {
        state.fileName = fileName;
    },
    //标题和菜单显示
    'SET_MENUVISIBLE': (state, menuVisible) => {
        state.menuVisible = menuVisible
    },
    //设置弹框显示
    'SET_SETTINGVISIBLE': (state, settingVisible) => {
        state.settingVisible = settingVisible
    },
    //默认字号
    'SET_DEFAULTFONTSIZE': (state, defaultFontSize) => {
        state.defaultFontSize = defaultFontSize
        saveFontSize(state.fileName, defaultFontSize)
    },
    //当前书籍对象
    'SET_CURRENT_BOOK': (state, currentBook) => {
        state.currentBook = currentBook
        let getedFontFamily = getFontFamily(state.fileName);
        if (getedFontFamily) {
            state.defaultFontFamily = getedFontFamily
        }
        let getedFontSize = getFontSize(state.fileName)
        if (getedFontSize) {
            state.defaultFontSize = getedFontSize
        }
        let getedTheme = getTheme(state.fileName)
        if (getedTheme) {
            state.defaultTheme = getedTheme
        }

        let getedProgress = getProgress(state.fileName)
        if (getedProgress) {
            state.progress = getedProgress
        }
    },
    //当前字体
    'SET_DEFAULT_FONT_FAMILY': (state, font) => {
        state.defaultFontFamily = font
        saveFontFamily(state.fileName, font)
    },
    //更改字体弹框显示
    'SET_FONT_FAMILY_VISIBLE': (state, visible) => {
        state.fontFamilyVisible = visible
    },
    //主题
    'SET_DEFAULT_THEME': (state, theme) => {
        state.defaultTheme = theme
        saveTheme(state.fileName, theme)
    },
    //当前进度
    'SET_PROGRESS': (state, progress) => {
        state.progress = progress;
        saveProgress(state.fileName, progress)
    },
    //目录是否读完
    'SET_BOOK_AVAILABLE': (state, bookAvailable) => {
        state.bookAvailable = bookAvailable

    },
    //章节号
    'SET_SECTION': (state, section) => {
        state.section = section
    },//封面连接
    'SET_COVER': (state, cover) => {
        state.cover = cover
    },
    //作者信息
    'SET_METADATA': (state, metadata) => {
        state.metadata = metadata
    },
    //一维目录数组
    'SET_NAVIGATION': (state, navigation) => {
        state.navigation = navigation
    },
    //reader获取偏移量，时ebook向y偏移
    'SET_OFFSETY': (state, offsetY) => {
        state.offsetY = offsetY
    },
    //当前页是否为书签页
    'SET_IS_BOOKMARK': (state, isBookmark) => {
        state.isBookmark = isBookmark
    },

    //未使用的
    'SET_IS_PAGINATING': (state, isPaginating) => {
        state.isPaginating = isPaginating
    },
    'SET_PAGINATE': (state, paginate) => {
        state.paginate = paginate
    },
    'SET_PAGELIST': (state, pagelist) => {
        state.pagelist = pagelist
    },


    'SET_SPEAKING_ICON_BOTTOM': (state, speakingIconBottom) => {
        state.speakingIconBottom = speakingIconBottom
    }
}