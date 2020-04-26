<template>
  <div>
    <Header :title="header.title"></Header>
     <Loading v-if="isLoaded"/>
    <div class="classify"  :style="{ height: scrollHeight }" v-else>
      <cube-scroll>
      <div>
        <div class="classify-item" v-for="(item, index) in classify" :key="index">
          <p class="classify-item-title" v-text="item.value"></p>
          <div class="classify-item-children">
            <div
              class="classify-item-childrenItem"
              v-for="(items, index) in item.children"
              :key="index"
              @click="toCategory(item.key, items.name)"
            >
              <p>{{items.name}}</p>
              <span>{{items.bookCount}}</span>
            </div>
          </div>
        </div>
      </div>
      </cube-scroll>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Loading from "@/components/common/Loading";
export default {
  components: {
    Header,
    Footer,
    Loading
  },
  data() {
    return {
      header: {
        title: "分类"
      },
      isLoaded: true,
      classify: [
        { value: "男生", key: "male", children: [] },
        { value: "女生", key: "female", children: [] },
        { value: "漫画", key: "picture", children: [] },
        { value: "出版", key: "press", children: [] }
      ]
    };
  },
  methods: {
    getData() {
      this.$axios.get(`/api/cats/lv2/statistics`).then(res => {
        for (let i = 0; i < this.classify.length; i++) {
          let parent = this.classify[i];
          parent.children = res.data[parent.key];
        }
        this.isLoaded=false
      });
    },
    toCategory(gender, name) {
      this.$router.push({
        path: "category",
        query: { gender: gender, name: name }
      });
    }
  },
  created() {
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

<style scoped>
.classify {
  background-color: #fff;
  height: 100vh;
}
.classify-item-children {
  box-sizing: border-box;
  position: relative;
  border-left: 1px solid #f5f5f5;
  border-top: 1px solid #f5f5f5;
}
.classify-item-title {
  padding: 20px 10px;
  font-size: 12px;
  color: #999;
}
.classify-item-childrenItem {
  box-sizing: border-box;
  display: inline-block;
  width: 33.3333%;
  padding: 20px 0;
  text-align: center;
  position: relative;
  border-right: 1px solid #f5f5f5;
  border-bottom: 1px solid #f5f5f5;
}
.classify-item-childrenItem p {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
}
.classify-item-childrenItem span {
  font-size: 12px;
  color: #ccc;
}
.footer {
  position: fixed;
  bottom: 0px;
}
</style>
