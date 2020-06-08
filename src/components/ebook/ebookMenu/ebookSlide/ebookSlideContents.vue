<template>
  <div class="ebook-slide-contents">
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <input
          type="text"
          class="slide-contents-search-input"
          :placeholder="$t('book.searchHint')"
          @click="showSearchPage"
          v-model="searchText"
          @keyup.enter.exact="getSearchList"
        />
      </div>
      <div
        class="slide-contents-search-cancel"
        v-if="searchVisible"
        @click="hideSearchPage()"
      >{{$t('book.cancel')}}</div>
    </div>
    <div class="slide-contents-book-wrapper" v-if="!searchVisible">
      <div class="slide-contents-book-img-wrapper">
        <img :src="cover" alt class="slide-contents-book-img" />
      </div>
      <div class="slide-contents-book-info-wrapper">
        <div class="slide-contents-book-title">
          <span class="slide-contents-book-title-text">{{metadata.title}}</span>
        </div>
        <div class="slide-contents-book-author"><span class="slide-contents-book-author-text">{{metadata.creator}}</span></div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-content-book-progress">
          <span class="progress">{{progress+'%'}}</span>
          <span class="progress-text">{{$t('book.haveRead2')}}</span>
        </div>
        <div class="slide-conents-book-time">{{getReadTimeText()}}</div>
      </div>
    </div>
    <scroll class="slide-contents-list" :top="156" :bottom="48" v-if="!searchVisible">
      <template v-if="bookAvailable ">
        <div class="slide-contents-item" v-for="(item,index) in navigation" :key="index">
          <span
            class="slide-contents-item-label"
            :style="contentItemStyle(item)"
            :class="{'selected':section === index}"
            @click="display(item.href)"
          >{{item.label}}</span>
          <span class="slide-contents-item-page">{{getSectionPageNum(index)}}</span>
        </div>
      </template>
      <!-- <div class="slide-contents-item" v-if="!bookAvailable">loadings</div> -->
    </scroll>
    <scroll
      class="slide-search-list"
      :top="66"
      :bottom="48"
      v-if="searchVisible"
      ref="slideSearchList"
    >
      <template v-if="bookAvailable ">
        <div class="slide-search-item" v-for="(item,index) in searchList" :key="index">
          <span
            class="slide-search-item-label"
            @click="display(item.cfi,true)"
            v-html="item.excerpt"
          ></span>
          <span class="slide-search-item-page"></span>
        </div>
      </template>
      <div class="slide-search-item" v-if="!bookAvailable">loadings</div>
    </scroll>
  </div>
</template>

<script>
import { ebookMixin } from "../../../../utils/mixin";
import Scroll from "../../../common/Scroll";
import { px2rem } from "../../../../utils/utils";
export default {
  mixins: [ebookMixin],
  components: { Scroll },
  data() {
    return {
      searchVisible: false, // 控制取消按钮是否显示
      searchText: "",
      searchList: []
    };
  },
  computed: {
   
  },
  methods: {
    getSectionPageNum(index) {
      // return this.navigation[this.section].page+
      if(this.bookAvailable){
         return this.navigation[index].page;
      }
     
    },
    showSearchPage() {
      this.searchVisible = true;
    },
    hideSearchPage() {
      this.searchVisible = false;
      this.searchText = "";
      this.searchList = null;
    },
    contentItemStyle(item) {
      return {
        marginLeft: `${px2rem(item.level * 15)}rem`
      };
    },
    //根据地址渲染书页并判断是否高亮显示
    display(href, highlight) {
      this.dispalyForLocation(this.currentBook.rendition, href).then(() => {
        if (highlight && this.bookAvailable) {
          this.currentBook.rendition.annotations.highlight(href);
        }
        this.setSettingVisible(-1);
      });
    },
    doSearch(q) {
      return Promise.all(
        this.currentBook.spine.spineItems.map(section =>
          section
            .load(this.currentBook.load.bind(this.currentBook))
            .then(section.find.bind(section, q))
            .finally(section.unload.bind(section))
        )
      ).then(results => Promise.resolve([].concat.apply([], results)));
    },
    getSearchList() {
      if (this.searchText && this.searchText.length > 0) {
        this.doSearch(this.searchText).then(res => {
          this.searchList = res;
          //将关键词替换为高亮标签
          this.searchList.map(item => {
            item.excerpt = item.excerpt.replace(
              this.searchText,
              `<span class="content-search-text">${this.searchText}</span>`
            );
          });
          this.$refs.slideSearchList.refresh();
        });
      }
    }
  },
  mounted() {}
};
</script>

