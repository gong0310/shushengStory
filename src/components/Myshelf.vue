<template>
  <div>
    <Header :title="header.title"></Header>
    <div class="shelf">
      <div class="shelf-main" :style="{ height: scrollHeight }" v-if="hasBook">
      <cube-scroll>
           <cube-swipe>
            <router-link
              :to="{
                path: '/read',
                query: { bookId: item.item.id,chapter:item.item.cpIndex+1}
              }"
              tag="div"
              class="shelf-item"
              v-for="(item, index) in bookData"
              :key="index"
            >
              <cube-swipe-item
                :btns="item.btns"
                :index="index"
                ref="swipeItem"
                @btn-click="btnClick"
              >
                <div class="shelf-item-img">
                  <img v-lazy="item.item.img" :key="item.item.img" />
                </div>
                <div class="shelf-item-content">
                  <p>
                    <span v-text="item.item.name"></span>
                    <span class="shelf-tag" v-text="item.item.time"></span>
                  </p>
                  <p v-text="item.item.author + ' 著'"></p>
                  <p v-text="'连载至:' + item.item.lastChapter"></p>
                  <span class="del">&lt;左滑
                    <i class="iconfont icon-delete"></i>
                  </span>
                </div>
              </cube-swipe-item>
            </router-link>
          </cube-swipe>
      </cube-scroll>
      </div>
      <div class="shelf-no" :style="{ height: scrollHeight}" v-else>
        <div class="shelf-no-main">
          <img src="../assets/add.jpg" @click="add" />
          <p>客官的书架空空如也</p>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>
<script>
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
export default {
  components: {
    Header,
    Footer
  },
  data() {
    return {
      header: {
        title: "书架"
      },
      bookData: [],
      hasBook: false,
    };
  },
  computed: {
    scrollHeight: function() {
      return (
        this.$store.state.clientHeight -
        (24.53333 * this.$store.state.clientWidth) / 100 +
        "px"
      );
    }
  },
methods: {
    getData() {
      if (window.localStorage.getItem("xiaoshuo_shelf")) {
        let _arr = JSON.parse(window.localStorage.getItem("xiaoshuo_shelf"));
        // for (let i = 0; i < _arr.length; i++) {
        //   for (let j = 0; j < _arr.length; j++){
        //     if(_arr[i].id === _arr[j].id){
        //       _arr.splice(i,1)
        //     }
        //   }
        // }
        let _ids = [];
        _arr.map(item => {
          _ids.push(item.id);
          // console.log(item)
        });
        this.$axios
          .get("api/book", {
            params: {
              view: "updated",
              id: _ids.toString()
            }
          })
          .then(res => {

            if (res.data && res.data.length > 0) {
              let _bookData = [];
              for (let i = 0; i < res.data.length; i++) {
                _bookData.push({
                  item: {
                    id: res.data[i]._id,
                    img: _arr[i].img,
                    name: _arr[i].name,
                    cpIndex:_arr[i].cpIndex,
                    author: res.data[i].author,
                    lastChapter: res.data[i].lastChapter,
                    time: this.formatUpdatedTime(res.data[i].updated, "前"),
                  },
                  btns: [
                    {
                      action: "delete",
                      text: "删除",
                      color: "#ff3a32"
                    }
                  ]
                });
              }
              this.bookData = _bookData;
              // console.log(this.bookData)
              this.hasBook = true;
            }
          });
      }
    },
    btnClick(btn, index) {
      if (btn.action === "delete") {
        this.$refs.swipeItem[index].shrink();
        this.$createDialog({
          type: "confirm",
          title: "温馨提示",
          content: "确定要从书架中删除？",
          onConfirm: () => {
            let _arr = JSON.parse(
              window.localStorage.getItem("xiaoshuo_shelf")
            );
            for (let i = 0; i < _arr.length; i++) {
              if (_arr[i].id === this.bookData[index].item.id) {
                _arr.splice(i, 1);
                if (_arr.length > 0) {
                  window.localStorage.setItem(
                    "xiaoshuo_shelf",
                    JSON.stringify(_arr)
                  );
                } else {
                  window.localStorage.removeItem("xiaoshuo_shelf");
                  this.hasBook = false;
                }
                this.bookData.splice(index, 1);
              }
            }
          }
        }).show();
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
    add(){
      this.$router.push('ranking')
    }
},
  // created() {
  //   this.getData();
  // },
   beforeRouteEnter(to,from,next){
    next(vm=>{
      vm.getData()
    })
},
}
</script>
<style lang="less" scoped>
.shelf-main {
  background-color: #fff;
}

.shelf-item {
  margin: 20px 0;
  position: relative;
  &:after {
    content: "";
    width: 100%;
    position: absolute;
    bottom: -10px;
    left: 20px;
    border-bottom: 1px dashed #f0f0f0;
  }
}
.shelf-item-img {
  width: 58px;
  height: 78px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 20px;
  img {
    width: 100%;
    height: 100%;
  }
}
.shelf-item-content {
  width: calc(100vw - 110px) !important;
  display: inline-block;
  vertical-align: middle;
  position: relative;
  width: 262px;
  margin-left: 15px;
  line-height: 1.5;
  p {
    color: #666;
    font-size: 12px;
  }
  p:first-child {
    color: #333;
    font-weight: 700;
    font-size: 14px;
  }
  p:first-child span:first-child {
    display: inline-block;
    vertical-align: middle;
  }
  .shelf-tag {
    display: inline-block;
    vertical-align: middle;
    padding: 1px 4px;
    margin-left: 5px;
    border-radius: 10px;
    border: 1px solid #26a2ff;
    font-size: 10px;
    color: #26a2ff;
  }
}
.del{
  position: absolute;
  right: 0px;
  top: 20px;
  font-size: 14px;
}
.shelf-no {
  text-align: center;
  position: relative;
  .shelf-no-main {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 150px;
    }
    p {
      font-size: 16px;
      margin-top: 20px;
      color: #F94040;
    }
  }
}
</style>