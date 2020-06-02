<template>
  <div class="menu-bar">
    <transition name="slide-up">
      <div
        class="menu-wrapper"
        v-show="menuVisible"
        ref="menuWrapper"
        :class="{'no-box-shadow':isNoBoxShadow}"
      >
        <div class="icon-wrapper">
          <span class="icon-menu icon" @click="selectSetting(3)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-progress icon" @click="selectSetting(2)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-bright icon" @click="selectSetting(1)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-a icon" @click="selectSetting(0)">A</span>
        </div>
      </div>
    </transition>
    <transition name="slide-up">
      <div class="setting-wrapper" v-show="settingVisible!==-1&&settingVisible!==3">
        <ebook-setting-font v-show="settingVisible == 0"></ebook-setting-font>

        <ebook-setting-theme v-show="settingVisible == 1"></ebook-setting-theme>
        <ebook-setting-progress v-show="settingVisible == 2"></ebook-setting-progress>
      </div>
    </transition>
    <transition name="fade">
      <ebook-slide v-show="settingVisible == 3"></ebook-slide>
    </transition>
    <transition name="popup-slide-up">
      <ebook-setting-font-family v-show="fontFamilyVisible"></ebook-setting-font-family>
    </transition>
  </div>
</template>

<script>
import { ebookMixin } from "../../utils/mixin";

import EbookSettingFont from "./ebookMenu/ebookSettingFont";
import EbookSettingFontFamily from "./ebookMenu/ebookSettingFontFamily";
import EbookSettingTheme from "./ebookMenu/ebookSettingTheme";
import EbookSettingProgress from "./ebookMenu/ebookSettingProgress";
 import EbookSlide from'./ebookMenu/ebookSlide'
export default {
  mixins: [ebookMixin],
  components: {
    EbookSettingFont,
    EbookSettingFontFamily,
    EbookSettingTheme,
    EbookSettingProgress,
    EbookSlide
  },
  data() {
    return {
      isNoBoxShadow: false
    };
  },
  methods: {
    selectSetting(type) {
      // if (!this.bookAvailable) {
      //   return;
      // }
      if (type == this.settingVisible) {
        this.setSettingVisible(-1);
      } else {
        this.setSettingVisible(type);
      }
    }
  },
  watch: {
    settingVisible(val) {
      if (val == -1) {
        //阴影出现
        setTimeout(() => {
          this.isNoBoxShadow = false;
        }, 300);
      } else {
        //阴影消失
        if (val == 3) {
          this.setMenuVisible(false);
        }
        this.isNoBoxShadow = true;
      }
    },
    menuVisible(val) {
      if (!val) {
        if (this.settingVisible !== 3) {
          this.setSettingVisible(-1);
        }

        this.setFontFamilyVisible(false);
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../../assets/styles/global";
.menu-bar {
  .menu-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 110;
    width: 100%;
    height: px2rem(48);
    background: #fff;
    display: flex;
    box-shadow: 0 px2rem(-2) px2rem(2) rgba(0, 0, 0, 0.15);
    font-size: px2rem(20);
    &.no-box-shadow {
      box-shadow: none;
    }
    .icon-wrapper {
      flex: 1;
      @include center;
      .icon-progress,
      .icon-bright {
        font-size: px2rem(22);
      }
    }
  }
  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 109;
    width: 100%;
    height: px2rem(90);
    background: #fff;
    box-shadow: 0 px2rem(-2) px2rem(2) rgba(0, 0, 0, 0.15);
  }
  .content-mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 120;
    display: flex;
    width: 100%;
    height: 100%;
    background: rgba(51, 51, 51, 0.8);
    .list-wrapper {
      width: 70%;
      height: 100%;
      z-index: 130;
      background: #fff;
      overflow: hidden;
      .toc-wrapper {
        padding: px2rem(10);
        font-size: px2rem(18);
      }
    }
    .loadings {
      width: 70%;
      height: 100%;
      z-index: 130;
      background: #fff;
      overflow: hidden;
    }
  }
}
</style>