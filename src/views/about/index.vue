<template>
  <div class="main-container">
    <div class="block">
      <el-timeline :reverse="true">
        <el-timeline-item timestamp="2019/11/11" placement="top">
          <el-card shadow="never">
            <h4>初始化 Github 模板</h4>
            <p>金坤 提交于 2019/11/11 09:00</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2019/11/13" placement="top">
          <el-card shadow="never">
            <h4>更新 Github 模板</h4>
            <p>金坤 提交于 2019/11/13 09:00</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>
<script>
export default {
	name: 'about',
	data() {
		return {}
	},
	methods: {},
	created() {
		console.log('created')
	}
}
</script>
