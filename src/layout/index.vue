<template>
  <div class="app-wrapper">
    <div class="banner">
      <div class="logo">
        <img
          src="@/assets/images/logo.png"
          alt="江西省核工业地质局安全生产管理系统"
          title="江西省核工业地质局安全生产管理系统"
        >
        <span class="title-font">江西省核工业地质局安全生产管理系统</span>
      </div>
    </div>
    <navbar />
    <div class="main-container">
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  computed: {
  },
  watch: {
    $router(to, from) {
      console.log(to, 'ss')

      console.log(from)
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
.banner {
  display: flex;
  height: 140px;
  padding: 0 50px;
  justify-content: space-between;
  align-items: center;
  background-color: #e2ecf4;
  background-image: url('../assets/images/banner.png');
  .logo{
    display: flex;
    align-items: center;
  }
  img {
    width: 60px;
    height:  60px;
    margin-right: 5px;
    // vertical-align: middle;
  }
  span{
    font-size: 36px;
    line-height: 60px;;
    font-weight: bold;
    color: #409EFF;
    background: linear-gradient(#1890ff, #0082bd);
    -webkit-background-clip: text;
    color: transparent;
  }
}
.ban ul li{
  padding-top:12px;
  font-size: 14px;
  text-align: center;
  color: #898989;
}
</style>
<style scoped>
</style>
