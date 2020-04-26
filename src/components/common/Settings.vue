<template>
  <div class="settings">
    <!-- 章节选择 -->
    <div class="chapterSelector">
      <span @click="chapterChange(-1)">上一章</span>
      <div class="progress-bar"></div>
      <span @click="chapterChange(1)">下一章</span>
    </div>
    <!-- 选项按钮 -->
    <div class="options" v-show="!displayChanging">
      <div class="items" @click="goToCatalogue">
        <span class="text">目录</span>
      </div>
      <div class="items" @click="hideOptions">
        <span class="text">主题</span>
      </div>
      <div class="items">
        <cube-button class="text" @click="showPickerStyle">换源</cube-button>
      </div>
    </div>
    <!-- 显示设置 -->
    <div class="displayOptions" v-show="displayChanging">
      <div class="back-color">
        <span>主题颜色</span>
        <div class="color-options" @click="colorChange($event)">
          <input id="color1" name="color" type="radio" :value="'#eee6dd'" checked />
          <label for="color1" />
          <input id="color2" name="color" type="radio" :value="'#ffffff'" />
          <label for="color2" />
          <input id="color3" name="color" type="radio" :value="'#2c2c2c'" />
          <label for="color3" />
        </div>
      </div>
      <div class="font-size">
        <span class="text">字号调整</span>
        <div class="buttons">
          <span @click="fontSizeChange(-1)">Aa-</span>
          <span @click="fontSizeChange(1)">Aa+</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    fontSize: Number,
    soures: Array
  },
  data() {
    return {
      displayChanging: false,
      sizeRange: [12, 14, 16, 18, 20],
    };
  },
  methods: {
    aaa(val){
      console.log(val)
    },
    chapterChange(to) {
      this.$emit("chapterChange", to);
    },
    hideOptions() {
      this.displayChanging = true;
    },
    showOptions() {
      this.displayChanging = false;
    },
    colorChange(e) {
      if (e.target.nodeName === "INPUT") {
        this.$emit("colorChange", e.target.value);
        this.displayChanging = false;
      }
    },
    fontSizeChange(value) {
      let index = this.sizeRange.indexOf(this.fontSize) + value;
      if (this.sizeRange[index]) {
        this.$emit("fontSizeChange", this.sizeRange[index]);
        this.displayChanging = false;
      }
    },
    goToCatalogue() {
      this.$router.push({
        name: "mulu",
        query: { id: this.$route.query.bookId }
      });
      this.is=true
    },
    showPickerStyle() {
      this.$createActionSheet({
        title: "可选书源",
        pickerStyle: true,
        data: [
          {
            content: this.soures[0].name
          },
          // {
          //   content: this.soures[1].name
          // },
          // {
          //   content: this.soures[2].name
          // },
          // {
          //   content: this.soures[3].name
          // },
          // {
          //   content: this.soures[4].name
          // },
        ],
        onSelect: (item, index) => {
          this.$createToast({
            txt: `切换至 ${item.content}`,
            type: "correct",
            time: 1000
          }).show();
          this.$emit("chenge", index);
        },
        onCancel: () => {
          this.$createToast({
            txt: `已取消换源`,
            type: "warn",
            time: 1000
          }).show();
        }
      }).show();
    }
  }
};
</script>
<style lang="less" scoped>
.settings {
  position: fixed;
  bottom: 0;
  background-color: rgba(50, 51, 52, 0.9);
  width: 100vw;
  color: #fff;
  z-index: 5;
  .chapterSelector {
    padding-top: 3vh;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .progress-bar {
      width: 50vw;
      height: 1px;
      border-radius: 4px;
      background-color: #b2b2b2;
    }
    span {
      font-size: 2.2vh;
    }
  }
  .options {
    margin-top: 2.4vh;
    margin-bottom: 2vh;
    display: flex;
    justify-content: space-around;
    .items {
      display: flex;
      flex-direction: column;
      align-items: center;
      .iconfont {
        font-size: 3.8vh;
        margin-bottom: 1vh;
      }
      .text {
        font-size: 1.6vh;
      }
    }
  }
  .displayOptions {
    padding: 4vh;
    display: flex;
    justify-content: space-around;
    .back-color {
      width: 50vw;
      text-align: center;
      .color-options {
        margin-top: 2vh;
        display: flex;
        justify-content: space-around;
        input {
          //   width: 0;
          //   height: 0;
          display: none;
          &:checked + label {
            border: 1px solid #f78a25;
          }
        }
        label {
          width: 4.4vh;
          height: 4.4vh;
          border-radius: 50%;
          background-color: red;
          display: inline-block;
          border: 1px solid rgb(75, 75, 75);
          &:first-of-type {
            background: #eee6dd;
          }
          &:nth-of-type(2) {
            background: #ffffff;
          }
          &:nth-of-type(3) {
            background: #2c2c2c;
          }
        }
      }
      span {
        font-size: 2vh;
      }
    }
    .font-size {
      width: 50vw;
      text-align: center;
      .text {
        font-size: 2vh;
        padding-bottom: 2vh;
      }
      .buttons {
        margin-top: 3vh;
        span {
          font-size: 2.6vh;
          display: inline-block;
          width: 20vw;
        }
      }
    }
  }
}
.cube-btn {
  background-color: rgba(50, 51, 52, 0);
  padding: 0;
}
</style>
