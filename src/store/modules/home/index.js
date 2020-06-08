import { homeActions } from "./actions";
import { homeState } from "./state";
import { homeMutations } from "./mutations";

export const home = {
    state: { ...homeState },
    mutations: { ...homeMutations },
    actions: { ...homeActions }
}