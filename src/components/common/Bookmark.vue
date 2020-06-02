<template>
  <div class="bookmark" :style="style"></div>
</template>

<script>
import { px2rem } from "../../utils/utils";
export default {
  props: {
    width: Number,
    height: Number,
    color: {
      type: String,
      default: "white"
    }
  },
  computed: {
    style() {
      let obj = {};
      if (this.color) {
        obj["borderColor"] = `${this.color} ${this.color} transparent ${this.color}`;
      }
      let defaultHeightTop = `${px2rem(50)}rem`;
      let defaultWidth = `${px2rem(10)}rem`;
      let defaultHeightBottom = `${px2rem(10)}rem`;
      if (this.width) {
        defaultWidth = `${px2rem(this.width/2)}rem`;
      }
      if (this.height) {
        defaultHeightTop = `${px2rem(this.height-10)}rem`;
      }
      obj['borderWidth'] =`${defaultHeightTop} ${defaultWidth} ${defaultHeightBottom} ${defaultWidth}`;
      return obj;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";
.bookmark {
  width: 0;
  height: 0;
  border-width: px2rem(50) px2rem(10) px2rem(10) px2rem(10);
  border-style: solid;
  border-color: white white transparent white;
}
</style>