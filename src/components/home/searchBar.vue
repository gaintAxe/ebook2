<template>
  <div>
    <div
      class="search-bar"
      ref="searchBar"
      :class="{'hide-title':!titleVisible,'hide-shadow':!shadowVisible}"
    >
      <div
        class="title-icon-back-wrapper"
        @click="hideHotSearch"
        :class="{'hide-title':!titleVisible}"
      >
        <span class="icon-back icon"></span>
      </div>
      <transition name="title-move">
        <div class="search-bar-title-wrapper" v-show="titleVisible">
          <div class="title-text-wrapper">
            <span class="title-text title">{{$t('home.title')}}</span>
          </div>
          <div class="title-icon-shake-wrapper" @click="showFlapCard">
            <span class="icon-shake icon"></span>
          </div>
        </div>
      </transition>
      <div
        class="search-bar-input-wrapper"
        ref="inputWrapper"
        :class="{'hide-title':!titleVisible}"
      >
        <div class="search-bar-blank" :class="{'hide-title':!titleVisible}"></div>
        <div class="search-bar-input">
          <span class="icon-search icon"></span>
          <input
            type="text"
            class="input"
            :placeholder="$t('home.hint')"
            v-model="searchText"
            @click="showHotSearch"
            @keyup.enter.exact="search"
          />
        </div>
      </div>
    </div>
    <transition name="hot-search-move">
      <scroll
        class="hot-search-wrapper"
        :top="52"
        @onScroll="onScroll"
        ref="scroll"
        v-show="hotSearchShow"
      >
        <hot-search
          :label="$t('home.hotSearch')"
          :btn="$t('home.change')"
          :hotSearch="searchList.hotSearch"
        ></hot-search>
        <div class="line"></div>
        <hot-search
          :label="$t('home.historySearch')"
          :btn="$t('home.clear')"
          :hotSearch="searchList.historySearch"
        ></hot-search>
      </scroll>
    </transition>
  </div>
</template>

