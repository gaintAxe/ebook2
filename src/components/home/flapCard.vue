<template>
  <div class="flap-card-wrapper" v-show="flapCardVisible">
    <div
      class="flap-card-bg"
      :class="{'animation':runFlapCardAnimation}"
      v-show="FlapCardAnimationShow"
    >
      <div
        class="flag-card"
        v-for="(item,index) in flapCardList"
        :key="index"
        :style="{zIndex:item.zIndex}"
      >
        <div class="flap-card-circle">
          <div
            class="flap-card-semi-circle flap-card-semi-circle-left"
            :style="semiCircleStyle(item,'left')"
            ref="left"
          ></div>
          <div
            class="flap-card-semi-circle flap-card-semi-circle-right"
            :style="semiCircleStyle(item,'right')"
            ref="right"
          ></div>
        </div>
      </div>
      <!-- <div class="flag-card">
        <div class="flap-card-circle">
          <div
            class="flap-card-semi-circle flap-card-semi-circle-left"
            ref="Topleft"
            :style="style.styleTopLeft"
          ></div>
          <div
            class="flap-card-semi-circle flap-card-semi-circle-right"
            ref="Topright"
            style="z-index:100"
            :style="style.styleTopRight"
          ></div>
        </div>
      </div>
      <div class="flag-card">
        <div class="flap-card-circle">
          <div
            class="flap-card-semi-circle flap-card-semi-circle-left"
            :style="style.styleBottomleft"
            ref="Bottomleft"
          ></div>
          <div
            class="flap-card-semi-circle flap-card-semi-circle-right"
            :style="style.styleBottomRight"
            ref="Bottomight"
          ></div>
        </div>
      </div>-->
      <!-- 烟花dom -->
      <div class="point-wrapper">
        <div
          class="point"
          v-for="item in pointList"
          :key="item"
          :class="{'animation':runPointAnimation}"
        ></div>
      </div>
    </div>
    <div
      class="book-card"
      :class="{'animation':runBookCardAnimation}"
      v-show="runBookCardAnimation"
    >
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <img class="img" :src="data?data.cover:''" />
        </div>
        <div class="content-wrapper">
          <div class="title">{{data?data.title:''}}</div>
          <div class="author sub-title-medium">{{data?data.author:''}}</div>
          <div class="category">{{categoryText()}}</div>
        </div>
        <div class="read-btn" @click.stop="showBookDetail(data)">{{$t('home.readNow')}}</div>
      </div>
    </div>
    <div class="close-btn-wrapper" @click="close">
      <span class="icon-close"></span>
    </div>
  </div>
</template>

<script>
import { storeHomeMixin } from "../../utils/mixin";

