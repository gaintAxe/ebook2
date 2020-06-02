<template>
  <div class="slide-content-wrapper">
    <transition name="slide-right">
      <div class="content" v-if="settingVisible === 3">
        <div class="content-page-wrapper" v-if="bookAvailable">
          <div class="content-page">
            <component :is="currentTab ===1?content:bookmark"></component>
          </div>
          <div class="content-tab">
            <div
              class="content-page-tab-item"
              :class="{'selected':currentTab ===1}"
              @click="selectTab(1)"
            >{{$t('book.navigation')}}</div>
            <div
              class="content-page-tab-item"
              :class="{'selected':currentTab ===2}"
              @click="selectTab(2)"
            >{{$t('book.bookmark')}}</div>
          </div>
        </div>
        <div class="content-empty" v-else>
          <ebook-slide-loading></ebook-slide-loading>
        </div>
      </div>
    </transition>
    <div class="content-bg" @click="hide"></div>
  </div>
</template>

<script>
import { ebookMixin } from "../../../utils/mixin";
import EbookSlideContents from "./ebookSlide/ebookSlideContents";
import EbookSlideBookmark from "./ebookSlide/ebookSlideBookmark";
import EbookSlideLoading from "./ebookSlide/ebookSlideLoading";
export default {
  mixins: [ebookMixin],
  components: { EbookSlideLoading },
  data() {
    return {
      currentTab: 1,
      content: EbookSlideContents,
      bookmark: EbookSlideBookmark
    };
  },
  methods: {
    //关闭
    hide() {
      this.setSettingVisible(-1);
    },
    //选择
    selectTab(type) {
      this.currentTab = type;
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../../../assets/styles/global";
.slide-content-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 300;
  display: flex;
  width: 100%;
  height: 100%;
  .content {
    flex: 0 0 85%;
    width: 85%;
    height: 100%;
    .content-page-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      .content-page {
        flex: 1;
        width: 100%;
        overflow: hidden;
      }
      .content-tab {
        flex: 0 0 px2rem(48);
        width: 100%;
        height: px2rem(48);
        display: flex;
        .content-page-tab-item {
          flex: 1;
          font-size: px2rem(12);
          @include center;
        }
      }
    }
    .content-empty {
      width: 100%;
      height: 100%;
      @include center;
    }
  }
  .content-bg {
    flex: 0 0 15%;
    width: 15%;
    height: 100%;
  }
}
</style>