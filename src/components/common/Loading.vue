<template>
  <div class="loading">
    <div class="container">
      <img src="../../assets/load.gif" alt="">
      <p>快马加鞭中,客官请稍后...</p>
      <span>或点击顶部刷新试试</span>
    </div>
  </div>
</template>
<script>
export default {
}
</script>
<style lang="less" scoped>
.loading {
  position: absolute;
  top: 0vh;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  .container {
    width: 300px;
    height: 50px;
    border-radius: 5%;
    line-height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    img{
      width: 200px;
      height: 200px;
    }
    p {
      color: rgb(165, 165, 165);
    }
    span{
      color: rgb(165, 165, 165);
      font-size: 12px;
    }
  }
}
</style>
