<template>
  <div>
    <Header :title="header.title" :showBack="header.showBack"></Header>
    <loading v-if="!isLoaded" />
    <!-- 书籍详情 -->
    <div class="book" v-else :style="{ height: scrollHeight }" ref="book">
      <cube-scroll>
        <div class="book-header">
          <div class="book-header-img">
            <img v-lazy="bookInfo.img" :key="bookInfo.img" />
          </div>
          <div class="book-header-main">
            <p class="book-header-main-name" v-text="bookInfo.name"></p>
            <p class="book-header-main-info">
              <span v-text="bookInfo.author"></span>
              <span
                v-html="
                  '&nbsp;&nbsp;|&nbsp;&nbsp;' +
                    bookInfo.minorCate +
                    '&nbsp;&nbsp;|&nbsp;&nbsp;' +
                    formatWord(bookInfo.wordCount) +
                    '字'
                "
              ></span>
            </p>
            <p class="book-header-main-time" v-text="bookInfo.updatedTime"></p>
          </div>
        </div>
        <!-- 操作面板 -->
        <div class="book-button">
          <a
            @click="toOperateShelf"
            :class="{ 'book-button-disabled': isAddShelf }"
            v-text="isAddShelf ? '撤出书架' : '加入书架'"
          ></a>
          <router-link
            :to="{
              path: 'read',
              query: { bookId:bookId,chapter:1 }
            }"
            tag="a"
          >开始阅读</router-link>
        </div>
        <div class="book-data">
          <div class="book-data-item">
            <p>追人气</p>
            <span v-text="bookInfo.latelyFollower"></span>
          </div>
          <div class="book-data-item">
            <p>读者留存率</p>
            <span v-text="bookInfo.retentionRatio + '%'"></span>
          </div>
          <div class="book-data-item">
            <p>日更字数/天</p>
            <span v-text="bookInfo.serializeWordCount"></span>
          </div>
        </div>
        <div
          class="book-intro"
          :class="{ 'book-intro-show': showAllLongIntro }"
          @click="showAllLongIntro = !showAllLongIntro"
        >
          <p v-text="bookInfo.longIntro"></p>
          <p class="arrow" :class="{ up: showAllLongIntro }"></p>
        </div>
        <div class="book-menu-cell">
          <!-- <router-link :to="{name: 'mulu',query: { id:bookId}}" tag="div"> -->
          <p class="book-menu-cell-title" @click="golist">目录</p>
          <p
            class="book-menu-cell-text"
            v-text="'[' + bookInfo.updatedTime + '] ' + bookInfo.lastChapter"
            @click="golist"
          ></p>
          <i class="cubeic-arrow" @click="golist"></i>
          <!-- </router-link> -->
        </div>
        <!-- 评论 -->
        <div class="book-review">
          <div class="book-review-title">
            <p>热门书评</p>
            <p @click="moreview">更多评论</p>
          </div>
          <div class="book-review-main">
            <div class="book-review-item" v-for="(item, index) in bookReviewData" :key="index">
              <div class="book-review-item-left">
                <img v-lazy="item.avater" :key="item.avater" />
              </div>
              <div class="book-review-item-right">
                <p class="book-review-item-name" v-text="item.name"></p>
                <p class="book-review-item-title" v-text="item.title"></p>
                <p class="book-review-item-content" v-text="item.content"></p>
                <p class="book-review-item-love">
                  <span v-text="item.time"></span>
                  <span v-text="item.likeCount + '人觉得有用'"></span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- 推荐书籍 -->
         <div class="book-moreLove">
          <div class="book-moreLove-title">
            <span>你可能感兴趣</span>
          </div>
          <ul>
            <li  v-for="(item, index) in moreLoveData"
              :key="index" @click="gobook(item.title)">
             <img v-lazy="$store.state.imgHeader + item.cover" :key="item.id" />
              <p v-text="item.title"></p>
            </li>
          </ul>
        </div>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
