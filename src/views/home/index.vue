<template>
  <div class="container">
    <div>
      <h1 style="font-size: 300%;color: #666;">{{data.title}}
        <small>
          <el-button v-if="!editable" type="text" class="admin"
                     @click="loginDialogVisible = true">Admin
          </el-button>
          <el-button v-if="editable" type="text" class="admin"
                     @click="logout">退出
          </el-button>
        </small>
      </h1>
    </div>
    <div>
      <el-tabs
        ref="dragTabs"
        v-model="editableTabsValue"
        type="card"
        :editable="editable"
        @edit="handleTabsEdit">
        <el-tab-pane
          :key="tab.title"
          v-for="(tab, index) in data.tabs"
          :label="tab.title"
          :name="tab.title">
          <span slot="label"><i class="el-icon-rank" v-if="editable"></i> {{tab.title}}</span>
          <ul class="content-list">
            <li class="content-item draggable" v-for="g in tab.guides">
              <div class="el-card" :style="{'border-color':g.color}">
                <div class="el-card__header" :style="{'background-color':g.color}">
                  <div>
                    <span class="title" :style="{'max-width':editable?'90%':'100%'}">{{g.title}}</span>
                    <div style="position: absolute;top: 22px;right: 5px;z-index: 2;">
                      <i v-if="editable" class="el-icon-rank my-handle"
                         style="cursor: pointer;color:#FFFFFF;"></i>
                      <i v-if="editable" @click="editGuide(g)" class="el-icon-edit"
                         style="cursor: pointer;color:#FFFFFF;"></i>
                      <i v-if="editable" @click="deleteGuide(g)" class="el-icon-delete"
                         style="cursor: pointer;color:#FFFFFF;"></i>
                    </div>
                  </div>
                </div>
                <div class="el-card__body content">
                  <div class="summary">
                    {{g.summary}}
                  </div>
                  <div class="bottom">
                    <time class="time">{{g.time}}</time>
                    <el-link
                      :href="g.link"
                      style="float: right;"
                      :style="{'color':g.color}"
                      target="_blank">
                      查看<i class="el-icon-view el-icon--right"></i>
                    </el-link>
                  </div>
                </div>
              </div>
            </li>
            <li v-if="editable"
                class="content-item ignore-elements"
                style="text-align: center;line-height: 12em;border: 1px dashed #E4E7ED;border-radius: 4px;">
              <i class="el-icon-plus" style="font-size: 28px;cursor: pointer;" @click="addGuide"></i>
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--登录-->
    <el-dialog title="登录" :visible.sync="loginDialogVisible" width="30%" destroy-on-close>
      <el-form label-width="20%">
        <el-form-item label="密码">
          <el-input v-model="password" autocomplete="off" show-password style="width:80%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="loginDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="login">确 定</el-button>
      </div>
    </el-dialog>
    <!--新增Tab-->
    <el-dialog title="新增分类" :visible.sync="tabDialogVisible" width="30%" destroy-on-close>
      <el-form label-width="20%">
        <el-form-item label="标题">
          <el-input v-model="tabTitle" autocomplete="off" style="width:80%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tabDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTab">确 定</el-button>
      </div>
    </el-dialog>
    <!--新增Guide-->
    <el-dialog title="新增导航" :visible.sync="guideDialogVisible" width="30%" destroy-on-close>
      <el-form :model="guide" label-width="20%">
        <el-form-item label="标题">
          <el-input v-model="guide.title" autocomplete="off" style="width:80%" :disabled="!guideAddOrEdit"></el-input>
        </el-form-item>
        <el-form-item label="摘要">
          <el-input
            v-model="guide.summary"
            autocomplete="off"
            style="width:80%"
            type="textarea"
            :rows="3">
          </el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="guide.link" autocomplete="off" style="width:80%"></el-input>
        </el-form-item>
        <el-form-item label="颜色">
          <el-color-picker
            v-model="guide.color"
            :predefine="predefineColors">
          </el-color-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="guideDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateGuide">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {setToken, removeToken, getToken} from '@/utils/auth'
import {formatDate} from '@/utils/index'
import Sortable from 'sortablejs'
import * as home from '@/api/home'

const defaultGuide = {
	title: '',
	summary: '',
	link: '',
	color: '#409EFF',
	time: ''
}

