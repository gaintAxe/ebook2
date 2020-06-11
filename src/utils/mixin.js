import { mapActions, mapGetters } from 'vuex'

import { getters } from '../store/getters'
import { actions } from '../store/modules/book/actions'
import { homeActions } from '../store/modules/home/actions'
const actionsKeys = Object.keys(actions);
const homeActionsKeys = Object.keys(homeActions)
const gettersKeys = Object.keys(getters);

import { shelf } from "../api/store";

import { appendAddToShelf, computeId, removeAddFromShelf } from '../utils/store'
import { themeList, addCss, flatten } from "../utils/book";
import { saveLocation, getLocation, getReadTime, getBookmark, saveBookmark, getBookShelf, saveBookShelf } from '../utils/localStorage'

const NGINX_SERVER = process.env.VUE_APP_RES_URL;
export const ebookMixin = {
    computed: {
        ...mapGetters(gettersKeys),
        themeList: function () {
            return themeList(this);
        },
        getSectionName() {
            if (!this.navigation) {
                return "";
            } else {
                let str = ''
                if (!this.type) {
                    if (this.section >= 0) {
                        str = this.navigation[this.section].label.substr(0, 40) + "..."
                    }
                } else {
                    if (this.section >= 0) {
                        str = this.navigation[this.section].label
                    }
                }
                return str
            }
        }
    },
    methods: {
        ...mapActions([...actionsKeys]),
        //设置字号
        init_font(themes, fontSize) {
            themes.fontSize(fontSize + "px");
        },
        //设置字体
        init_fontFamily(themes, fontFamily) {
            if (fontFamily === "Default") {
                fontFamily = "Days One";
                //Times New Roman
            }
            themes.font(fontFamily);
        },
        //设置主题
        init_theme(themes, theme) {
            themes.select(theme);
            //根据主题初始化全局样式
            this.initGlobalStyle(theme);
        },
        //初始化全局样式
        initGlobalStyle(theme) {
            console.log(theme)

            addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_${theme.toLowerCase()}.css`);
            // switch (this.defaultTheme) {
            //     case 'Default':
            //         addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
            //         break
            //     case 'Eye':
            //         addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
            //         break
            //     case 'Gold':
            //         addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
            //         break
            //     case 'Night':
            //         addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
            //         break
            //     default:
            //         addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
            //         break
            // }
        },
        //根据进度渲染书页
        displayForProgress(val, rendition) {
            console.log('displayForProgress::::')
            if (!this.currentBook) {
                return;
            }
            let _locations = this.currentBook.locations;
            const progressRange = val / 100;
            //获取location索引
            let location = progressRange >= 0
                ? _locations.cfiFromPercentage(progressRange)
                : null;
            if (typeof location === 'string') {
                rendition.display(location).then(() => {
                    //更新进度，章节，以及保存当前地址
                    this.getCurProgress()
                });
            }
        },
        //根据地址渲染书页
        dispalyForLocation(rendition, curlocation) {
            console.log('dispalyForLocation::::')
            let location = null
            if (!curlocation) {
                location = getLocation(this.fileName);
            } else {
                location = curlocation
            }
            console.log('location', location)
            return new Promise((resolve, reject) => {
                if (typeof location === 'string') {
                    rendition.display(location).then(() => {
                        //计算当前的章节section并保存
                        resolve();
                    });
                } else {
                    resolve();
                }
            }).then(() => {
                this.getCurProgress()
            })
        },
        //获取当前进度
        getCurProgress() {
            console.log('--------------------')
            let locations = this.currentBook.locations;

            if (locations && locations.length && this.currentBook.rendition) {
                const currentLocation = this.currentBook.rendition.currentLocation();
                if (currentLocation && currentLocation.start) {

                    const proRange = locations.percentageFromCfi(
                        currentLocation.start.cfi
                    );
                    //保存进度
                    this.setProgress(Math.round(proRange * 100));

                    console.log('progress', this.progress);
                    //判断是否为书签并更改vuex中的isBooknark为true或false
                    this.isBookmarkFn(currentLocation.start.cfi, currentLocation.end.cfi)
                    //获取当前页号
                    this.getcurrnetNumPage(currentLocation);
                    //获取当前章节号
                    this.getCurSection(this.currentBook.rendition)

                    // saveLocation(this.fileName, currentLocation.start.cfi)
                }

            }
        },
        //获取当前页号
        getcurrnetNumPage(currentLocation) {
            if (this.pagelist) {
                const totalPage = this.pagelist.length;
                const currentPage = currentLocation.start.location;
                if (currentPage && currentPage > 0) {
                    this.setPaginate(currentPage + '/' + totalPage)
                } else {
                    this.setPaginate('')
                }
            } else { this.setPaginate('') }
        },
        //获取当前章节
        getCurSection(rendition) {
            const currentLocation = rendition.currentLocation();
            const section = currentLocation.start.index;
            //更新当前章节
            const cfirange = this.getCfiRange(currentLocation.start.cfi, currentLocation.end.cfi)
            console.log('section', section, cfirange, '\n');
            console.log('--------------------')
            saveLocation(this.fileName, cfirange)
            this.setSection(section);
        },
        // 根据章节号渲染书页
        dispalySection() {
            console.log('dispalySection::::')
            const sectionInfo = this.currentBook.section(this.section);
            if (sectionInfo && sectionInfo.href) {
                this.currentBook.rendition.display(sectionInfo.href).then(() => {
                    this.getCurProgress();
                });
            }
        },
        //判断是否为书签
        isBookmarkFn(cfi, endcfi) {
            let bookmarkList = getBookmark(this.fileName);
            if (!bookmarkList) {
                bookmarkList = []
            }
            let res = bookmarkList.filter((item) => {
                return item.cfi === cfi && endcfi == item.endcfi
            })
            if (res.length > 0) {
                this.setIsBookmark(true)
            } else {
                this.setIsBookmark(false)
            }
            console.log('bookmark', res)
        },
        //获取格式化的阅读时间
        getReadTimeText() {
            // getReadTime(this.fileName)
            return this.$t("book.haveRead").replace("$1", this.getReadTimeByMinute());
        },
        //将秒数转换为分钟数
        getReadTimeByMinute() {
            const readTime = getReadTime(this.fileName);
            if (!readTime) {
                return 0;
            } else {
                return Math.ceil(readTime / 60);
            }
        },
        //获取cfi之间的内容
        getCfiRange(start, end) {
            if (!start && !end) {
                const currentLocation = this.currentBook.rendition.currentLocation();
                start = currentLocation.start.cfi;
                end = currentLocation.end.cfi
            }
            const cfibase = start.replace(/!.*/, "");
            const cfistart = start
                .replace(/.*!/, "")
                .replace(/\)$/, "");
            const cfiend = end
                .replace(/.*!/, "")
                .replace(/\)$/, "");
            const cfirange = `${cfibase}!,${cfistart},${cfiend})`;
            return cfirange
            // return new Promise((resolve, reject) => {

            //     this.currentBook.getRange(cfirange).then(range => {
            //         const text = range.toString().replace(/\s\s/g, "");
            //         resolve(text)
            //     });
            // })

        }

    }
}

export const storeHomeMixin = {
    computed: {
        ...mapGetters(['offsetY', ...gettersKeys]),
    },
    methods: {
        ...mapActions(['setOffsetY', ...homeActionsKeys]),
        //根据书籍信息跳转至详情页
        showBookDetail(book) {
            this.$router.push({
                path: '/store/detail',
                query: {
                    fileName: book.fileName,
                    category: book.category
                }
            })
        },
    }
}

export const storeShelfMixin = {
    computed: {
        ...mapGetters([
            'isEditMode',
            'shelfList',
            'shelfSelected',
            'shelfTitleVisible',
            'offsetY',
            'shelfCategory',
            'currentType'
        ]),
    },
    methods: {
        ...mapActions([
            'setIsEditMode',
            'setShelfList',
            'setShelfSelected',
            'setShelfTitleVisible',
            'setOffsetY',
            'setShelfCategory',
            'setCurrentType'
        ]),
        //获取书架书籍列表
        getShelfList() {
            let shelfList = getBookShelf()
            console.log(shelfList)
            if (!shelfList) {
                shelf().then(response => {
                    console.log(response)
                    if (response.status === 200 && response.data && response.data.bookList) {
                        
                        shelfList = appendAddToShelf(response.data.bookList)
                        console.log(1,shelfList)
                        saveBookShelf(shelfList)
                        return this.setShelfList(shelfList)
                    }
                })
            } else {
                return this.setShelfList(shelfList)
            }
        } //将shelfList的selected置为false，同时清空选中数组
        , clearAfterNoEdit() {
            //将shelfList的selected置为false
            this.shelfSelected.forEach((item) => {
                item.selected = false;
            })
            //将ShelfSelected清空
            this.setShelfSelected([])
        },
        moveOutOfGroup(f,categoryId) {
            //从书架分组中移除
            
            this.setShelfList(this.shelfList.filter(book => {
                if (book.type === 2 && book.itemList) {
                    book.itemList = book.itemList.filter(subBook => !subBook.selected)
                }
                if(book.type === 2&&book.id == categoryId){
                    //如果flag为true则把分组删除
                    return false
                }
                return true
            })).then(() => {
                //按顺序添加至书架 移除分组无动画原因在这

                setTimeout(() => {
                    const list = computeId(appendAddToShelf([].concat(
                        removeAddFromShelf(this.shelfList), ...this.shelfSelected)))
                        
                    this.setShelfList(list).then(() => {
                        this.simpleToast(this.$t('shelf.moveBookOutSuccess'))
                        if (f) f()
                    })
                }, 50)




            })
        }
    }

}