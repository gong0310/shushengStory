<template>
  <div class="catalogue">
    <Header :title="bookTitle" :showBack="true"></Header>
    <div>
      <loading v-if="isLoaded" />
      <div class="info" v-else>
        <span class="count">共{{chapters.length}}章</span>
        <span class="sort" @click="reverse">
          <span v-if="!ascOrder">&uarr;倒序</span>
          <span v-if="ascOrder">&darr;正序</span>
        </span>
      </div>
      <ul :style="{ height: scrollHeight }" ref="book">
        <cube-scroll>
          <li class="chapters" v-for="(item, index) of chapters" :key="index">
            <div  @click="ch(index+1)">
              {{ item.order }}&nbsp;{{ item.title }}
            </div>
          </li>
        </cube-scroll>
      </ul>
    </div>
  </div>
</template>
<script>
import Header from "./Header";
import Loading from "@/components/common/Loading";
export default {
  data() {
    return {
      bookId: this.$route.query.id,
      bookTitle: "",
      chapters: [],
      ascOrder: true,
      isLoaded: true,
      chapter:1
    };
  },
  components: {
    Header,
    Loading
  },
  created() {
    this.getBookChapters();
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
  methods: {
    // 根据书源获取章节
    getBookChapters() {
      this.$axios.get(`api/mix-atoc/${this.bookId}?view=chapters`).then(res => {
        this.chapters = res.data.mixToc.chapters;
        this.isLoaded = false;
      }),
        this.$axios.get(`/api/book/${this.bookId}`).then(res => {
          this.bookTitle = res.data.title;
        });
    },
    reverse() {
      this.chapters = this.chapters.reverse();
      this.ascOrder = !this.ascOrder;
    },
    ch(index){
       if(this.ascOrder){
        this.chapter=index
      }else{
        this.chapter=this.chapters.length-index
      }
      this.$router.push({name: 'read',query:{bookId:this.bookId,chapter:this.chapter}})
    }
  }
};
</script>
<style lang="less" scoped>
.info {
  position: fixed;
  top: 8vh;
  height: 30px;
  width: 100vw;
  background: #f6f6f6;
  span {
    font-size: 16px;
    &.count {
      color: #999;
      padding: 10px;
    }
    &.sort {
      color: #222;
      padding: 10px;
      position: relative;
      left: calc(100vw - 158px);
    }
  }
}
ul {
  padding-top: 5px;
  margin-left: 5vw;
  margin-top: 45px;
  li {
    padding-bottom: 34px;
    a {
      font-size: 14px;
      line-height: 20px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      color: #999;
    }
  }
}
</style>
