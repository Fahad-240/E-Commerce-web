export const reducer = (state, action) => {
    switch (action.type) {
        case "USER_LOGIN": {
            return { ...state, isLogin: true, user: action.user }
        }
        case "USER_LOGOUT": {
            return { ...state, isLogin: false, user: {}, cartCount: 0 }
        }
        case "SET_CART_COUNT": {
            return { ...state, cartCount: action.payload }
        }
        default: {
            return state
        }
    }
}