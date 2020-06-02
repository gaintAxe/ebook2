<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div class="ebook-reader-mask" @click="onMaskClick" @touchmove="move" @touchend="moveEnd"></div>
    <!-- <div class="loading" v-if="!this.bookAvailable">

      <ebook-slide-loading  ></ebook-slide-loading>
    </div>-->
  </div>
</template>

<script>
import Epub from "epubjs";
global.ePub = Epub;

import { ebookMixin } from "../../utils/mixin";

import { themeList, addCss, flatten } from "../../utils/book";

import EbookSlideLoading from "./ebookMenu/ebookSlide/ebookSlideLoading";
const NGINX_SERVER = process.env.VUE_APP_RES_URl;
export default {
  mixins: [ebookMixin],
  components: { EbookSlideLoading },
  methods: {
    move(e) {
      if (this.menuVisible || this.settingVisible > 0 || !this.bookAvailable) {
        return;
      }
      let offsetY = 0;
      if (this.firstOffsetY) {
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY;
        // if (offsetY >= 35) {
        //   offsetY = 35;
        // }
        this.setOffsetY(offsetY);
      } else {
        this.firstOffsetY = e.changedTouches[0].clientY;
      }

      // console.log("move", offsetY);
      e.preventDefault();
      e.stopPropagation();
    },
    moveEnd(e) {
      this.setOffsetY(0);
      // console.log("moveEnd", e.offsetY);
      this.firstOffsetY = 0;
    },
    onMaskClick(e) {
      const offsetX = e.offsetX;
      const width = window.innerWidth;
      if (offsetX > 0 && offsetX < width * 0.3) {
        //上一页
        this.preOrNextPage(0);
        this.toggleTitleAndMenu(0);
      } else if (offsetX > 0 && offsetX > width * 0.7) {
        //下一页
        this.preOrNextPage(1);
        this.toggleTitleAndMenu(0);
      } else {
        //呼出菜单
        this.toggleTitleAndMenu();
      }
    },
    //初始化手势
    initEpub_touch(rendition, globel) {
      //触碰事件
      rendition.on("touchstart", e => {
        //手指初始位置的x
        globel.touchStartX = e.changedTouches[0].clientX;
        //开始时间 用于计算手指触碰时间
        globel.touchStartTime = e.timeStamp;
      });
      //手指离开事件
      rendition.on("touchend", e => {
        //手指偏移量
        const offsetX = e.changedTouches[0].clientX - globel.touchStartX;
        //手指触碰时间
        const time = e.timeStamp - globel.touchStartTime;
        if (time < 500 && offsetX > 40) {
          //上一页
          this.preOrNextPage(0);
          this.toggleTitleAndMenu(0);
        } else if (time < 500 && offsetX < -40) {
          //下一页
          this.preOrNextPage(1);
          this.toggleTitleAndMenu(0);
        } else if (offsetX < -40 || time < 500) {
          //点击呼出菜单
          this.toggleTitleAndMenu();
        }
        //阻止事件冒泡
        // e.preventDefault();
        // e.stopPropagetion();
      });
      rendition.on("touchmove", e => {
        console.log(e);
      });
    },
    //注册样式文件
    registerFontFamilyCss(rendition) {
      return new Promise((resolve, reject) => {
        rendition.hooks.content.register(contents => {
          Promise.all([
            contents.addStylesheet(`${NGINX_SERVER}/fonts/daysOne.css`),
            contents.addStylesheet(`${NGINX_SERVER}/fonts/cabin.css`),
            contents.addStylesheet(`${NGINX_SERVER}/fonts/montserrat.css`),
            contents.addStylesheet(`${NGINX_SERVER}/fonts/tangerine.css`)
          ]).then(() => {
            resolve();
          });
        });
      });
    },

    //初始化电子书函数
    initEpub() {
      const url = this.fileName;
      this.book = new Epub(url);
      this.setCurBook(this.book);
      this.rendition = this.book.renderTo("read", {
        width: window.innerWidth,
        height: window.innerHeight
        // method:'default'
      });
      //渲染到read
      this.rendition.display();
      this.initEpub_touch(this.rendition, this);

      //初始化字号
      this.themes = this.rendition.themes;
      this.init_font(this.themes, this.defaultFontSize);

      //注册字体的样式文件
      this.registerFontFamilyCss(this.rendition).then(() => {
        let font = this.defaultFontFamily;
        //设置字体
        this.init_fontFamily(this.themes, font);
      });

      //注册主题
      this.registerTheme(this.themeList, this.themes);
      //选择默认主题
      this.init_theme(this.themes, this.defaultTheme);
      this.book.ready
        .then(() => {
          // this.navigation = this.book.navigation;
          //分页算法

          const pageNum =
            750 * (window.innerWidth / 375) * (this.defaultFontSize / 16);
          return this.book.locations.generate(pageNum);
        })
        .then(result => {
          this.locations = this.book.locations;
          this.setBookAvailable(true);

          //根据progress渲染页数
          //   this.displayForProgress(this.progress,this.currentBook.rendition)
          this.dispalyForLocation(this.currentBook.rendition).then(() => {});
          console.log("ready");
        });
      //解析电子书的内容
      //获取封面的基本信息

      this.parseBook();
    },
    //根据路由传参来计算filename
    computedFileName() {
      const fileName = this.$route.params.filename + ".epub";
      const dir = this.$route.params.dir;
      let serverPath = "";
      if (!dir) {
        serverPath = NGINX_SERVER + "/" + fileName.split("|").join("/");
      } else {
        serverPath = NGINX_SERVER + "/" + dir + "/" + fileName;
      }
      console.log(serverPath);
      // serverPath:http://192.168.1.4:8081/Biomedicine/2014_Book_Self-ReportedPopulationHealthA.epub
      return serverPath;
    },
    //翻页
    preOrNextPage(flag) {
      if (!this.rendition) {
        return;
      }
      if (!flag) {
        this.rendition.prev();
      } else {
        this.rendition.next();
      }
      this.getCurProgress();
    },
    toggleTitleAndMenu(data) {
      if (data === 0) {
        //强制关闭
        this.setMenuVisible(false);
      } else if (data === 1) {
        //强制开启
        this.setMenuVisible(true);
      } else {
        this.setMenuVisible(!this.menuVisible);
      }
    }, //注册主题
    registerTheme(themeList, themes) {
      for (let i in themeList) {
        let item = themeList[i];
        themes.register(item.name, item.style);
      }
    },
    parseBook() {
      this.book.loaded.cover.then(cover => {
        //获取图片连接
        this.book.archive.createUrl(cover).then(url => {
          //将图片连接存入vuex
          this.setCover(url);
        });
      });
      //获取标题和作者信息
      this.book.loaded.metadata.then(metadata => {
        this.setMetadata(metadata);
      });

      //获取目录
      //navigation.toc[i]一级目录 .label表示目录的内容 .href为路径
      //navigation.toc[i].subitems[i]二级目录  navigation.toc[i].subitems[i].parent指向父目录的id （navigation.toc[i].id）
      //navigation.toc[i].subitems[i].subitems[i]三级目录
      this.book.loaded.navigation.then(nav => {
        const navItem = flatten(nav.toc);

        //根据parent获取层级
        function find(item, level = 0) {
          if (!item.parent) {
            return level;
          } else {
            return find(
              navItem.filter(parentItem => parentItem.id === item.parent)[0],
              ++level
            );
          }
        }
        //添加level
        navItem.forEach(item => {
          item.level = find(item);
        });

        this.setNavigation(navItem);
      });
    }
  },
  mounted() {
    this.setFileName(this.computedFileName()).then(() => {
      this.initEpub();
    });
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";
.ebook-reader {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .ebook-reader-mask {
    position: absolute;
    z-index: 109;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .loading {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: #fff;
    @include center;
  }
}
</style>