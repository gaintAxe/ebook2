<template>
  <div class="shelft-item-caterogy" ref="categoryList">
    <div class="shelf-item-category-list" v-if="data.itemList.length>0">
      <div class="shelf-item-category-item" v-for="(item,index) in showInCover">
        <img :src="item.cover" alt class="shelf-item-category-item-img" />
      </div>
    </div>
    <div class="shelf-item-category-bg" v-else>
      <span class="icon-book2"></span>
    </div>
  </div>
</template>

<script>
import { storeShelfMixin } from "../../utils/mixin";
import { realPx } from "../../utils/utils";
export default {
  mixins: [storeShelfMixin],
  props: { data: Object },
  computed: {
    itemHeight() {
      // if(this.innerHeight){
      //   return ((this.innerHeight - 4 * realPx(6))/3)  + "px"
      // }
    },
    showInCover() {
      return this.data.itemList.filter((item, index) => {
        return index < 9;
      });
    }
  },
  created() {
    // this.innerHeight = this.$parent.$parent.itemHeight.slice(0, -2);
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.shelft-item-caterogy {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .shelf-item-category-list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row wrap;
    padding-top: px2rem(5);
    align-content: flex-start;
    box-sizing: border-box;
    .shelf-item-category-item {
      // padding: px2rem(3) px2rem(3);
      box-sizing: border-box;
      flex: 0 0 33.33%;
      width: 33.33%;
      height: 33.33%;
      // background: #fff;
      &:nth-child(3n + 1) {
        padding: 0 px2rem(2.5) px2rem(5) px2rem(5);
      }
      &:nth-child(3n + 2) {
        padding: 0 px2rem(2.5) px2rem(5) px2rem(2.5);
      }
      &:nth-child(3n) {
        padding: 0 px2rem(5) px2rem(5) px2rem(2.5);
      }
      .shelf-item-category-item-img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .shelf-item-category-bg{
    width:100%;
    height:100%;
    background:white;
    font-size:px2rem(30);
    color:#ccc;
    @include center;
  }
}
</style>