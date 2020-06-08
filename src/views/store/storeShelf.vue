<template>
  <div class="store-shelf">
    <shelf-title :title="$t('shelf.title')"></shelf-title>
    <scroll
      class="store-shelf-scroll-wrapper"
      :top="0"
      @onScroll="onScroll($event)"
      :bottom="scrollBottom"
      ref="scroll"
    >
      <shelf-search ref="shelfSearch"></shelf-search>
      <shelf-list></shelf-list>
      <shelf-footer></shelf-footer>
    </scroll>
  </div>
</template>

<script>
import { storeShelfMixin } from "../../utils/mixin";
import { appendAddToShelf } from "../../utils/store.js";

import Scroll from "../../components/common/Scroll";
import ShelfTitle from "../../components/shelf/shelfTitle";
import ShelfSearch from "../../components/shelf/shelfSearch";
import ShelfList from "../../components/shelf/shelfList";
import ShelfFooter from "../../components/shelf/shelfFooter";
export default {
  mixins: [storeShelfMixin],
  components: {
    ShelfTitle,
    Scroll,
    ShelfSearch,
    ShelfList,
    ShelfFooter
  },
  data() {
    return {
      scrollBottom: 0
    };
  },
  methods: {
    onScroll(val) {
      this.setOffsetY(val);
    }
  },
  mounted() {
    this.getShelfList();
    this.setShelfCategory([])
    this.setCurrentType(1)
  },
  watch: {
    isEditMode(isEditMode) {
      this.scrollBottom = isEditMode ? 48 : 0;
      this.$nextTick(()=>{
        this.$refs.scroll.refresh();
      })
    }
  }
};
</script>


<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.store-shelf {
  position: relative;
  z-index: 100;
  width: 100%;
  height: 100%;
  background: white;
  .store-shelf-scroll-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
  }
}
</style>