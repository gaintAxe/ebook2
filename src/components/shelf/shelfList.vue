<template>
  <div class="shelf-list" :style="{'top':itemTop}">
    <transition-group name="list" tag="div" id="shelf-list">
      <div class="shelf-list-item-wrapper" v-for="(item,index) in curData" :key="item.id">
        <shelf-item :data="item" :style="{height:itemHeight}"></shelf-item>
        <div class="shelf-list-title-wrapper">
          <span class="shelf-list-title title-small">{{item.title}}</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import ShelfItem from "./shelfItem";
import { storeShelfMixin } from "../../utils/mixin";
import { realPx, px2rem } from "../../utils/utils";
export default {
  mixins: [storeShelfMixin],
  components: { ShelfItem },
  props: {
    top: {
      type: Number,
      default: 94
    },
    data: {
      type: Array,
      default: null
    }
  },
  computed: {
    itemHeight() {
      // w/250 =h/350
      // h =w/250*350
      return ((window.innerWidth - realPx(120)) / 3 / 250) * 350 + "px";
    },
    itemTop() {
      return px2rem(this.top) + "rem";
    },
    curData() {
      if (!this.data) {
        return this.shelfList;
      } else {
        return this.data;
      }
    }
  },
  methods: {},
  watch: {
    data(val) {
      console.log(val);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";
.shelf-list {
  position: absolute;
  // top: px2rem(94);
  left: 0;
  z-index: 100;
  width: 100%;
  #shelf-list {
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .shelf-list-item-wrapper {
      flex: 0 0 33.33%;
      width: 33.33%;
      padding: px2rem(15);
      box-sizing: border-box;
      &.list-leave-active {
        display: none;
      }
      &.list-move {
        transition: transform 0.3s;
      }
      .shelf-list-title-wrapper {
        margin-top: px2rem(10);
        .shelf-list-title {
        }
      }
    }
  }
}
</style>