<script>
import Scroll from "../common/Scroll";
import HotSearch from "./searchBar/hotSearch";
import { storeHomeMixin } from "../../utils/mixin";
import { px2rem } from "../../utils/utils";
export default {
  mixins: [storeHomeMixin],
  components: { Scroll, HotSearch },
  data() {
    return {
      searchText: "",
      titleVisible: true,
      shadowVisible: false,
      searchList: {
        hotSearch: [
          {
            type: 1,
            text: "Self-Reported Population Health",
            num: "1.8万"
          },
          {
            type: 1,
            text: "Library and Information Sciences",
            num: "1.1万"
          },
          {
            type: 1,
            text: "Global Business Strategy",
            num: "1.3万"
          },
          {
            type: 1,
            text: "Corporate Data Quality",
            num: "1.0万"
          },
          {
            type: 1,
            text: "Verrechnungspreise",
            num: "3.9万"
          }
        ],
        historySearch: [
          {
            type: 2,
            text: "Computer Science"
          },
          {
            type: 1,
            text: "Building the Infrastructure for Cloud Security"
          },
          {
            type: 2,
            text: "ePub"
          },
          {
            type: 2,
            text: "api"
          },
          {
            type: 2,
            text: "Vue.js"
          },
          {
            type: 2,
            text: "Nginx"
          },
          {
            type: 2,
            text: "Java"
          },
          {
            type: 2,
            text: "hdfs"
          },
          {
            type: 2,
            text: "vuejs"
          },
          {
            type: 2,
            text: "es6"
          },
          {
            type: 2,
            text: "Intel"
          },
          {
            type: 1,
            text: "Pro Git"
          },
          {
            type: 2,
            text: "imooc"
          },
          {
            type: 2,
            text: "Education"
          },
          {
            type: 2,
            text: "Springer"
          },
          {
            type: 2,
            text: "Environment"
          }
        ]
      },
      hotSearchShow: false
    };
  },
  watch: {
    offsetY(offsetY) {
      this.setTitleshowByoffsetY();
    },
    hotSearchShow(val) {
      this.setTitleshowByoffsetY();
      if (!val) {
        this.setHotSearchOffsetY(0);
        this.$refs.scroll.scrollTo(0, 0);
      }
    },
    hotSearchOffsetY(offsetY) {
      this.setTitleshowByoffsetY();
    }
  },
  methods: {
    showFlapCard() {
      this.setFlapCardVisible(true);
    },
    hideTitle() {
      this.titleVisible = false;
    },
    showTitle() {
      this.titleVisible = true;
    },
    hideShadow() {
      this.shadowVisible = false;
    },
    showShadow() {
      this.shadowVisible = true;
    },
    onScroll(offsetY) {
      this.setHotSearchOffsetY(offsetY);
    },
    hideHotSearch() {
      
      if(!this.hotSearchShow){
        this.$router.push({
          path:'/store/shelf'
        })
      }else{
        this.hotSearchShow = false;
      }
    },
    showHotSearch() {
      this.hotSearchShow = true;
    },
    //判断offsetY来设置title隐藏显示
    setTitleshowByoffsetY() {
      if (this.hotSearchShow) {
        this.hideTitle();

        if (this.hotSearchOffsetY == 0) {
          this.hideShadow();
        } else if (this.hotSearchOffsetY > 0) {
          this.showShadow();
        }
      } else {
        if (this.offsetY > 0) {
          this.hideTitle();
          this.showShadow();
        } else if (this.offsetY == 0) {
          this.showTitle();
          this.hideShadow();
        }
      }
    },
    search(){
      console.log(this.searchText)
      this.$router.push({
        path:'/store/list',
        query:{
          keyword:this.searchText
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";
.search-bar {
  transition: all $animationTime $animationTime;
  z-index: 150;
  position: relative;
  width: 100%;
  height: px2rem(94);
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.1);
  &.hide-title {
    height: px2rem(52);
    // box-shadow: 0 px2rem();
  }
  &.hide-shadow {
    box-shadow: none;
  }
  .title-icon-back-wrapper {
    &.hide-title {
      height: px2rem(52);
    }
    position: absolute;
    left: px2rem(15);
    top: 0;
    z-index: 100;
    height: px2rem(42);
    @include center;
    transition: all $animationTime $animationTime;
    .icon-back {
    }
  }
  .search-bar-title-wrapper {
    width: 100%;
    position: relative;
    top: 0;
    left: 0;
    height: px2rem(42);
    .title-text-wrapper {
      @include center;
      height: px2rem(42);
      .title-text {
      }
    }
    .title-icon-shake-wrapper {
      position: absolute;
      right: px2rem(15);
      top: 0;
      height: px2rem(42);
      @include center;
      .icon-shake {
      }
    }
  }
  .search-bar-input-wrapper {
    transition: all $animationTime $animationTime;
    position: absolute;
    right: 0;
    top: px2rem(42);
    width: 100%;
    height: px2rem(52);
    padding: px2rem(10);
    box-sizing: border-box;
    display: flex;
    &.hide-title {
      top: 0;
    }
    .search-bar-blank {
      transition: all $animationTime $animationTime;
      flex: 0;
      width: 0;
      &.hide-title {
        flex: 0 0 px2rem(31);
        width: px2rem(31);
      }
    }
    .search-bar-input {
      transition: all $animationTime $animationTime;
      flex: 1;
      width: 100%;
      background: #f4f4f4;
      padding: px2rem(5) px2rem(15);
      @include left;
      border-radius: px2rem(20);
      box-sizing: border-box;
      border: px2rem(1) solid #eee;
      .icon-search {
        color: #999;
      }
      .input {
        padding-left: px2rem(5);
        background: #f4f4f4;
        width: 100%;
        outline: none;
        border: none;
        height: px2rem(22);
        // 修改input的placeholder的样式
        &::-webkit-input-placeholder {
          color: #ccc;
        }
      }
    }
  }
}
.hot-search-wrapper {
  width: 100%;
  height: 100%;
  background: white;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  .line {
    width: 100%;
    height: 0;
    border-top: px2rem(1) solid #eee;
    margin: px2rem(10) 0;
  }
}
</style>