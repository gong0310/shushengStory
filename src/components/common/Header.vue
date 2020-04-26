<template>
  <div class="header">
    <div class="header-left">
      <i class="cubeic-back" v-if="showBack" @click="back"></i>
      <span class="header-span" v-text="title" v-if="title"></span>
      <i @click="neww" class="iconfont icon-tihuan neew"></i>
    </div>
    <div class="header-title">
      <slot name="title"></slot>
    </div>
    <div class="header-label">
      <slot name="label"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      default: "",
      type: String
    },
    showBack: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      // parh: ""
    };
  },
  methods: {
    back() {
      // this.$router.push(`${this.parh}`);
      // console.log(this.parh)
      this.$router.go(-1)
    },
    neww() {
      this.$router.go(0);
    }
  },
  // beforeRouteEnter(to, from, next) {
  //   console.log(from)
  //   next(vm => {
  //     vm.parh = from.path;
  //   });
  // }
};
</script>

<style lang="less" scoped>
.header {
  z-index: 10;
  position: relative;
  font-size: 16px;
  width: 100%;
  height: 40px;
  line-height: 40px;
  // background-color: #26a2ff;
  background-color: #f94040;
  color: #fff;
  box-shadow: 0 2px 1px #e9eaea;
  .header-left {
    display: flex;
    justify-content: center;
  }
  .header-span {
    display: block;
    text-align: center;
  }
  .cubeic-back {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0 15px;
    color: #fff;
  }
  .header-title {
    margin: 0 auto;
    text-align: center;
  }
  .header-label {
    position: absolute;
    top: 0;
    right: 15px;
    height: 40px;
    line-height: 40px;
  }
}
</style>