export default {
	name: 'home',
	computed: {
		// Vuex
		...mapGetters([
			'editable',
		])
	},
	data() {
		return {
			data: {
				// title: '',
				// tabs: [
				// 	{
				// 		title: '嘻嘻',
				// 		guides: [
				// 			{
				// 				title: '哈哈',
				// 				summary: '摘要',
				// 				link: '链接',
				// 				color: '#FF0000',
				// 				time: '2019/11/28 13:46',
				// 			}
				// 		]
				// 	}
				// ]
			},
			editableTabsValue: '0',
			loginDialogVisible: false,
			password: '',
			tabDialogVisible: false,
			tabTitle: '',
			guideDialogVisible: false,
			guideAddOrEdit: true, // true:新增 false:编辑
			guide: {
				title: '',
				summary: '',
				link: '',
				color: '#409EFF',
				time: ''
			},
			predefineColors: [
				'#409EFF',
				'#67C23A',
				'#E6A23C',
				'#F56C6C',
				'#909399'
			]
		}
	},
	watch: {
		editableTabsValue: {
			handler(newVal, oldVal) {
				// console.info(`editableTabsValue:${newVal}`)
				let self = this
				// Tab切换时绑定内容的拖拽事件
				self.$nextTick(() => {
					self.onGuidesDrag()
				})
			},
			immediate: false
		},
		editable: {
			handler(newVal, oldVal) {
				// console.info(`editable:${newVal}`)
				let self = this

				// 编辑状态下绑定Tab的拖拽事件
				if (newVal) {
					self.$nextTick(() => {
						self.onTabsDrag()
					})
				}
			},
			immediate: false
		}
	},
	mounted() {
		// console.info('mounted')
	},
	methods: {
		// 加载首页数据
		async load() {
			this.data = await home.index()
			// 默认选中第一个Tab
			if (this.data.tabs && this.data.tabs.length > 0 && this.editableTabsValue === '0') {
				this.editableTabsValue = this.data.tabs[0].title
			}
		},
		// 登录
		async login() {
			let data = await home.login({password: this.password})
			if (data && data.token) {
				// 保存Token
				setToken(data.token)

				// 开启编辑
				this.$store.dispatch('home/setEditable', true)

				// 隐藏对话框
				this.loginDialogVisible = false
			}
		},
		// 保存
		async save() {
			await home.save(this.data)
		},
		// 退出
		logout() {
			// 清除Token
			removeToken()

			// 关闭编辑
			this.$store.dispatch('home/setEditable', false)
		},
		// 添加&删除Tab
		handleTabsEdit(targetName, action) {
			if (action === 'add') {
				this.tabDialogVisible = true
			}
			if (action === 'remove') {
				this.$confirm('此操作将永久删除该类别以及内容, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {

					// 删除Tab
					let tabs = this.data.tabs
					let activeName = this.editableTabsValue
					if (activeName === targetName) {
						tabs.forEach((tab, index) => {
							if (tab.title === targetName) {
								let nextTab = tabs[index + 1] || tabs[index - 1]
								if (nextTab) {
									activeName = nextTab.title
								}
							}
						})
					}

					this.editableTabsValue = activeName
					this.data.tabs = tabs.filter(tab => tab.title !== targetName)

					// 更新数据
					this.save()
				}).catch((err) => {
					console.error(err)
				})
			}
		},
		async addTab() {
			let newTabName = this.tabTitle
			if (this.data.tabs) {
				// 检测是否已经存在
				if (this.data.tabs.find(tab => tab.title === newTabName)) {
					this.$message({
						message: '请勿重复输入类别名!',
						type: 'error',
						duration: 1000
					})
					return
				}
			} else {
				this.data.tabs = []
			}

			this.data.tabs.push({
				title: newTabName,
				guides: []
			})
			this.editableTabsValue = newTabName

			// 更新数据
			// await this.save()

			// 隐藏对话框
			this.tabTitle = ''
			this.tabDialogVisible = false
		},
		onTabsDrag() {
			let self = this
			let tab = self.$refs.dragTabs.$el.querySelectorAll('.el-tabs__nav')[0]
			Sortable.create(tab, {
				animation: 150,
				onEnd({newIndex, oldIndex}) {
					const currRow = self.data.tabs.splice(oldIndex, 1)[0]
					self.data.tabs.splice(newIndex, 0, currRow)

					self.onDragEnd()
				}
			})
		},
		onDragEnd() {
			this.save()
			// let response = home.save(this.data)
			// console.info(this.tabs)
			// console.info(this.guides)
		},
		onGuidesDrag() {
			const self = this
			// 参考https://www.jianshu.com/p/d92b9efe3e6a
			const $ul = self.$refs.dragTabs.$el.querySelectorAll(`#pane-${this.editableTabsValue}>ul`)[0]
			Sortable.create($ul, {
				handle: '.my-handle', // 列表项中拖动手柄选择
				filter: '.ignore-elements',// 选择不支持拖动的选择器
				animation: 150,// 毫秒，排序时移动物品的动画速度
				draggable: '.draggable',  // 指定元素中的哪些项应该是可拖动的
				onUpdate: function (event) {
					//修改items数据顺序
					let newIndex = event.newIndex
					let oldIndex = event.oldIndex
					const $li = $ul.children[newIndex]
					const $oldLi = $ul.children[oldIndex]
					// 先删除移动的节点
					$ul.removeChild($li)
					// 再插入移动的节点到原有节点，还原了移动的操作
					if (newIndex > oldIndex) {
						$ul.insertBefore($li, $oldLi)
					} else {
						$ul.insertBefore($li, $oldLi.nextSibling)
					}
					// 更新items数组
					// var item = _this.items.splice(oldIndex,1)
					// _this.items.splice(newIndex,0,item[0])

					// 下一个tick就会走patch更新
				},
				onEnd({newIndex, oldIndex}) {

					// 通过新增onUpdate方法解决数据变了,UI却无法刷新问题
					self.data.tabs.forEach((tab, index) => {
						if (tab.title === self.editableTabsValue) {
							const currRow = self.data.tabs[index].guides.splice(oldIndex, 1)[0]
							self.data.tabs[index].guides.splice(newIndex, 0, currRow)
							self.onDragEnd()
						}
					})
				}
			})
		},
		copy(obj) {
			return JSON.parse(JSON.stringify(obj))
		},
		deleteGuide(g) {
			let self = this
			self.$confirm('此操作将永久删除该内容, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				// 删除Tab
				self.data.tabs.forEach((tab, index) => {
					if (tab.title === self.editableTabsValue) {
						self.data.tabs[index].guides = self.data.tabs[index].guides.filter(guide => guide.title !== g.title)
					}
				})
				// 更新数据
				this.save()
			}).catch((error) => {
				console.error(error)
			})
		},
		addGuide() {
			let self = this
			Object.assign(self.guide, defaultGuide)

			// AI上色
			let i = 0
			self.data.tabs.forEach((tab, index) => {
				if (tab.title === self.editableTabsValue) {
					i = tab.guides.length % self.predefineColors.length
				}
			})
			self.guide.color = self.predefineColors[i]

			self.guideAddOrEdit = true
			self.guideDialogVisible = true
		},
		editGuide(g) {
			this.guideAddOrEdit = false
			this.guideDialogVisible = true
			Object.assign(this.guide, g)
		},
		updateGuide() {
			let self = this

			if (self.guide.title === '') {
				this.$message({
					message: '导航名不允许为空!',
					type: 'error',
					duration: 1000
				})
				return
			}

			for (let i = 0; i < self.data.tabs.length; i++) {
				let tab = self.data.tabs[i]
				if (tab.title === self.editableTabsValue) {
					let guide = Object.assign({}, self.guide)
					guide.time = formatDate(new Date(), 'yyyy/MM/dd hh:mm')
					// 新增
					if (self.guideAddOrEdit) {
						// 检测是否已经存在
						if (tab.guides.find(g => g.title === guide.title)) {
							this.$message({
								message: '请勿重复输入导航名!',
								type: 'error',
								duration: 1000
							})
							return
						}

						tab.guides.push(guide)
					} else {
						// 更新
						tab.guides.forEach((g, index) => {
							if (g.title === guide.title) {
								Object.assign(tab.guides[index], guide)
							}
						})
					}
				}
			}

			// 更新数据
			this.save()

			// 隐藏对话框
			this.guideDialogVisible = false
		},
	}
	,
	async created() {
		// console.log('created')
		await this.load()
	}
}
</script>
<style scoped>
.container {
  max-width: 1200px;
  padding: 10px;
  margin: 0 auto;
}

.title {
  /*
    1、得是以配置为inline-block的元素，或默认以block呈现的div、p元素
    2、强制不换行
    3、固定宽度
    4、超出部分隐藏
    5、超出部分以'...'结尾
  */
  max-width: 100%;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #FFFFFF;
  text-align: center;
}

.content {
  height: calc(12em - 97px);
}

.summary {
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.bottom {
  position: absolute;
  width: calc(100% - 40px);
  bottom: 10px;
  line-height: 13px;
}

.time {
  font-size: 13px;
  color: #999;
}

.content-list {
  overflow: hidden;
  *zoom: 1;
  margin: 0;
  padding: 0;
}

.content-list .content-item {
  float: left;
  margin: 1em;
  position: relative;
}

.content-item {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 16.7em;
  overflow: hidden;
  /*height: 12em;*/
  /*background: #333;*/
  /*padding: 1em;*/
  /*text-align: center;*/
  /*border-radius: 5px;*/
}

.admin {
  font-size: 40%;
  color: #666;
  text-decoration: underline;
}

@media screen and (max-width: 600px) {
  .content-item {
    width: 90%;
  }

  .admin {
    display: none;
  }
}

</style>
