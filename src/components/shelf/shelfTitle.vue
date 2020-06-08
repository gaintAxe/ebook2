<template>
  <transition name="fade">
    <div class="shelf-title" v-show="shelfTitleVisible" :class="{'hide-shadow':ifHideShadow}">
      <div class="shelf-title-text-wrapper">
        <span class="shelf-title-text">{{title}}</span>
        <span class="shelf-title-sub-text">{{selectedText}}</span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-left" @click="clearCache" v-if="!isShowBack">
        <span class="shelf-title-btn-text">{{$t('shelf.clearCache')}}</span>
      </div>
      <div
        class="shelf-title-btn-wrapper shelf-title-left"
        @click="back"
        v-if="isShowBack &&!isEditMode"
      >
        <span class="icon-back"></span>
      </div>
      <div
        class="shelf-title-btn-wrapper"
        @click="changeGroup"
        v-if="(isEditMode||(!isEditMode&&shelfCategory.itemList&&shelfCategory.itemList.length==0)) && currentType==2"
        :class="{'shelf-title-right':!(currentType==1||(currentType==2&&shelfCategory.itemList&&shelfCategory.itemList.length>0)),'shelf-title-left':isEditMode&& currentType==2}"
      >
        <span class="shelf-title-btn-text">{{$t('shelf.editGroup')}}</span>
      </div>
      <div
        class="shelf-title-btn-wrapper shelf-title-right"
        v-if="currentType==1||(currentType==2&&shelfCategory.itemList.length>0)"
      >
        <span
          class="shelf-title-btn-text"
          @click="changeEditMode()"
        >{{this.isEditMode?$t('shelf.cancel'):$t('shelf.edit')}}</span>
      </div>
    </div>
  </transition>
</template>

<script>
import { storeShelfMixin } from "../../utils/mixin";
import { clearLocalForage } from "../../utils/localForage";
import { clearLocalStorage, saveBookShelf } from "../../utils/localStorage";
export default {
  mixins: [storeShelfMixin],
  data() {
    return {
      selectedList: null,
      ifHideShadow: true
    };
  },
  props: {
    isShowBack: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    }
  },
  computed: {
    //书架下方显示信息，选择书籍 已选择1本
    selectedText() {
      if (!this.isEditMode) {
        return "";
      } else {
        let len;
        if (!this.shelfSelected) {
          len = 0;
        } else {
          len = this.shelfSelected.length;
        }
        if (!len) {
          return this.$t("shelf.selectBook");
        } else {
          return this.$t("shelf.haveSelectedBook").replace("$1", len);
        }
      }
    },
    //取消按钮及其点击事件
    cancleBtn() {
      return this.createPopupBtn(this.$t("shelf.cancel"), () => {
        this.popupMenu.hide();
      });
    }
  },
  methods: {
    //编辑状态的切换，可以传入一个Boolean强制切换
    changeEditMode(val) {
      if (val === true || val === false) {
        this.setIsEditMode(val);
      } else {
        this.setIsEditMode(!this.isEditMode);
        if (!this.isEditMode) {
          this.clearAfterNoEdit(); //退出编辑
        } else if (this.isEditMode) {
          this.setShelfSelected(
            this.shelfList.filter(item => {
              return item.selected == true;
            })
          );
        }
      }
    },
    //清除缓存
    clearCache() {
      // console.log("清除缓存");
      clearLocalStorage();
      clearLocalForage();
      this.setShelfList([]);
      this.setShelfSelected([]);
      this.getShelfList();
      // this.shelfList.forEach((item)=>{
      //   item.cache = false
      // })
      this.setIsEditMode(false);
      this.simpleToast(this.$t("shelf.clearCacheSuccess"));
    }, //返回
    back() {
      this.$router.go(-1);
      this.setIsEditMode(false);
    },
    //创建按钮组
    createPopupBtn(text, onClick, type = "normal") {
      return {
        text,
        type,
        click: onClick
      };
    },
    //修改分组名
    changeGroupName() {
      this.popupMenu.hide();
      this.dialog({
        showNewGroup: true,
        groupName: this.shelfCategory.title
      }).show();
    },
    //弹出删除提示框
    showDeleteGroup() {
      this.popupMenu.hide();
      setTimeout(() => {
        this.popupMenu = this.popup({
          title: this.$t("shelf.deleteGroupTitle"),
          btn: [
            this.createPopupBtn(
              this.$t("shelf.confirm"),
              () => {
                this.deleteGroup();
              },
              "danger"
            ),
            this.cancleBtn
          ]
        });
        this.popupMenu.show();
      }, 250);
    },
    //删除分组
    deleteGroup() {
      if (this.shelfCategory.itemList.length > 0) {
        this.setShelfSelected(this.shelfCategory.itemList);
        this.moveOutOfGroup(this.onComplete,this.shelfCategory.id);
        
      }
    },
    onComplete() {
      saveBookShelf(this.shelfList);
      this.popupMenu.hide();
      this.setIsEditMode(false);
      console.log('sss')
      this.$router.go(-1)
    },
    //修改分组
    changeGroup() {
      let btn = [
        this.createPopupBtn(this.$t("shelf.editGroupName"), () => {
          this.changeGroupName();
          this.popupMenu.hide();
        }),
        this.createPopupBtn(
          this.$t("shelf.deleteGroup"),
          () => {
            this.showDeleteGroup();
            this.popupMenu.hide();
          },
          "danger"
        ),
        this.cancleBtn
      ];
      this.popupMenu = this.popup({
        title: "",
        btn: btn
      });
      this.popupMenu.show();
    }
  },
  watch: {
    offsetY(offsetY) {
      if (offsetY > 0) {
        this.ifHideShadow = false;
      } else {
        this.ifHideShadow = true;
      }
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.shelf-title {
  position: relative;
  z-index: 130;
  width: 100%;
  height: px2rem(42);
  background: white;
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.1);
  &.hide-shadow {
    box-shadow: none;
  }
  .shelf-title-text-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: px2rem(42);
    @include columnCenter;
    .shelf-title-text {
      font-size: px2rem(16);
      line-height: px2rem(20);
      font-weight: bold;
      color: #333;
    }
    .shelf-title-sub-text {
      font-size: px2rem(10);
      color: #333;
    }
  }
  .shelf-title-btn-wrapper {
    position: absolute;
    top: 0;
    box-sizing: border-box;
    height: 100%;
    @include center;
    .shelf-title-btn-text {
      font-size: px2rem(14);
      color: #666;
    }
    .icon-back {
      font-size: px2rem(20);
      color: #666;
    }
    &.shelf-title-left {
      left: 0;
      padding-left: px2rem(15);
    }
    &.shelf-title-right {
      right: 0;
      padding-right: px2rem(15);
    }
  }
}
</style>