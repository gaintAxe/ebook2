<template>
  <!-- <transition name="slide-up"> -->
  <div class="setting-theme">
    <div
      class="setting-theme-item"
      v-for="(item,index) in themeList"
      :key="index"
      :class="{'selected':isSelected(item)}"
    >
      <div class="preview" :class="{'selected':isSelected(item)}">
        <div
          class="previewColor"
          :style="{'background':item.style.body.background}"
          @click="select(item)"
        ></div>
      </div>
      <div class="text">{{item.alias}}</div>
    </div>
  </div>
  <!-- </transition> -->
</template>

<script>
import { ebookMixin } from "../../../utils/mixin";

export default {
  mixins: [ebookMixin],
  data() {
    return {};
  },
  methods: {
    select(item) {
      this.setDefaultTheme(item.name).then(() => {
        this.init_theme(this.currentBook.rendition.themes, this.defaultTheme);
      });
    },
    isSelected(item) {
      return item.name.toLowerCase() == this.defaultTheme.toLowerCase();
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../../../assets/styles/global";
.setting-theme {
  height: 100%;
  width: 100%;
  display: flex;
  color: #dcdcdc;
  .selected {
    // background:#DCDCDC;
    color: black;
  }
  .setting-theme-item {
    flex: 1;
    display: flex;
    flex-direction: column;

    .preview {
      flex: 1;
      display: flex;
      margin: px2rem(8);
      &.selected {
        box-shadow: 0 px2rem(4) px2rem(6) 0 rgba(0, 0, 0, 0.1);
      }
      .previewColor {
        flex: 1;
        box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.15);
      }
    }
    .text {
      height: px2rem(25);
      font-size: px2rem(20);
      //   color: #dcdcdc;
      @include center;
    }
  }
}
</style>