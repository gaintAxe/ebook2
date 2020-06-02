import { mapActions, mapGetters } from 'vuex'

import { getters } from '../store/getters'
import { actions } from '../store/modules/book/actions'
const actionsKeys = Object.keys(actions);
const gettersKeys = Object.keys(getters);

import { themeList, addCss, flatten } from "../utils/book";
import { saveLocation, getLocation, getReadTime, getBookmark, saveBookmark } from '../utils/localStorage'
const NGINX_SERVER = process.env.VUE_APP_RES_URl;
export const ebookMixin = {
    computed: {
        ...mapGetters(gettersKeys),
        themeList: function () {
            return themeList(this);
        }
    },
    methods: {
        ...mapActions(actionsKeys),
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
            addCss(`${NGINX_SERVER}/theme/theme_${theme}.css`);
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
            return new Promise((resolve, reject) => {
                if (typeof location === 'string') {
                    rendition.display(location).then(() => {
                        //计算当前的章节section并保存
                        resolve();
                    });
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

                    this.setProgress(Math.round(proRange * 100));

                    console.log('progress', this.progress);
                    this.isBookmarkFn(currentLocation.start.cfi,currentLocation.end.cfi)
                    this.getCurSection(this.currentBook.rendition)

                    // saveLocation(this.fileName, currentLocation.start.cfi)
                }

            }
        },
        //获取当前章节
        getCurSection(rendition) {
            const currentLocation = rendition.currentLocation();
            const section = currentLocation.start.index;
            //更新当前章节
            console.log('section', section, currentLocation.start.cfi, '\n');
            console.log('--------------------')
            saveLocation(this.fileName, currentLocation.start.cfi)
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
        isBookmarkFn(cfi,endcfi) {
            const bookmarkList = getBookmark(this.fileName);
            let res = bookmarkList.filter((item) => {
                // console.log(item.cfi===cfi)
                return item.cfi === cfi&&endcfi==item.endcfi
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
            return new Promise((resolve, reject) => {

                this.currentBook.getRange(cfirange).then(range => {
                    const text = range.toString().replace(/\s\s/g, "");
                    resolve(text)
                });
            })

        }

    }
}