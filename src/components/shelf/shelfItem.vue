<template>
  <div
    class="shelf-item shelf-item-shadow"
    :class="{'no-box-shadow':data.type==3}"
    @click="onItemClick"
  >
    <component
      :is="switchComponentByType"
      :data="data"
      class="shelf-item-comp"
      :class="{'is-edit':isEditMode&&data.type==2}"
    ></component>
    <span
      class="icon-selected"
      v-show="isEditMode && data.type==1"
      :class="{'is-selected':data.selected}"
    ></span>
  </div>
</template>

<script>
import { storeShelfMixin } from "../../utils/mixin";
import { gotoStoreHome, gotoBookDetail } from "../../utils/store";
import ShelfItemAdd from "./shelfItemAdd";
import ShelfItemBook from "./shelfItemBook";
import ShelfItemCategory from "./shelfItemCategory";
export default {
  mixins: [storeShelfMixin],
  computed: {
    switchComponentByType() {
      let typeList = [
        this.ShelfItemBook,
        this.ShelfItemCategory,
        this.ShelfItemAdd
      ];
      return typeList[this.data.type - 1];
    }
  },
  data() {
    return {
      ShelfItemAdd,
      ShelfItemBook,
      ShelfItemCategory
    };
  },
  props: {
    data: Object
  },
  methods: {
    onItemClick() {
      if (this.isEditMode) {
        //是编辑模式
        if (this.data.type !== 1) {
          return;
        }
        this.data.selected = !this.data.selected;
        let selectedList = this.shelfSelected;
        if (!selectedList) {
          selectedList = [];
        }
        //如果是加入selectedList
        if (this.data.selected) {
          selectedList.pushWithoutDuplicate(this.data);
          this.setShelfSelected(selectedList);
        } else {
          //移除
          this.setShelfSelected(
            selectedList.filter(item => {
              return item.bookId != this.data.bookId;
            })
          );
        }
      } else {
        if (this.data && this.data.type == 1) {
          gotoBookDetail(this, this.data);
        } else if (this.data && this.data.type == 3) {
          gotoStoreHome(this);
        } else if (this.data && this.data.type == 2) {
          this.$router.push({
            path: "/store/category",
            query: {
              title: this.data.title
            }
          });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";
.shelf-item {
  position: relative;
  width: 100%;
  height: 100%;
  // background: orangered;
  &.shelf-item-shadow {
    box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(0, 0, 0, 0.3);
  }
  &.no-box-shadow {
    box-shadow: none;
  }
  .icon-selected {
    position: absolute;
    bottom: px2rem(2);
    right: px2rem(2);
    font-size: px2rem(18);
    color: rgba(0, 0, 0, 0.4);
    &.is-selected {
      color: $color-blue;
    }
  }
  .shelf-item-comp {
    opacity: 1;
    &.is-edit {
      opacity: 0.5;
    }
  }
}
</style>