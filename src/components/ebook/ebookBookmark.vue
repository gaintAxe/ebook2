<template>
  <div class="ebook-bookmark" ref="ebookBookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{text}}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed?fixedStyle:{}">
      <book-mark :width="15" :height="35" ref="bookmark" :color="color"></book-mark>
    </div>
  </div>
</template>

<script>
import { ebookMixin } from "../../utils/mixin";
import BookMark from "../common/Bookmark";
import { realPx, px2rem } from "../../utils/utils";
import { getBookmark, saveBookmark } from "../../utils/localStorage";

const BLUE = "#346cbc";
const WHITE = "#fff";
export default {
  mixins: [ebookMixin],
  components: { BookMark },
  data() {
    return {
      text: this.$t("book.pulldownAddMark"),
      color: WHITE,
      isFixed: false
    };
  },
  methods: {
    beforeThreshold(v) {
      //状态2：35-55
      this.$refs.ebookBookmark.style.top = `${-v}px`;
      this.beforeHeight();
      const iconDown = this.$refs.iconDown;
      if (iconDown.style.transform === "rotate(180deg)") {
        iconDown.style.transform = "rotate(0deg)";
      }
    },
    afterThreshold(v) {
      //状态3 55以上 进行书签的添加或者删除操作
      this.$refs.ebookBookmark.style.top = `${-v}px`;

      if (this.isBookmark) {
        this.text = this.$t("book.releaseDeleteMark");
        this.color = WHITE;
        this.isFixed = false;
      } else {
        this.text = this.$t("book.releaseAddMark");
        this.color = BLUE;
        this.isFixed = true;
      }
      const iconDown = this.$refs.iconDown;
      if (
        iconDown.style.transform === "" ||
        iconDown.style.transform === "rotate(0deg)"
      ) {
        iconDown.style.transform = "rotate(180deg)";
      }
    },
    beforeHeight() {
      //状态1：未超过35px
      if (this.isBookmark) {
        this.text = this.$t("book.pulldownDeleteMark");
        this.color = BLUE;
        this.isFixed = true;
      } else {
        this.text = this.$t("book.pulldownAddMark");
        this.color = WHITE;
        this.isFixed = false;
      }
    },
    restore() {
      //状态4：归位
      setTimeout(() => {
        this.$refs.ebookBookmark.style.top = `${-this.height}px`;
        this.$refs.iconDown.style.transform = "rotate(0deg)";
      }, 200);
      if (this.isFixed) {
        this.setIsBookmark(true);
        this.addBookmark();
      } else {
        this.setIsBookmark(false);
        this.removeBookmark();
      }
    },
    addBookmark() {
      this.bookmark = getBookmark(this.fileName);
      if (!this.bookmark) {
        this.bookmark = [];
      }
      const currentLocation = this.currentBook.rendition.currentLocation();
      const cfibase = currentLocation.start.cfi.replace(/!.*/, "");
      const cfistart = currentLocation.start.cfi
        .replace(/.*!/, "")
        .replace(/\)$/, "");
      const cfiend = currentLocation.end.cfi
        .replace(/.*!/, "")
        .replace(/\)$/, "");

      const cfirange = `${cfibase}!,${cfistart},${cfiend})`;
      console.log(cfirange);
      this.currentBook.getRange(cfirange).then(range => {
        const text = range.toString().replace(/\s\s/g, "");
        this.bookmark.push({
          cfi: currentLocation.start.cfi,
          endcfi:currentLocation.end.cfi,
          text: text
        });
        saveBookmark(this.fileName, this.bookmark);
        console.log(range.toString());
      });
    },
    removeBookmark() {
      const currentLocation = this.currentBook.rendition.currentLocation();
      const cfi = currentLocation.start.cfi;
      this.bookmark = getBookmark(this.fileName);
      if (!this.bookmark) {
        this.bookmark = [];
      } else {
        this.bookmark = this.bookmark.filter(item => item.cfi != cfi);
      }
      saveBookmark(this.fileName, this.bookmark);
      this.setIsBookmark(false)
    }
  },
  mounted(){
    
  },
  watch: {
    offsetY(v) {
      if (!this.bookAvailable || this.menuVisible || this.settingVisible > 0) {
        return;
      }
      if (v >= this.height && v <= this.threshold) {
        this.beforeThreshold(v);
      } else if (v >= this.threshold) {
        this.afterThreshold(v);
      } else if (v > 0 && v < this.height) {
        this.beforeHeight();
      } else if (v === 0) {
        this.restore();
      }
    },isBookmark(val){
      this.beforeHeight()
      this.isFixed = val
    }
  },
  computed: {
    height() {
      return realPx(35);
    },
    threshold() {
      return realPx(55);
    },
    fixedStyle() {
      return {
        position: "fixed",
        top: 0,
        right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`
      };
    },
    
  }
};
</script>

<style lang='scss' scoped>
@import "../../assets/styles/global";
.ebook-bookmark {
  position: absolute;
  top: px2rem(-35);
  left: 0;
  z-index: 200;
  width: 100%;
  height: px2rem(35);
  background: black;
  .ebook-bookmark-text-wrapper {
    position: absolute;
    right: px2rem(45);
    bottom: 0;
    display: flex;
    .ebook-bookmark-down-wrapper {
      font-size: px2rem(14);
      color: white;
      transition: all 0.2s linear;
      @include center;
    }
    .ebook-bookmark-text {
      font-size: px2rem(14);
      color: white;
    }
  }
  .ebook-bookmark-icon-wrapper {
    position: absolute;
    right: 0;
    bottom: 0;
    margin-right: px2rem(10);
  }
}
</style>