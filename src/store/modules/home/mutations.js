export const homeMutations = {
    SET_HOT_SEARCH_OFFSETY(state, offsetY) {
        state.hotSearchOffsetY = offsetY
    },
    SET_FLAPCARD_VISIBLE(state, flapCardVisible) {
        state.flapCardVisible = flapCardVisible
    }, SET_SHELF_LIST(state, list) {
        state.shelfList = list
    },
    SET_SHELF_SELECTED(state, selected) {
        state.shelfSelected = selected
    },
    SET_SHELF_TITLE_VISIBLE(state, visible) {
        state.shelfTitleVisible = visible
    },
    SET_IS_EDIT_MODE(state, isEditMode) {
        state.isEditMode = isEditMode
    }, SET_SHELF_CATEGORY(state, category) {
        state.shelfCategory = category
    },
    SET_CURRENT_TYPE(state, type) {
        state.currentType = type
    }
};