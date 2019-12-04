<template>
  <div class="layout">
    <div class="el-menu-div" v-if="showHeader">
      <div class="el-menu-sub-div">
        <span class="el-menu-name">Go</span>
        <el-menu
          router
          :default-active="$route.path"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="/home">首页</el-menu-item>
          <el-menu-item index="/about">关于</el-menu-item>
        </el-menu>
      </div>
    </div>
    <router-view/>
  </div>
</template>
<script>
export default {
	name: 'home',
	data() {
		return {
			showHeader: false,
			activeIndex: '',
		}
	},
	methods: {
		handleSelect(key, keyPath) {
			console.log(key, keyPath)
		}
	}
}
</script>
<style>
.el-menu-div {
  width: 100%;
  background-color: #545c64;
}

.el-menu-sub-div {
  width: 80%;
  height: 60px;
  margin: 0 auto;
}

.el-menu-name {
  color: #fff;
  width: 80%;
  height: 60px;
  line-height: 60px;
}

.el-menu-demo {
  float: right;
}

.main-container {
  width: 80%;
  margin: 0px auto;
  padding: 20px 0px;
}

</style>
