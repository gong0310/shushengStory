<template>
  <div>
    <Header :title="header.title" :showBack="true"></Header>
    <Loading v-if="isLoaded"></Loading>
    <div class="book-review-main" v-else :style="{ height: scrollHeight }">
      <cube-scroll>
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
      bookReviewData: [],
      header: {
        title: "更多评论"
      },
      isLoaded: true
    };
  },
  computed: {
    scrollHeight() {
      return (
        this.$store.state.clientHeight -
        (10.66667 * this.$store.state.clientWidth) / 100 +
        "px"
      );
    }
  },
  mounted() {
    this.getBookReview();
  },
  methods: {
    getBookReview() {
      this.$axios
        .get(
          `/api/post/review/best-by-book?book=${this.$route.query.id}&limit=30`
        )
        .then(res => {
          //   console.log(res);
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
          this.isLoaded = false;
          this.bookReviewData = _bookReviewData;
        });
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
    }
  }
};
</script>

<style lang="less" scoped>
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
</style>
