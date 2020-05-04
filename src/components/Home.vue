<template>
  <div>
    <Header :title="header.title"></Header>
     <keep-alive>   
     <Loading v-if="!isLoaded"></Loading>
    <div class="home" :style="{ height: scrollHeight }" v-else>
       <cube-scroll>
         <!-- 轮播图 -->
      <div><Banner></Banner></div>
      <div>
        <div class="home-main">
          <div class="home-item-title">
            <span>主编力荐(男生)</span>
            <span @click="more(id1)">更多&gt;</span>
          </div>
          <!-- 推荐书籍 -->
          <div class="home-item" v-for="item in ManData" :key="item.id">
            <router-link
              :to="{ path: 'book', query: { id: item._id } }"
              tag="div"
              class="home-items"
            >
              <div class="home-items-img">
                <img v-lazy="$store.state.imgHeader + item.cover" :key="item.id" />
              </div>
              <div class="home-items-main">
                <p class="home-items-name">{{item.title}}</p>
                <p class="home-items-intro">{{item.shortIntro}}</p>
                <p class="home-items-category">
                  <span v-text="item.minorCate"></span>
                  <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                  <span class="red">{{item.latelyFollower | formatPeople}}</span>
                  <span>人气</span>
                  <span class="home-items-major" v-text="item.majorCate"></span>
                </p>
              </div>
            </router-link>
          </div>

          <div class="home-item-title girl">
            <span>主编力荐(女生)</span>
            <span @click="more(id2)">更多&gt;</span>
          </div>
          <!-- 推荐书籍 -->
          <div class="home-item" v-for="item in GirlData" :key="item.id">
            <router-link
              :to="{ path: '/book', query: { id: item._id } }"
              tag="div"
              class="home-items"
            >
              <div class="home-items-img">
                <img v-lazy="$store.state.imgHeader + item.cover" :key="item.id" />
              </div>
              <div class="home-items-main">
                <p class="home-items-name">{{item.title}}</p>
                <p class="home-items-intro">{{item.shortIntro}}</p>
                <p class="home-items-category">
                  <span v-text="item.minorCate"></span>
                  <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                  <span class="red">{{item.latelyFollower | formatPeople}}</span>
                  <span>人气</span>
                  <span class="home-items-major" v-text="item.majorCate"></span>
                </p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      </cube-scroll>
    </div>
     </keep-alive>
    <Footer class="footer"></Footer>
  </div>
</template>

<script>
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Loading from "@/components/common/Loading";
// import BScorll from "better-scroll";
import Banner from "@/components/common/Banner"

export default {
  components: {
    Header,
    Footer,
    Loading,
    Banner
  },
  data() {
    return {
      header: {
        title: "书生客栈"
      },
      id1: "54d42d92321052167dfb75e3",
      id2: "54d43437d47d13ff21cad58b",
      ManData: [],
      GirlData: [],
      isLoaded: false,
      recommandationsData:[]
    };
  },
  methods: {
    // 获取书籍
    getData() {
      this.$axios.get(`/api/ranking/${this.id1}`).then(res => {
        if (res.data.ok) {
          this.ManData = res.data.ranking.books.slice(0, 5);
          this.isLoaded = true;
        }
      });
      // 女生推荐
      this.$axios.get(`/api/ranking/${this.id2}`).then(res => {
        if (res.data.ok) {
          this.GirlData = res.data.ranking.books.slice(0, 7);
        }
      });
    },
    more(id) {
      this.$router.push({path:'more',query:{id:id}});
    }
  },
  filters: {
    formatPeople(nums) {
      if (nums > 9999) {
        return parseFloat((nums / 10000).toFixed(1)) + "万";
      } else {
        return nums;
      }
    }
  },
  mounted () {
    this.getData();
  },
    computed: {
    scrollHeight() {
      return (
        this.$store.state.clientHeight -
        (10.66667 * this.$store.state.clientWidth) / 100 +
        "px"
      );
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  overflow-y: scroll;
  height: 100vh;
}
.home-swiper {
  width: 100%;
}
.home-swiper-item {
  width: 100%;
  height: 120px;
  img {
    width: 100%;
    height: 100%;
  }
}
.home-item {
  background-color: #fff;
  margin-bottom: 10px;
}
.home-item-title {
  display: flex;
  padding: 15px;
   color: #f94040;
  span {
    flex: 1;
    line-height: 16px;
    
    &:first-child {
      border-left: 2px solid #26a2ff;
      padding-left: 8px;
      font-size: 14px;
      font-weight: bold;
    }
    &:last-child {
      text-align: right;
      font-size: 12px;
    }
  }
}
.home-items {
  padding: 10px 25px;
  .home-items-img {
    display: inline-block;
    vertical-align: middle;
    width: 60px;
    height: 82px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .home-items-main {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    box-sizing: border-box;
    width: calc(100vw - 150px);
    height: 82px;
    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      border-bottom: 1px solid #f0f0f0;
    }
    .home-items-name {
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 14px;
      overflow: hidden;
      color: #333;
      padding: 5px 0;
    }
    .home-items-intro {
      font-size: 12px;
      color: #999;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      word-break: break-all;
      text-overflow: ellipsis;
      overflow: hidden;
      line-height: 1.5;
      height: 34px;
    }
    .home-items-category {
      position: relative;
      font-size: 12px;
      color: #999;
      margin-top: 10px;
      .home-items-major {
        position: absolute;
        right: 0;
        bottom: 0;
        color: #ff8400;
        border: 1px solid #ff8400;
        padding: 1px 3px;
        transform: scale(0.8);
        transform-origin: bottom;
        border-radius: 2px;
        line-height: 12.8px;
      }
    }
  }
}
.footer {
  position: fixed;
  bottom: 0px;
}
</style>