import Header from "@/components/common/Header";
import Loading from "@/components/common/Loading";
export default {
  components: {
    Header,
    Loading
  },
  data() {
    return {
      header: {
        title: "书籍详情",
        showBack: true
      },
      isLoaded: false,
      bookId: this.$route.query.id,
      isAddShelf: false,
      bookInfo: {
        img: "",
        name: "",
        author: "",
        minorCate: "",
        wordCount: "",
        updatedTime: "",
        latelyFollower: "",
        retentionRatio: "",
        serializeWordCount: "",
        longIntro: "",
        lastChapter: ""
      },
      showAllLongIntro: false,
      bookReviewData: [],
      moreLoveData: []
    };
  },
  created() {
    this.getAll();
  },
  methods: {
    getAll() {
      if (window.localStorage.getItem("xiaoshuo_shelf")) {
        let _arr = JSON.parse(window.localStorage.getItem("xiaoshuo_shelf"));
        for (let i = 0; i < _arr.length; i++) {
          if (_arr[i].id === this.bookId) {
            this.isAddShelf = true;
            break;
          }
        }
      }
      this.getBookInfo();
      this.getBookReview();
      this.morebook();
    },
    gobook(name){
      this.$router.push({ path: 'Searthresult', query: { name:name }})
    },
    moreview(){
       this.$router.push({ path: 'moreview', query: { id:this.$route.query.id }})
    },
    getBookInfo() {
      this.$axios.get(`/api/book/${this.bookId}`).then(res => {
        this.bookInfo.img = this.$store.state.imgHeader + res.data.cover;
        this.bookInfo.name = res.data.title;
        this.bookInfo.author = res.data.author;
        this.bookInfo.minorCate = res.data.minorCate;
        this.bookInfo.wordCount = res.data.wordCount;
        this.bookInfo.updatedTime = this.formatUpdatedTime(
          res.data.updated,
          "前更新"
        );
        this.bookInfo.latelyFollower = this.formatPeople(
          res.data.latelyFollower
        );
        this.bookInfo.retentionRatio = res.data.retentionRatio || 0;
        // console.log( res.data.retentionRatio)
        this.bookInfo.serializeWordCount =
          res.data.serializeWordCount > 0 ? res.data.serializeWordCount : 0;
        this.bookInfo.longIntro = res.data.longIntro;
        this.bookInfo.lastChapter = res.data.lastChapter;
        this.isLoaded = true;
      });
    },
    // 书籍热评
    getBookReview() {
      this.$axios
        .get(`/api/post/review/best-by-book?book=${this.bookId}&limit=5`)
        .then(res => {
          let _bookReviewData = [];
          for (let i = 0; i < res.data.reviews.length; i++) {
            _bookReviewData.push({
              id: res.data.reviews[i].author._id,
              name: res.data.reviews[i].author.nickname,
              avater:
                this.$store.state.imgHeader + res.data.reviews[i].author.avatar,
              title: res.data.reviews[i].title,
              content: res.data.reviews[i].content,
              time: this.formatUpdatedTime(res.data.reviews[i].updated, "前"),
              likeCount: res.data.reviews[i].likeCount
            });
          }
          this.bookReviewData = _bookReviewData;
        });
    },
    // 目录
    golist() {
      this.$router.push({ name: "mulu", query: { id: this.bookId } });
    },
    // 书架操作
    toOperateShelf() {
      if (this.isAddShelf) {
        //remove
        let _arr = JSON.parse(window.localStorage.getItem("xiaoshuo_shelf"));
        for (let i = 0; i < _arr.length; i++) {
          if (_arr[i].id === this.bookId) {
            this.$createDialog({
              type: "confirm",
              title: "温馨提示",
              content: "确定要从书架中删除？",
              onConfirm: () => {
                _arr.splice(i, 1);
                if (_arr.length > 0) {
                  window.localStorage.setItem(
                    "xiaoshuo_shelf",
                    JSON.stringify(_arr)
                  );
                } else {
                  window.localStorage.removeItem("xiaoshuo_shelf");
                }
                this.isAddShelf = false;
                this.$createToast({
                  txt: "删除成功",
                  type: "txt",
                  time: 1000
                }).show();
              }
            }).show();
          }
        }
      } else {
        //add
        if (window.localStorage.getItem("xiaoshuo_shelf")) {
          let _arr = JSON.parse(window.localStorage.getItem("xiaoshuo_shelf"));
          _arr.push({
            id: this.bookId,
            name: this.bookInfo.name,
            img: this.bookInfo.img,
            cpIndex:1
          });
          window.localStorage.setItem("xiaoshuo_shelf", JSON.stringify(_arr));
        } else {
          window.localStorage.setItem(
            "xiaoshuo_shelf",
            JSON.stringify([
              {
                id: this.bookId,
                name: this.bookInfo.name,
                img: this.bookInfo.img,
                cpIndex:1
              }
            ])
          );
        }
        this.isAddShelf = true;
        this.$createToast({
          txt: "添加成功",
          type: "txt",
          time: 1000
        }).show();
      }
    },
    formatWord(nums) {
      if (nums > 9999) {
        return parseFloat((nums / 10000).toFixed(0)) + "万";
      } else {
        return nums;
      }
    },
    formatUpdatedTime(time, otherText) {
      let _timestamp = new Date() - new Date(time);
      if (_timestamp / 1000 < 60) {
        return (_timestamp / 1000).toFixed(0) + "秒" + otherText;
      }
      if (_timestamp / 1000 / 60 < 60) {
        return (_timestamp / 1000 / 60).toFixed(0) + "分钟" + otherText;
      }
      if (_timestamp / 1000 / 60 / 60 < 24) {
        return (_timestamp / 1000 / 60 / 60).toFixed(0) + "小时" + otherText;
      }
      return (_timestamp / 1000 / 60 / 60 / 24).toFixed(0) + "天" + otherText;
    },
    formatPeople(nums) {
      if (nums > 9999) {
        return parseFloat((nums / 10000).toFixed(1)) + "万";
      } else {
        return nums;
      }
    },
    morebook(){
      this.$axios.get(`api/book/${this.bookId}/recommend`).then(res=>{
        this.moreLoveData=res.data.books.splice(0,4)
      })
    }
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
.book {
  overflow-y: scroll;
}
.book-header {
  padding: 20px;
}
.book-header::before{  
    content: "";
    position: absolute;
    filter:blur(2px);
    z-index: -1;
     background-size: 100%;
    background:url('../assets/bb.jpg') no-repeat;
    width: 100%;
    height: 120px;
    top: 0px;
    left: 0px;
    background-size: cover;
    overflow:hidden;
}
.book-header-img {
  display: inline-block;
  vertical-align: middle;
  width: 65px;
  height: 88px;
  img {
    width: 100%;
    height: 100%;
  }
}
.book-header-main {
  display: inline-block;
  vertical-align: middle;
  width: 240px;
  margin-left: 10px;
}
.book-header-main-name {
  font-size: 16px;
  color: #fff;
  margin-bottom: 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.book-header-main-time,
.book-header-main-info {
  font-size: 12px;
  color: #fff;
  margin-bottom: 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.book-header-main-info span:first-child {
  color: #fff;
}
.book-button {
  display: flex;
  justify-content: space-between;
  padding: 0 20px 20px;
  background-color: #fff;
  a {
    display: block;
    flex: 0 0 148px;
    height: 42px;
    line-height: 42px;
    border: 1px solid #26a2ff;
    font-size: 16px;
    text-align: center;
    color: #26a2ff;
  }
  a:last-child {
    background-color: #F94040;
    color: #fff;
  }
  .book-button-disabled {
    background-color: #999;
    border: 1px solid #999;
    color: #fff;
  }
}
.book-data {
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  padding: 20px 0;
  line-height: 1.5;
  background-color: #fff;
}
.book-data-item {
  flex: 1;
  text-align: center;
  p {
    font-size: 12px;
    color: #999;
  }
  span {
    font-size: 16px;
    color: #222;
  }
}
.book-intro {
  line-height: 2;
  padding: 20px 20px 0;
  background-color: #fff;
  font-size: 13px;
  word-break: break-all;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  transition: all 0.4s ease;
  position: relative;
}
.book-intro-show {
  height: auto !important;
  overflow: auto !important;
  display: block !important;
}
.arrow {
  position: absolute;
  width: 20px;
  height: 20px;
  bottom: -5px;
  right: 5px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAENklEQVR4Xu3dzW0TURTF8feClHXowIvYYukFyTolQAWYEqgASoAKCB3QAVnHkWAb2xIpwTTghybgKB8zztzxfNx3zvEO8oJ87//Hk5PNxKAX9QYi9fQaPggAOQIBEADyDZCPrxtAAMg3QD6+bgABIN8A+fi6AQSAfAPk4+sGEADyDZCPrxtAAMg3QD6+bgABIN8A+fi6AQSAfAPk4+sGEADyDZCPrxtAAMg3QD6+bgABIN8A+fi6AQSAfAPk4+sGEADyDZCPrxtAAMg3QD6+bgABIN8A+fi6AQSAfAPk4z+5ASaT03cxpVmKcb3ZbL6sVlcX5DvKdvyiZQjhzf8Bvi0Wl98fD/MAwGR88jXGOLt/aJPS++Vyfp7tFkjfeFnLsNl8uF5dfb6/kjsA4/HJ9CDGn2X7EoK8FJXGDyGklNaL5fxlKYDj49dnLw4OflSNKgR5IKiKv33314vLB7f+3R9ejaajdHj4e9eYQuAbwXPxU0p/Fsv5UekNUPzlZHL6KYbwUQh8hy57d8/FL74nhfD28QfBpz8FjE/OY4zFp8fKl24CX0DqxK9qVvqLoIkQ+Cq8493sE7/4Zyt/EygE/g3sG38ngNvPBLoJ3CpoI/6zAITAZ/+24tcCIAS+ELQZvzYAIfCBoO34JgBCMCyCLuKbAQjBMAi6it8IgBD0i6DL+I0BCEE/CLqOvxcAIegWQR/x9wYgBN0g6Ct+KwCEoF0EfcZvDYAQtIOg7/itAhCC/RAMEb91AELQDMFQ8TsBIAQ2BEPG7wyAENRDMHT8TgEIwW4EHuJ3DkAIyhF4id8LACF4iMBT/N4ACME/BN7i9wqAHYHH+L0DYEXgNf4gANgQeI4/GAAWBN7jDwoAHUEO8QcHgIogl/guAKAhyCm+GwAoCHKL7wpA7ghyjO8OQK4Ico3vEkBuCHKO7xZALghyj+8agHcECPHdA/CKACV+FgC8IUCKnw0ALwjQ4mcFYGgEiPGzAzAUAtT4WQLoGwFy/GwB9IUAPX7WALpGwBA/ewBdIWCJDwGgbQRM8WEAtIWALT4UgH0RMMaHA9AUAWt8SABWBMzxYQHURRBSuggxnhXnq17oT0eBfnRsnecdMMeHvgG2YZsiQP+fv90P9A3QFAFLfIobwIqAKT4VgDofDNni0wHYhYAxPiWAWwT3npBaPE41xDgre7T6rp8QUL5G8SGwKtZoND26ufm1RonZZA5qAE0WhvY9AoBW1DiPABgXhnZcANCKGucRAOPC0I4LAFpR4zwCYFwY2nEBQCtqnEcAjAtDOy4AaEWN8wiAcWFoxwUArahxHgEwLgztuACgFTXOIwDGhaEdFwC0osZ5BMC4MLTjAoBW1DiPABgXhnZcANCKGucRAOPC0I4LAFpR4zwCYFwY2nEBQCtqnEcAjAtDOy4AaEWN8wiAcWFoxwUArahxnr+aEMOu5NitsQAAAABJRU5ErkJggg==)
    50% no-repeat;
  background-size: 60%;
  background-repeat: no-repeat;
  background-position: 50%;
  transition: all 0.1s ease;
}
.up {
  transform: rotate(180deg);
}
.book-menu-cell {
  padding: 20px 20px 0;
  background-color: #fff;
  display: flex;
  position: relative;
  justify-content: space-between;
  font-size: 12px;
  height: 60px;
  line-height: 60px;
  color: #999;
  border-bottom: 1px solid #f0f0f0;
  &:before {
    content: "";
    position: absolute;
    width: 355px;
    top: 20px;
    border-top: 1px solid #f0f0f0;
  }
  .book-menu-cell-title {
    color: #333;
  }
  .book-menu-cell-text {
    margin-right: 10px;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  i {
    position: absolute;
    right: 20px;
  }
}
.book-review {
  padding: 10px 20px;
  background-color: #fff;
  .book-review-title {
    display: flex;
    justify-content: space-between;
    line-height: 20px;
    margin-bottom: 10px;
    p {
      flex: 1;
      font-size: 14px;
    }
    p:last-child {
      text-align: right;
      font-size: 12px;
      color: #999;
    }
  }
}
.book-review-item {
  padding: 10px 0;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    width: 355px;
    bottom: 0;
    left: 0;
    border-bottom: 1px dashed #f0f0f0;
  }
}
.book-review-item:last-child:after {
  content: none;
}
.book-review-item-left {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: inline-block;
  vertical-align: top;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.book-review-item-right {
  width: 290px;
  display: inline-block;
  vertical-align: top;
  margin-left: 10px;
  font-size: 12px;
  line-height: 2;
  .book-review-item-name {
    color: #a58d5e;
  }
  .book-review-item-title {
    font-weight: 700;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #000;
  }
  .book-review-item-content {
    color: #999;
    word-break: break-all;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.5;
  }
  .book-review-item-love {
    color: #999;
    margin-top: 15px;
    line-height: 1;
    display: flex;
    justify-content: space-between;
    span {
      flex: 1;
    }
    span:last-child {
      text-align: right;
    }
  }
}
.book-moreLove {
  margin-top: 10px;
  background-color: #fff;
  padding: 20px 0;
  .book-moreLove-title {
    height: 20px;
    line-height: 20px;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    margin-bottom: 10px;
    border-left: 2px solid #26a2ff;
    span {
      flex: 1;
      font-weight: 700;
    }
    span:first-child {
      font-size: 14px;
    }
    span:last-child {
      font-size: 12px;
      text-align: right;
      color: #26a2ff;
    }
  }
  ul {
    display: flex;
    li {
      flex: 1;
      text-align: center;
      font-size: 12px;
      img {
        width: 60px;
        height: 80px;
      }
      p {
        margin-top: 8px;
      }
    }
  }
}
</style>
