<template>
  <div class="reader">
    <Header class="mint-header" v-show="onSetting" :title="bookTitle" :showBack="true"></Header>
    <loading v-if="isLoaded" />
    <div v-else :style="{ height: scrollHeight }" @click="setting" ref="article">
      <cube-scroll ref="scroll" :data="cpContent">
        <h1
          :style="{fontSize:fontSize+4+'px', marginBottom: '2vh',fontWeight:400,color:'#333',paddingLeft:'15px',paddingTop:'25px'}"
        >{{cpTitle}}</h1>
        <p
          :style="{fontSize:fontSize+'px',color:'#5c5d58',margin:'5px',textIndent:'2em',textAlign:'justify',padding:'5px 15px',
          verticalAlign: 'baseline'}"
          v-for="(item, index) of cpContent"
          :key="index"
          v-html="cpContent[index]"
        ></p>
      </cube-scroll>
    </div>
    <!-- 底部操作面板 -->
    <settings
      ref="setting"
      v-show="onSetting"
      :fontSize="fontSize"
      :soures="soures"
      @chapterChange="chapterChange"
      @colorChange="colorChange"
      @fontSizeChange="fontSizeChange"
      @chenge="chenge"
    ></settings>
  </div>
</template>
<script>
import Loading from "@/components/common/Loading";
import Settings from "@/components/common/Settings";
import Header from "@/components/common/Header";
export default {
  data() {
    return {
      header: {
        title: "阅读"
      },
      isLoaded: true,
      bookId: this.$route.query.bookId,
      bookTitle: "",
      chapters: [],
      cpTitle: "",
      img: "",
      cpIndex: this.$route.query.chapter - 1,
      cpContent: [],
      onSetting: true,
      darkBackground: false,
      displayChanging: false,
      fontSize: 16,
      soures: []
    };
  },
  components: {
    Loading,
    Settings,
    Header
  },
  created() {
    this.getBookById(this.$route.query.bookId);
  },
  methods: {
    // 书籍信息
    getBookById(bookId) {
      this.$axios.get(`/api/book/${bookId}`).then(res => {
        this.bookTitle = res.data.title;
        this.img = this.$store.state.imgHeader + res.data.cover;
        this.getBookSources(bookId);
      });
    },
    // 获取书源
    getBookSources(bookId, index = 0) {
      this.$axios.get(`api/atoc?view=summary&book=${bookId}`).then(res => {
        this.getBookChapters(res.data[index]._id);
        this.soures = res.data;
        // console.log(this.soures);
      });
    },
    // 根据书源获取章节
    getBookChapters(sourceId) {
      this.$axios.get(`api/atoc/${sourceId}?view=chapters`).then(res => {
        this.chapters = res.data.chapters;
        // console.log(this.$route.query.chapter)
        this.getChapterContent(this.chapters[this.cpIndex].link);
      });
    },
    // 获取章节内容
    getChapterContent(link) {
      this.$axios
        .get(`api/chapter/${link}`)
        .then(res => {
          // console.log(res.data.chapter.isVip);
          if (res.data.chapter.isVip) {
            this.cpTitle = "本章为付费章节，请至正版阅读平台订阅";
            return;
          }
          this.cpContent = res.data.chapter.cpContent.split("\r\n");
          this.cpContent = res.data.chapter.cpContent.split("\n");
          this.cpContent = this.cpContent.map(item => `${item.trim()}`);
          this.cpTitle = res.data.chapter.title;
          this.isLoaded = false;
        })
        .catch(() => {
          this.isLoaded = false;
          this.cpTitle = "获取章节信息失败";
        });
    },
    setting() {
      this.onSetting = !this.onSetting;
      // this.$refs.setting.showOptions();
    },
    chapterChange(to) {
      if (
        this.cpIndex + to >= 0 &&
        this.cpIndex + to < this.chapters.length - 1
      ) {
        this.cpIndex += to;
        this.getChapterContent(this.chapters[this.cpIndex].link);
        this.scrollTo();
      }
      this.setBookLocalStorage();
    },
    //将书源和章节及页面缓存到LocalStorage
    setBookLocalStorage() {
      if (window.localStorage.getItem("xiaoshuo_shelf")) {
        let _arr = JSON.parse(window.localStorage.getItem("xiaoshuo_shelf"));
        for (let i = 0; i < _arr.length; i++) {
          // for (let j = 0; j < _arr.length; j++){
          if (_arr[i].id === this.bookId) {
            _arr[i].cpIndex = this.cpIndex;
            window.localStorage.setItem("xiaoshuo_shelf", JSON.stringify(_arr));
            // console.log("id相同")
            return
          // } else {
          //    console.log("id不同")
          //   _arr.push({
          //     id: this.bookId,
          //     name: this.bookTitle,
          //     img: this.img,
          //     cpIndex: this.cpIndex
          //   });
          //   window.localStorage.setItem("xiaoshuo_shelf", JSON.stringify(_arr));
          //   return
          // }
          }
        }
      } 
    },
    scrollTo() {
      this.$refs.scroll.scrollTo(0, 0, 1);
    },
    colorChange(backgroundColor) {
      this.$refs.article.style.backgroundColor = backgroundColor;
      if (backgroundColor === "#2c2c2c") {
        this.darkBackground = true;
      } else {
        this.darkBackground = false;
      }
    },
    fontSizeChange(fontSize) {
      this.fontSize = fontSize;
    },
    chenge(index) {
      this.getBookSources(this.$route.query.bookId, index);
    }
  },
  computed: {
    scrollHeight() {
      return (
        this.$store.state.clientHeight -
        (24.53333 * this.$store.state.clientWidth) / 210 +
        "px"
      );
    }
  }
};
</script>

<style lang="less" scoped>
.reader {
  height: 100vh;
  background: rgb(238, 230, 221);
  ::v-deep .mint-header {
    background-color: rgba(50, 51, 52, 0.9);
    box-shadow: 0 1px 2px 0px rgba(50, 51, 52, 0.9);
    z-index: 99;
    position: fixed;
  }
  .cube-scroll-wrapper {
    height: 110%;
  }
}
</style>
