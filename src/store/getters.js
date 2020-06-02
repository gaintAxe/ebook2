import { state } from './modules/book/state'

function fn(key, moduleName) {
    return (state) => {
        return state[moduleName][key]
    }
}

let obj = {}
for (let i in state) {
    obj[i] = fn(i, 'book')
}

export let getters = { ...obj }