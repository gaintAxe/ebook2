<template>
  <div v-show="isEditMode" class="shelf-footer">
    <div
      class="shelf-footer-tab-wrapper"
      v-for="item in tabs"
      :key="item.index"
      @click="onTabClick(item.index)"
    >
      <div class="shelf-footer-tab" :class="{'is-selected':shelfSelected&&shelfSelected.length>0}">
        <div class="icon-private tab-icon" v-if="item.index===1 && !isPrivate"></div>
        <div class="icon-private-see tab-icon" v-if="item.index===1 && isPrivate"></div>
        <div class="icon-download tab-icon" v-if="item.index===2  && !isDownload"></div>
        <div class="icon-download-remove tab-icon" v-if="item.index === 2 && isDownload"></div>
        <div class="icon-move tab-icon" v-if="item.index===3"></div>
        <div class="icon-shelf tab-icon" v-if="item.index===4"></div>
        <div class="tab-text" :class="{'remove-text': item.index === 4}">{{content(item)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { storeShelfMixin } from "../../utils/mixin";
import { saveBookShelf, removeLocalStorage } from "../../utils/localStorage";
import { download } from "../../api/store";
import { removeLocalForage } from "../../utils/localForage";

const NGINX_SERVER = process.env.VUE_APP_RES_URL;
export default {
  mixins: [storeShelfMixin],
  computed: {
    tabs() {
      return [
        {
          label: this.$t("shelf.private"),
          label2: this.$t("shelf.noPrivate"),
          index: 1
        },
        {
          label: this.$t("shelf.download"),
          label2: this.$t("shelf.delete"),
          index: 2
        },
        {
          label: this.$t("shelf.move"),
          index: 3
        },
        {
          label: this.$t("shelf.remove"),
          index: 4
        }
      ];
    },
    //判断是否是私密阅读状态 private
    isPrivate() {
      // console.log(this.shelfSelected);
      if (!this.shelfSelected) {
        return false;
      } else if (this.shelfSelected.length == 0) {
        return false;
      } else {
        let isPrivate = true;
        this.shelfSelected.forEach(item => {
          if (!item.private) {
            isPrivate = false;
          }
        });
        return isPrivate;
      }
    },
    isDownload() {
      // console.log(this.shelfSelected);
      if (!this.shelfSelected) {
        return false;
      } else if (this.shelfSelected.length == 0) {
        return false;
      } else {
        let isDownload = true;
        this.shelfSelected.forEach(item => {
          if (!item.cache) {
            isDownload = false;
          }
        });
        return isDownload;
      }
    }
  },
  data() {
    return {
      titleList: [
        {
          set: this.$t("shelf.setPrivateTitle"),
          remove: this.$t("shelf.closePrivateTitle")
        },
        {
          set: this.$t("shelf.setDownloadTitle"),
          remove: this.$t("shelf.removeDownloadTitle")
        },
        { set: this.$t("shelf.removeBookTitle"), remove: "" },
        {
          one: this.$t("shelf.removeBookTitle"),
          selected: this.$t("shelf.selectedBooks")
        }
      ],
      popupMenu: null
    };
  },
  methods: {
    //图标下文本
    content(item) {
      if (item.index === 1) {
        if (this.isPrivate) {
          return item.label2;
        }
      } else if (item.index === 2) {
        if (this.isDownload) {
          return item.label2;
        }
      }
      return item.label;
    },
    //开启私密模式
    setPrivate() {
      let privateFlag = !this.isPrivate;

      // let shelfSelected = this.shelfSelected;
      //将shelfList item的private更改
      this.shelfSelected.forEach(item => {
        item.private = privateFlag;
      });

      //显示消息提示
      if (privateFlag) {
        this.simpleToast(this.$t("shelf.setPrivateSuccess"));
      } else {
        this.simpleToast(this.$t("shelf.closePrivateSuccess"));
      }

      //操作成功推出编辑状态
      this.setIsEditMode(false);
    },
    //设置离线模式
    async setDownload() {
      let downloadFlag = !this.isDownload;

      if (downloadFlag) {
        //下载

        await this.downloadSelectedBook();
        this.simpleToast(this.$t("shelf.setDownloadSuccess"));
      } else {
        //删除
        this.shelfSelected.forEach(item => {
          item.cache = false;
        });
        await this.removeDownloadBook();
        this.simpleToast(this.$t("shelf.removeDownloadSuccess"));
        //操作成功推出编辑状态
        this.setIsEditMode(false);
      }
    },
    async downloadSelectedBook(cb) {
      for (let i = 0; i < this.shelfSelected.length; i++) {
        let len = this.shelfSelected.length;
        await this.downloadBook(this.shelfSelected[i]).then(book => {
          book.cache = true;
          if (i == len - 1) {
            //操作成功推出编辑状态
            this.setIsEditMode(false);
          }
        });
      }
    },
    downloadBook(book) {
      return new Promise((resolve, reject) => {
        download(
          book,
          res => {
            this.simpleToast("下载完成");
            resolve(book);
          },
          reject,
          progressEvent => {
            const progress =
              Math.floor((progressEvent.loaded / progressEvent.total) * 100) +
              "%";
            const text = this.$t("shelf.progressDownload").replace(
              "$1",
              `${book.fileName}.epub(${progress})`
            );
            this.simpleToast(text);
          }
        );
      });
    },
    //删除书籍缓存
    async removeDownloadBook() {
      for (let i = 0; i < this.shelfSelected.length; i++) {
        let len = this.shelfSelected.length;
        await this.removeBook(this.shelfSelected[i]).then(book => {
          book.cache = false;
        });
        if (i == len - 1) {
          //操作成功推出编辑状态
          this.setIsEditMode(false);
        }
      }
    },
    //
    removeBook(book) {
      return new Promise((resolve, reject) => {
        try {
          removeLocalStorage(
            `${NGINX_SERVER}/${book.categoryText}/${book.fileName}.epub-info`
          );
          console.log(
            `${NGINX_SERVER}/${book.categoryText}/${book.fileName}-info`
          );
          removeLocalForage(`${book.fileName}`);
        } catch (e) {
          console.log(e);
          reject(e);
        }
        resolve(book);
      });
    },
    //删除书架的书籍
    removeBookSelected() {
      let deleteKeysArr = [];
      this.shelfSelected.forEach(item => {
        deleteKeysArr.push(item.bookId);
      });
      let shelfList = this.shelfList.filter(item => {
        return deleteKeysArr.indexOf(item.bookId) === -1;
      });
      this.setShelfList(shelfList);
      //操作成功推出编辑状态
      this.setIsEditMode(false);
    },
    onTabClick(index) {
      if (
        !this.shelfSelected ||
        (this.shelfSelected && this.shelfSelected.length == 0)
      ) {
        return;
      }
      let btn = null,
        title;
      if (index == 1) {
        title = this.isPrivate
          ? this.titleList[index - 1]["remove"]
          : this.titleList[index - 1]["set"];
        btn = [
          {
            text: this.isPrivate
              ? this.$t("shelf.close")
              : this.$t("shelf.open"),
            click: () => {
              this.setPrivate();
              this.popupMenu.hide();
            }
          },
          {
            text: this.$t("shelf.cancel"),
            click: "hide",
            click: () => {
              this.popupMenu.hide();
            }
          }
        ];
      } else if (index == 2) {
        title = this.isDownload
          ? this.titleList[index - 1]["remove"]
          : this.titleList[index - 1]["set"];
        btn = [
          {
            text: this.isDownload
              ? this.$t("shelf.delete")
              : this.$t("shelf.open"),
            click: () => {
              this.setDownload();
              this.popupMenu.hide();
            }
          },
          {
            text: this.$t("shelf.cancel"),
            click: "hide",
            click: () => {
              this.popupMenu.hide();
            }
          }
        ];
      } else if (index == 4) {
        title =
          this.shelfSelected.length === 1
            ? this.titleList[index - 1]["one"].replace(
                "$1",
                `《${this.shelfSelected[0].title}》`
              )
            : this.titleList[index - 1]["one"].replace(
                "$1",
                this.titleList[index - 1]["selected"]
              );
        btn = [
          {
            text: this.$t("shelf.removeBook"),
            type: "danger",
            click: () => {
              this.removeBookSelected();
              this.popupMenu.hide();
            }
          },
          {
            text: this.$t("shelf.cancel"),
            click: "hide",
            click: () => {
              this.popupMenu.hide();
            }
          }
        ];
      }

      if (index !== 3) {
        this.popupMenu = this.popup({
          title: title,
          btn: btn
        });
        this.popupMenu.show();
      } else {
        this.dialog().show();
      }
    }
  },
  watch: {
    isEditMode(val) {
      if (!val) {
        //推出编辑时，清空selected
        this.clearAfterNoEdit();
        //并保存shelfList
        saveBookShelf(this.shelfList);
      }
    },
    shelfSelected(val) {
      val.forEach(item => {
        console.log("cache", item.cache);
      });
      console.log("-----------");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";
.shelf-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 120;
  display: flex;
  width: 100%;
  height: px2rem(48);
  background: white;
  box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, 0.1);
  .shelf-footer-tab-wrapper {
    flex: 1;
    width: 25%;
    height: 100%;
    .shelf-footer-tab {
      width: 100%;
      height: 100%;
      opacity: 0.5;
      @include columnCenter;
      .tab-icon {
        font-size: px2rem(20);
        color: #666;
      }
      .tab-text {
        margin-top: px2rem(5);
        font-size: px2rem(12);
        color: #666;
        &.remove-text {
          color: $color-pink;
        }
      }
      &.is-selected {
        opacity: 1;
      }
      .icon-shelf {
        color: $color-pink;
      }
    }
  }
}
</style>