import { flapCardList, categoryText } from "@/utils/store";
export default {
  mixins: [storeHomeMixin],
  props: {
    data: Object
  },
  data() {
    return {
      flapCardList,
      front: 0,
      back: 1,
      curdeg: 0,
      style: {
        styleTopLeft: {},
        styleTopRight: {},
        styleBottomleft: {},
        styleBottomRight: {}
      },
      curImg: 0,
      interval: 25,
      runFlapCardAnimation: false, //是否显示登场动画动画
      pointList: null, //烟花中的小球数组
      runPointAnimation: false, //是否显示烟花动画动画
      FlapCardAnimationShow: true, //图片动画显示
      runBookCardAnimation: false // book页面登场动画
    };
  },
  methods: {
    categoryText() {
      if (this.data) {
        return categoryText(this.data.category, this);
      } else {
        return "";
      }
    },

    close() {
      this.setFlapCardVisible(false);
      this.stopAnimation();
    },
    //静态设置图片和背景色
    semiCircleStyle(item, dir) {
      return {
        backgroundColor: `rgb(${item.r}, ${item.g}, ${item.b})`,
        backgroundSize: item.backgroundSize,
        backgroundImage: dir === "left" ? item.imgLeft : item.imgRight
      };
    },
    //动态设置角度和背景色
    rotate(index, type) {
      const item = this.flapCardList[index];
      let dom;
      if (type === "front") {
        dom = this.$refs.right[index];
      } else {
        dom = this.$refs.left[index];
      }
      dom.style.transform = `rotateY(${item.rotateDegree}deg)`;
      dom.style.backgroundColor = `rgb(${item.r},${item._g},${item.b})`;
    },
    //图片动画每一帧设置状态
    flapCardRotate() {
      const frontFlapCard = this.flapCardList[this.front];
      const backFlapCard = this.flapCardList[this.back];
      // 第一面从0度开始，第二面从180开始
      frontFlapCard.rotateDegree += 10;
      backFlapCard.rotateDegree -= 10;

      //第一面的颜色加深
      frontFlapCard._g -= 5;
      if (backFlapCard.rotateDegree < 90) {
        // 第二面左边边只有在左边的时候，也就是deg<90才加深颜色
        backFlapCard._g += 5;
      }
      if (
        frontFlapCard.rotateDegree === 90 &&
        backFlapCard.rotateDegree === 90
      ) {
        //如果翻到左边，则第二面在上面显示
        backFlapCard.zIndex += 2;
      }
      //渲染第一面的右，和第二面的左
      this.rotate(this.front, "front");
      this.rotate(this.back, "back");
      //当第一面的右翻到左，第二面的左翻到左时，切换下一页
      if (frontFlapCard.rotateDegree == 180 && backFlapCard.rotateDegree == 0) {
        this.next();
      }
    },
    //重置图片状态，然后使动画执行的对象为下一张图片，然后改变所有图片的z-index
    next() {
      const frontFlapCard = this.flapCardList[this.front];
      const backFlapCard = this.flapCardList[this.back];
      frontFlapCard.rotateDegree = 0;
      backFlapCard.rotateDegree = 0;
      frontFlapCard._g = frontFlapCard.g;
      backFlapCard._g = backFlapCard.g;
      //重置角度和颜色
      this.rotate(this.front, "front");
      this.rotate(this.back, "back");
      this.front++;
      this.back++;
      const len = this.flapCardList.length;
      if (this.front >= len) {
        this.front = 0;
      }
      if (this.back >= len) {
        this.back = 0;
      }
      //z-index
      //100-96
      //99-100
      //98-99
      //97-98
      //96-97
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - ((index - this.front + len) % len);
      });

      this.prepare();
    },
    //为背面的图片初始化
    prepare() {
      const backFlapCard = this.flapCardList[this.back];
      backFlapCard.rotateDegree = 180;
      backFlapCard._g = backFlapCard.g - 5 * 9;
      //第二面左边圆与右边圆重合
      this.rotate(this.back, "back");
    },
    //图片动画执行函数
    startFlapCardAnimation() {
      this.prepare();
      this.task = setInterval(() => {
        this.flapCardRotate();
      }, this.interval);
      this.$parent.getData().then(() => {
        this.timer2= setTimeout(() => {
          this.FlapCardAnimationShow = false;
          this.stopAnimation();
          this.runBookCardAnimation = true;
        }, 2000);
      });
    },
    startFlapCardAnimation2forPre() {
      let topLeftNum = 0;
      let topRightNum = 0;
      let bottomNum = 1;
      this.task = setInterval(() => {
        if (this.curdeg == 0) {
        }
        if (this.curdeg == 90) {
          topRightNum++;
          if (topRightNum > 4) {
            // topLeftNum = 0;
            // topRightNum = 0;
            topRightNum = 0;
          }
        }
        if (this.curdeg == 180) {
          this.curdeg = 0;
          topLeftNum = topRightNum;
          bottomNum++;
          if (bottomNum > 4) {
            // topLeftNum = 0;
            // topRightNum = 0;
            bottomNum = 0;
          }
        }
        this.style.styleTopLeft = this.semiCircleStyle(
          this.flapCardList[topLeftNum],
          "left"
        );
        this.style.styleTopRight = this.semiCircleStyle(
          this.flapCardList[topRightNum],
          "right"
        );
        this.style.styleBottomLeft = this.semiCircleStyle(
          this.flapCardList[bottomNum],
          "left"
        );
        this.style.styleBottomRight = this.semiCircleStyle(
          this.flapCardList[bottomNum],
          "right"
        );
        this.$refs.Topright.style.transform = `rotateY(${this.curdeg}deg)`;
        this.curdeg += 10;
      }, this.interval);
    },
    //停止图片动画
    stopAnimation() {
      if (this.task) {
        clearInterval(this.task);
        this.reset();
      }
    },
    //重置图片属性
    reset() {
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - index;
        item._g = item.g;
        item.rotateDegree = 0;
        this.rotate(index, "front");
        this.rotate(index, "left");
      });
      this.front = 0;
      this.back = 1;
    }
  },
  created() {
    this.pointList = [];
    for (let i = 0; i < 18; i++) {
      this.pointList.push(`point${i}`);
    }
  },
  watch: {
    flapCardVisible(val) {
      if (val) {
        //登场动画
        this.runFlapCardAnimation = true;
        setTimeout(() => {
          //登场动画执行完成后在执行图片动画
          this.startFlapCardAnimation();
          //执行烟花动画
          this.runPointAnimation = true;
          setTimeout(() => {
            //烟花动画执行完后，解除animation class
            this.runPointAnimation = false;
          }, 750);
        }, 300);
      } else {
        this.stopAnimation()
        //离开页面时，要将图片动画的显示置为true
        this.FlapCardAnimationShow = true;
        //离开页面时，要将book-card设置为隐藏
        this.runBookCardAnimation = false;
        if(this.timer2){
          clearTimeout(this.timer2)
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";

.flap-card-wrapper {
  @include absCenter;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  .close-btn-wrapper {
    position: absolute;
    left: 0;
    bottom: px2rem(30);
    width: 100%;
    @include center;
    .icon-close {
      width: px2rem(45);
      height: px2rem(45);
      border-radius: 50%;
      background: #333;
      color: white;
      font-size: px2rem(25);
      @include center;
    }
  }
  @include center;
  .flap-card-bg {
    position: relative;
    width: px2rem(64);
    height: px2rem(64);
    border-radius: px2rem(5);
    background: white;
    &.animation {
      //动画名 执行时间，曲线类似于linear 重复执行
      animation: flag-card-move 0.3s ease-in;
    }
    //登场动画
    @keyframes flag-card-move {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
      75% {
        transform: scale(0.9);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    .flag-card {
      width: px2rem(48);
      height: px2rem(48);
      @include absCenter;
      //   background:orange;
      .flap-card-circle {
        width: 100%;
        height: 100%;
        display: flex;
        .flap-card-semi-circle {
          flex: 0 0 50%;
          width: 50%;
          height: 100%;
          background-repeat: no-repeat;
          // 转到背面的显示状态为隐藏
          backface-visibility: hidden;
        }
        .flap-card-semi-circle-left {
          border-radius: px2rem(24) 0 0 px2rem(24);
          background-position: center right;
          transform-origin: right;
        }
        .flap-card-semi-circle-right {
          border-radius: 0 px2rem(24) px2rem(24) 0;
          background-position: center left;
          transform-origin: left;
        }
      }
    }
    .point-wrapper {
      z-index: 1500;
      @include absCenter;
      .point {
        border-radius: 50%;
        @include absCenter;
        &.animation {
          @for $i from 1 to length($moves) {
            &:nth-child(#{$i}) {
              @include move($i);
            }
          }
        }
      }
    }
  }
  .book-card {
    position: relative;
    width: 65%;
    // height: 70%;
    box-sizing: border-box;
    border-radius: px2rem(15);
    background: white;
    &.animation {
      animation: scale $bookShowTime ease-in both;
      @keyframes scale {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
    }
    .book-card-wrapper {
      width: 100%;
      height: 100%;
      margin-bottom: px2rem(30);
      @include columnTop;
      .img-wrapper {
        width: 100%;
        margin-top: px2rem(20);
        @include center;
        .img {
          width: px2rem(90);
          height: px2rem(130);
        }
      }
      .content-wrapper {
        padding: 0 px2rem(20);
        margin-top: px2rem(20);
        .title {
          color: #333;
          font-weight: bold;
          font-size: px2rem(18);
          line-height: px2rem(20);
          max-height: px2rem(40);
          text-align: center;
          @include ellipsis2(2);
        }
        .author {
          margin-top: px2rem(10);
          text-align: center;
        }
        .category {
          color: #999;
          font-size: px2rem(14);
          margin-top: px2rem(10);
          text-align: center;
        }
      }
      .read-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1100;
        width: 100%;
        border-radius: 0 0 px2rem(15) px2rem(15);
        padding: px2rem(15) 0;
        text-align: center;
        color: white;
        font-size: px2rem(14);
        background: $color-blue;
      }
    }
  }
}
</style>