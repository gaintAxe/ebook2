<template>
  <div class="store-home">
    <home-search-bar></home-search-bar>
    <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
      <div class="banner-wrapper">
        <img :src="banner" alt class="banner-img" />
      </div>
      <guess-you-like :data="guessYouLike"></guess-you-like>

      <recommend :data="recommend" class="recommend"></recommend>
      <featured
        :data="featured"
        :btnText="$t('home.seeAll')"
        class="featured"
        :titleText="$t('home.featured')"
      ></featured>
      <div class="category-list-wrapper" v-for="(item,index) in categoryList" :key="index">
        <category-book :data="item"></category-book>
      </div>
      <category :data="categories"></category>
    </scroll>
    <flap-card :data="random"></flap-card>
  </div>
</template>

<script>
import HomeSearchBar from "../../components/home/searchBar";
import FlapCard from "@/components/home/flapCard";
import Scroll from "../../components/common/Scroll";
import { storeHomeMixin } from "../../utils/mixin";

import Category from "../../components/home/category";
import GuessYouLike from "../../components/home/guessYouLike";
import Recommend from "../../components/home/recommend";
import Featured from "../../components/home/featured";
import CategoryBook from "../../components/home/categoryBook";

import { home } from "@/api/store";
export default {
  mixins: [storeHomeMixin],
  data() {
    return {
      scrollTop: 94,
      random: null, //随机图书
      banner: null, //图片
      categories: null,
      guessYouLike: null,
      recommend: null,
      featured: null,
      categoryList: null
    };
  },
  components: {
    HomeSearchBar,
    Scroll,
    FlapCard,
    Category,
    GuessYouLike,
    Recommend,
    Featured,
    CategoryBook
  },
  methods: {
    onScroll(offsetY) {
      this.setOffsetY(offsetY);
      if (offsetY > 0) {
        this.scrollTop = 52;
        this.$refs.scroll.refresh();
      } else if (offsetY == 0) {
        this.scrollTop = 94;
        this.$refs.scroll.refresh();
      }
    },
    getData() {
      return home().then(respone => {
        if (respone && respone.status === 200) {
          const data = respone.data;
          const randomIndex = Math.floor(Math.random() * data.random.length);
          this.random = data.random[randomIndex];
          this.banner = data.banner;
          this.categories = data.categories;
          this.guessYouLike = data.guessYouLike;
          this.recommend = data.recommend;
          this.featured = data.featured;
          this.categoryList = data.categoryList;
        }
      });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global";
.store-home {
  width: 100%;
  height: 100%;
  .banner-wrapper {
    width: 100%;
    padding: px2rem(10);
    box-sizing: border-box;
    .banner-img {
      width: 100%;
      height: px2rem(150);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
  .recommend {
    margin-top: px2rem(20);
    margin-bottom: px2rem(20);
  }
  .featured {
    margin-top: px2rem(20);
    margin-bottom: px2rem(20);
  }
  .category-list-wrapper {
    margin-top: px2rem(20);
    margin-bottom: px2rem(20);
  }
}
</style>