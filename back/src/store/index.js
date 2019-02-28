import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import common from './common'

export default new Vuex.Store({
    modules : {
        common
    }
})