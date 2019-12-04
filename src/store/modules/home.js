const state = {
  editable: false
}

const mutations = {
  SET_EDITABLE: (state, editable) => {
    state.editable = editable
  }
}

const actions = {
  setEditable({commit}, editable) {
    commit('SET_EDITABLE', editable)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
