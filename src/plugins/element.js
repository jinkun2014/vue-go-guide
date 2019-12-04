import Vue from 'vue'
import {
  Button,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Timeline,
  TimelineItem,
  Card,
  Tabs,
  TabPane,
  Row,
  Col,
  MessageBox,
  Dialog,
  Form,
  FormItem,
  Input,
  Link,
  ColorPicker,
  Message
} from 'element-ui'

Vue.use(Button)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Timeline);
Vue.use(TimelineItem);
Vue.use(Card);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Row);
Vue.use(Col);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Link);
Vue.use(ColorPicker);

Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;
