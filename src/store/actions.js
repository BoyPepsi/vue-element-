import {
    RECEIVE_MENU_LIST
  } from './types'

const actions = {
    setMenu ({commit},menuList) {
        commit('RECEIVE_MENU_LIST',menuList)
    }
};

export default actions;