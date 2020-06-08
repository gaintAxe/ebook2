<template>
  <div class="store-shelf">
    <shelf-title :isShowBack="true" :title="shelfCategory.title"></shelf-title>
    <scroll
      class="store-shelf-scroll-wrapper"
      :top="0"
      @onScroll="onScroll($event)"
      :bottom="scrollBottom"
      ref="scroll"
      v-if="ifShowList"
    >
      <shelf-list :top="52" :data="shelfCategory.itemList"></shelf-list>
    </scroll>
    <div class="store-shelf-empty-view" v-else>{{$t('shelf.groupNone')}}</div>
    <shelf-footer></shelf-footer>
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
      scrollBottom: 0,
      curData: []
    };
  },
  computed: {
    ifShowList() {
      return (
        this.shelfCategory.itemList && this.shelfCategory.itemList.length > 0
      );
    }
  },
  methods: {
    onScroll(val) {
      this.setOffsetY(val);
    },
    getCategoryList(title) {
      console.log(this.shelfList);
      const categoryList = this.shelfList.filter(item => {
        return item.type == 2 && item.title == title;
      })[0];
      console.log(categoryList);
      if (categoryList) {
        this.setShelfCategory(categoryList);
      }
    }
  },
  mounted() {
    console.log("mounted");
    if (!this.shelfList || this.shelfList.length == 0) {
      this.getShelfList();
    }
    this.getCategoryList(this.$route.query.title);
    this.setCurrentType(2);
  },
  watch: {
    isEditMode(isEditMode) {
      console.log("22212");
      this.scrollBottom = isEditMode ? 48 : 0;
      this.$nextTick(() => {
        if (this.$refs.scroll) {
          this.$refs.scroll.refresh();
        }
      });
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
  .store-shelf-empty-view {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: px2rem(14);
    color: #333;
    @include center;
  }
}
</style>