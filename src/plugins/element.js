import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Element.Dialog.props.closeOnClickModal.default = false; // 修改 el-dialog 默认点击遮照为不关闭
Vue.use(Element)

