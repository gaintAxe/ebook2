export const homeActions = {
    setHotSearchOffsetY({ commit }, offsetY) {
        return commit('SET_HOT_SEARCH_OFFSETY', offsetY)
    },
    setFlapCardVisible({ commit }, flapCardVisible) {
        return commit('SET_FLAPCARD_VISIBLE', flapCardVisible)
    },
    setShelfList({ commit }, list) {
        return commit('SET_SHELF_LIST', list)
    },
    setShelfSelected({ commit }, selected) {
        return commit('SET_SHELF_SELECTED', selected)
    },
    setShelfTitleVisible({ commit }, visible) {
        return commit('SET_SHELF_TITLE_VISIBLE', visible)
    },
    //是否进入编辑模式
    setIsEditMode({ commit }, isEditMode) {
        return commit('SET_IS_EDIT_MODE', isEditMode)
    },
    setShelfCategory({ commit }, category) {
        return commit('SET_SHELF_CATEGORY', category)
    },
    setCurrentType({ commit }, type) {
        return commit('SET_CURRENT_TYPE', type)
    }
}