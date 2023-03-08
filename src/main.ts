/**
 *
 * Main Script
 *
 * Coded by Dongyuck Son
 *
 * =========================================================
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

// Load vue core
import router from './router'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Plugins
import { registerPlugins } from './plugins'
import vuetify from './plugins/vuetify'

// Load Layout vue.
import App from './App.vue'

// mansonry layout plugin.
import { VueMasonryPlugin } from 'vue-masonry'
const app = createApp(App)
registerPlugins(app)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(VueMasonryPlugin)
app.mount('#app')
