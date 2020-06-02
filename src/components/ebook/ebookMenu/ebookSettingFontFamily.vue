<template>
  <div class="ebook-popup-list">
    <div class="ebook-popup-title">
      <div class="ebook-popup-title-icon" @click="hide">
        <span class="icon-down2"></span>
      </div>
      <span class="ebook-popup-title-text">{{$t('book.selectFont')}}</span>
    </div>
    <div class="ebbok-popup-list-wrapper">
      <div
        class="ebook-popup-item"
        v-for="(item,index) in fontFamilyList"
        :key="index"
        :class="{'selected':isSelected(item)}"
        @click="selectFontFamily(item)"
      >
        <div class="ebook-popup-item-text">{{item.font}}</div>
        <div class="ebook-popup-item-icon" v-if="isSelected(item)">
          <span class="icon-check"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ebookMixin } from "../../../utils/mixin";
import { FONT_FAMILY } from "../../../utils/book";
export default {
  mixins: [ebookMixin],
  data() {
    return {
      fontFamilyList: FONT_FAMILY
    };
  },
  methods: {
    isSelected(item) {
      return item.font == this.defaultFontFamily;
    },
    hide() {
      this.setFontFamilyVisible(false);
    },
    selectFontFamily(item) {
      this.setDefaultFontFamily(item.font).then(()=>{
          this.init_fontFamily(this.currentBook.rendition.themes,this.defaultFontFamily);
          // this.getCurProgress();
      })
      
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../../../assets/styles/global";
.ebook-popup-list {
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 200 !important;
  left: 0;
  //   height: px2rem(200);
  background: #fff;
  display: flex;
  flex-direction: column;
  font-size: px2rem(16);
  box-shadow: 0 px2rem(-4) px2rem(6) rgba(0, 0, 0, 0.1);
  .ebook-popup-title {
    flex: 0 0 px2rem(40);
    @include center;
    padding: px2rem(2) px2rem(10);
    box-sizing: border-box;
    position: relative;
    border-bottom: px2rem(1) solid #b8b9bb;
    //   @include center;
    .ebook-popup-title-icon {
      position: absolute;
      top: 0;
      left: px2rem(10);
      height: 100%;
      font-weight: bold;
      @include center;
      .icon-dowx2 {
      }
    }
    .ebook-popup-title-text {
      flex: 1;
      //   font-size:px2rem(14);
      font-weight: bold;
      @include center;
    }
  }
  .ebbok-popup-list-wrapper {
    .ebook-popup-item {
      display: flex;
      padding: px2rem(10) px2rem(10);
      box-sizing: border-box;
      .ebook-popup-item-text {
        flex: 1;
      }
      .ebook-popup-item-icon {
        @include center;
        flex: 0 0 px2rem(30);
        .icon-check {
        }
      }
      &.selected {
        color: #346cb9;
        font-weight: bold;
      }
    }
  }
}
</style>