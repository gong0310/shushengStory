<template>
  <div>
    <div id="app">
      <transition-group tag="ul" name="move" mode="out-in">
        <li v-for="(img,i) in imgs" v-show="i === index" :key="img.id">
          <img :src="img.img"  @click="goread(img.id)" />
        </li>
      </transition-group>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imgs: [],
      index: 0,
      id: "5910018c8094b1e228e5868f"
    };
  },
  mounted() {
    this.timer = setInterval(() => {
      if (this.index < this.imgs.length - 1) {
        this.index++;
      } else {
        this.index = 0;
      }
    }, 3500);
    this.getSwiperData();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    getSwiperData() {
      this.$axios
        .get("api/recommendPage/node/spread/" + this.id, {
          params: {
            pl: "ios"
          }
        })
        .then(res => {
          for (let i = 0; i < res.data.data.length; i++) {
            this.imgs.push({
              id: res.data.data[i].link,
              img: res.data.data[i].img
            });
          }
        });
    },
    goread(id){
        console.log(id)
        this.$router.push({path:'book',query:{id:id}})
    }
  }
};
</script>
<style lang="less" scoped>
#app {
  width: 100vw;
  height: 120px;
  position: relative;
  font-size: 0;
  overflow: hidden;
}

#app li {
  position: absolute;
  display: inline-block;
}
img{
    width: 100vw;
    height: 120px;
}
.move-enter {
  opacity: 0;
}

.move-enter-active,
.move-leave-active {
  transition: all 1s linear;
}

.move-enter-to,
.move-leave {
  opacity: 1;
}

.move-leave-to {
  opacity: 0;
}
</style>