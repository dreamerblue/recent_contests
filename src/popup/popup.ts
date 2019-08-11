import Vue from 'vue';
import Popup from './Popup.vue';
import { Button, Table, Tag, Icon, message } from 'ant-design-vue';

Vue.config.productionTip = false;

Vue.use(Button);
Vue.use(Table);
Vue.use(Tag);
Vue.use(Icon);

Vue.prototype.$message = message;

new Vue({
  render: (h) => h(Popup),
}).$mount('#app');
