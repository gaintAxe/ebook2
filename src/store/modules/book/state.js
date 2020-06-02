export const state = {
    fileName: '',//文件名称 http://169.254.211.232:8081/Biomedicine/2014_Book_Self-ReportedPopulationHealthA.epub
    //http://192.168.1.4:8081/Biomedicine/2014_Book_Self-ReportedPopulationHealthA.epub
    menuVisible: false,//标题和菜单栏的显示
    settingVisible: -1,//-1不显示 0font 1theme 2进度条 3目录  设置栏显示
    defaultFontSize: 16,//默认字号
    currentBook: null,//当前书籍对象由epubjs生成
    defaultFontFamily: 'Default',//当前字体
    fontFamilyVisible: false,//更改字体弹框的显示
    defaultTheme: 'Default',//主题
    progress: 0,//当前进度
    bookAvailable: false,//目录是否读完
    section: 0, //章节号
    cover: null, //封面链接
    metadata: null,  //作者信息
    navigation: null,  //一维目录数组
    offsetY: 0,//reader获取偏移量，时ebook向y偏移
    isBookmark: null,//当前页是否为书签页

    //未使用到的
    isPaginating: true,
    paginate: '',
    pagelist: null,
    
    
}