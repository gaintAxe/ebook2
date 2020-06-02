import Vue from 'vue'
import VueI18N from 'vue-i18n'
Vue.use(VueI18N);


import en from './en'
import cn from './cn'

const messages={
  en,cn
}

//设置当前语言
// let locale = getLocale();
// if(!locale){
  let locale = 'cn';
  // saveLocale(locale)
// }
const i18n = new VueI18N({
  locale,
  messages
})

export default i18n;