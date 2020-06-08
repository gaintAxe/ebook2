<template>
  <div class="ebook" ref="ebook">
    <!-- <ebook-reader></ebook-reader> -->
    <ebook-header></ebook-header>
    <ebook-title></ebook-title>
    <router-view></router-view>
    <ebook-menu></ebook-menu>
    <ebook-bookmark></ebook-bookmark>
    <ebook-footer></ebook-footer>
  </div>
</template>

<script>
import EbookTitle from "../../components/ebook/ebookTitle";
import EbookReader from "../../components/ebook/ebookReader";
import EbookMenu from "../../components/ebook/ebookMenu";
import EbookBookmark from "../../components/ebook/ebookBookmark";
import EbookHeader from '../../components/ebook/ebookHeader'
import EbookFooter from '../../components/ebook/ebookFooter'

import { ebookMixin } from "../../utils/mixin";
import { px2rem } from "../../utils/utils";
import { getReadTime, saveReadTime } from "../../utils/localStorage";
export default {
  mixins: [ebookMixin],
  components: { EbookReader, EbookMenu, EbookTitle, EbookBookmark,EbookHeader ,EbookFooter},
  methods: {
    startLoopReadTime() {
      let readTime = getReadTime(this.fileName);
      if (!readTime) {
        readTime = 0;
      }
      this.task = setInterval(() => {
        readTime++;
        if (readTime % 30 === 0) {
          saveReadTime(this.fileName, readTime);
        }
      }, 1000);
    },
    move(v) {
      let ebook = this.$refs.ebook;
      ebook.style.top = `${px2rem(v)}rem`;
      if (v == 0) {
        ebook.style.transition = "all .2s linear";
      }
      setTimeout(() => {
        ebook.style.transition = "";
      }, 200);
    }
  },
  mounted() {
    this.startLoopReadTime();
  },
  watch: {
    offsetY(v) {
      if (v >= 0) {
        this.move(v);
      }
    }
  },
  beforeDestroy() {
    if (this.task) {
      clearInterval(this.task);
      this.task = null;
      // saveReadTime(this.fileName, 0);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";
.ebook {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

</style>