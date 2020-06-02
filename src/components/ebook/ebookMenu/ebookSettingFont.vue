<template>
  <div class="wrapper">
    <div class="setting-font-size">
      <div class="preview" :style="{fontSize:fontSizefirst+'px'}">A</div>
      <div class="select">
        <div
          class="select-wrapper"
          v-for="(item,index) in fontSizeList"
          :key="index"
          @click="setFontSize(item.fontSize)"
        >
          <div class="line"></div>
          <div class="point-wrapper">
            <div class="point" v-show="item.fontSize == defaultFontSize">
              <div class="small-point"></div>
            </div>
          </div>
          <div class="line"></div>
        </div>
      </div>
      <div class="preview" :style="{fontSize:fontSizeLast+'px'}">A</div>
    </div>
    <div class="setting-font-family" @click="showFontFamilyPopup">
      <div class="setting-font-family-text-wrapper">
        <span class="setting-font-family-text">{{defaultFontFamily}}</span>
      </div>
      <div class="setting-font-family-icon-wrapper">
        <span class="icon-forward"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { FONT_SIZE_LIST } from "../../../utils/book";

import { ebookMixin } from "../../../utils/mixin";

export default {
  mixins: [ebookMixin],
  computed: {
    fontSizeLast() {
      return this.fontSizeList[this.fontSizeList.length - 1].fontSize;
    },
    fontSizefirst() {
      return this.fontSizeList[0].fontSize;
    }
  },
  data() {
    return {
      fontSizeList: FONT_SIZE_LIST
    };
  },
  methods: {
    setFontSize(fontSize) {
      this.setDefaultFontSize(fontSize).then(()=>{
          this.init_font(this.currentBook.rendition.themes,this.defaultFontSize);
          // this.getCurProgress();
      })
      
    },
    showFontFamilyPopup(){
      this.setFontFamilyVisible(true)
    }
  }
};
</script>

<style lang="scss" scoped >
@import "../../../assets/styles/global";
.wrapper {
  padding: 0 10px;
  box-sizing: border-box;
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;
  flex-direction: column;
  .setting-font-size {
    display: flex;
    flex: 2;
    height: 100%;
    .preview {
      flex: 0 0 px2rem(40);
      @include center;
    }
    .select {
      display: flex;
      flex: 1;
      .select-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        &:first-child {
          .line {
            &:first-child {
              border: none;
            }
          }
        }
        &:last-child {
          .line {
            &:last-child {
              border: none;
            }
          }
        }
        .line {
          flex: 1;
          height: 0;
          border-top: px2rem(1) solid #ccc;
        }
        .point-wrapper {
          flex: 0 0 0;
          position: relative;
          width: 0;
          height: px2rem(7);
          border-left: px2rem(1) solid #ccc;
          .point {
            position: absolute;
            top: px2rem(-6);
            left: px2rem(-10);
            width: px2rem(20);
            height: px2rem(20);
            border-radius: 50%;
            background: #fff;
            border: px2rem(1) solid #ccc;
            box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.15);
            @include center;
            .small-point {
              width: px2rem(5);
              height: px2rem(5);
              background: black;
              border-radius: 50%;
            }
          }
        }
      }
    }
  }
  .setting-font-family {
    flex: 1;
    font-size:px2rem(14);
    @include center;
    .setting-font-family-text-wrapper {
      @include center;
      .setting-font-ffamily-text {
      }
    }
    .setting-font-family-icon-wrapper {
      .icon-forward {
      }
    }
  }
}
</style>