<style lang='scss' scoped>
@import "../../../../assets/styles/global";
.ebook-slide-contents {
  width: 100%;
  .slide-contents-search-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(36);
    margin: px2rem(20) 0 px2rem(10) 0;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-search-input-wrapper {
      flex: 1;
      @include center;
      .slide-contents-search-icon {
        flex: 0 0 px2rem(28);
        font-size: px2rem(12);
        @include center;
        .icon-search {
        }
      }
      .slide-contents-search-input {
        flex: 1;
        width: 100%;
        height: px2rem(32);
        font-size: px2rem(14);
        background: transparent;
        border: none;
        &:focus {
          outline: none;
        }
      }
    }
    .slide-contents-search-cancel {
      flex: 0 0 px2rem(50);
      font-size: px2rem(14);
      @include right;
    }
  }
  .slide-contents-book-wrapper {
    display: flex;
    width: 100%;
    font-size: 0;
    height: px2rem(90);
    padding: px2rem(10) px2rem(1) px2rem(20) px2rem(15);
    box-sizing: border-box;
    .slide-contents-book-img-wrapper {
      flex: 0 0 px2rem(45);
      .slide-contents-book-img {
        width: px2rem(45);
        height: px2rem(60);
      }
    }
    .slide-contents-book-info-wrapper {
      flex: 1;
      padding: 0 px2rem(10);
      box-sizing: border-box;
      width: px2rem(153.75);
      display: flex;
      flex-direction: column;
      justify-content: center;
      .slide-contents-book-title {
        font-size: px2rem(14);
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        white-space: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: keep-all;
        line-height: px2rem(16);
        @include left;
        .slide-contents-book-title-text{
          @include ellipsis2(3);
        }
      }
      .slide-contents-book-author {
        font-size: px2rem(12);
        margin-top: px2rem(5);
        // @include ellipsis;
        @include left;
        .slide-contents-book-author-text{
          @include ellipsis2(1);
        }
      }
    }
    .slide-contents-book-progress-wrapper {
      flex: 0 0 px2rem(70);
      display: flex;
      flex-direction: column;
      justify-content: center;
      .slide-content-book-progress {
        .progress {
          font-size: px2rem(14);
        }
        .progress-text {
          font-size: px2rem(12);
        }
      }
      .slide-conents-book-time {
        font-size: px2rem(12);
        margin-top: px2rem(5);
      }
    }
  }
  .slide-contents-list {
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-item {
      padding: px2rem(20) 0;
      box-sizing: border-box;
      display: flex;
      .slide-contents-item-label {
        flex: 1;
        @include ellipsis;
        font-size: px2rem(14);
        line-height: px2rem(16);
      }
      .slide-contents-item-page {
        flex:0 0 px2rem(30);
        font-size:px2rem(10);
        @include right;
      }
    }
  }
  .slide-search-list {
    padding: 0 px2rem(15);
    box-sizing: border-box;
    width: 100%;
    .slide-search-item {
      padding: px2rem(20) 0;
      box-sizing: border-box;
      display: flex;
      .slide-search-item-label {
        flex: 1;
        // @include ellipsis;
        font-size: px2rem(14);
        line-height: px2rem(16);
      }
      .slide-search-item-page {
      }
    }
  }
}
</style>