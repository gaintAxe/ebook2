import { state } from './modules/book/state'
import { homeState } from './modules/home/state'
function fn(key, moduleName) {
    return (state) => {
        return state[moduleName][key]
    }
}

let bookGetters = {}
for (let i in state) {
    bookGetters[i] = fn(i, 'book')
}
let homeGetters = {};

for (let i in homeState) {
    homeGetters[i] = fn(i, 'home')
}
export let getters = { ...bookGetters, ...homeGetters }