import vue from 'vue';

import myPlugin from './myPlugin'
vue.use(myPlugin)

// 富文本编辑器插件
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
vue.use(VueQuillEditor)


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
vue.use(ElementUI)

