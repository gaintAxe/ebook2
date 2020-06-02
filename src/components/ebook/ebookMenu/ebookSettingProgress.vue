<template>
  <div class="setting-progress">
    <div class="read-time-wrapper">
      <span class="read-time-text">{{getReadTimeText()}}</span>
      <span class="icon-forward"></span>
    </div>
    <div class="progress-wrapper">
      <div class="progress-icon-wrapper" @click="preSection()">
        <span class="icon-back"></span>
      </div>
      <input
        type="range"
        class="progress"
        max="100"
        min="0"
        step="1"
        ref="progress"
        @change="onProgressChange($event.target.value)"
        @input="onProgressInput($event.target.value)"
        :value="progress"
        :disabled="!bookAvailable"
      />
      <div class="progress-icon-wrapper" @click="nextSection()">
        <span class="icon-forward"></span>
      </div>
    </div>
    <div class="text-wrapper">
      <span class="progress-section-text">{{getSectionName}}</span>
      <span>({{bookAvailable?progress+'%':'加载中...'}})</span>
    </div>
  </div>
</template>

<script>
import { ebookMixin } from "../../../utils/mixin";
import { getReadTime } from "../../../utils/localStorage";

export default {
  mixins: [ebookMixin],
  computed: {
    //获取章节名
    getSectionName() {
      // if (this.section) {
      //   const sectionInfo = this.currentBook.section(this.section);
      //   if (
      //     sectionInfo &&
      //     sectionInfo.href &&
      //     this.currentBook &&
      //     this.currentBook.navigation
      //   ) {
      //     let str = this.currentBook.navigation
      //       .get(sectionInfo.href)
      //       .label.trim();
      //     if (str.length > 10) {
      //       str = str.substr(0, 20) + "...";
      //     }
      //     return str;
      //   }
      // }
      if (!this.navigation) {
        return "";
      } else {
        return this.section >= 0
          ? this.navigation[this.section].label.substr(0, 40) + "..."
          : "";
      }
    }
  },
  methods: {
    onProgressChange(val) {
      //   最终
      this.setProgress(val);
      this.displayForProgress(this.progress, this.currentBook.rendition);
    },
    onProgressInput(val) {
      //拖动
      this.updateProgressBg(val);
    },
    //更新已读进度条的样式
    updateProgressBg(val) {
      this.$refs.progress.style.backgroundSize = `${val}% 100%`;
    },
    //上一站
    preSection() {
      if (this.section > 0 && this.bookAvailable) {
        this.setSection(this.section - 1).then(() => {
          this.dispalySection();
        });
      }
    },
    //下一章
    nextSection() {
      if (
        this.section < this.currentBook.spine.length - 1 &&
        this.bookAvailable
      ) {
        this.setSection(this.section + 1).then(() => {
          this.dispalySection();
        });
      }
    }
  },
  watch: {
    progress(val) {
      this.updateProgressBg(val);
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../../../assets/styles/global";
.setting-progress {
  position: relative;
  width: 100%;
  height: 100%;
  .read-time-wrapper {
    //   position: absolute;left:0;
    //   top:0;
    width: 100%;
    height: 30%;

    font-size: px2rem(14);
    @include center;
    padding-top: px2rem(10);
    box-sizing: border-box;
  }
  .progress-wrapper {
    width: 100%;
    height: 40%;
    @include center;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .progress-icon-wrapper {
      font-size: px2rem(20);
      margin: 0 px2rem(8);
    }
    .progress {
      width: 100%;
      -webkit-appearance: none;
      height: px2rem(2);
      //   background: -webkit-linear-gradient(#999, #999) no-repeat, #ddd;
      //   background-size: 0 100% ;
      &:focus {
        outline: none;
      }
      &::-webkit-slider-thumb {
        // 这个是中间的按钮
        //-webkit-appearance 阻止默认样式
        -webkit-appearance: none;
        height: px2rem(20);
        width: px2rem(20);
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 px2rem(4) px2rem(4) 0 rgba(0, 0, 0, 0.15);
        border: px2rem(1) solid #ddd;
      }
    }
  }
  .text-wrapper {
    font-size: px2rem(14);
    height: 30%;
    @include center;
    .progress-section-text {
      //超出省略号
      text-overflow: ellipsis;
      overflow: hidden;
      //不换行
      white-space: nowrap;
    }
  }
}
</style>