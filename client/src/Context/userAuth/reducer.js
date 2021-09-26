export const initialState = {
    userDetails: null,
    loading: false,
    errorMessage: null
}

export const userReducer = (initialState, action) => {
    switch (action.type) {
        case "REQUEST_LOGIN":
            return {
                ...initialState,
                loading: true
            };
        case "LOGIN_SUCCESS":
            return {
                ...initialState,
                userDetails: action.payload,
                loading: false,
                errorMessage: null
            };
        case "LOGOUT":
            return {
                ...initialState,
                userDetails: ""
            };
        case "LOGIN_ERROR":
            return {
                ...initialState,
                loading: false,
                errorMessage: action.error
            };
        case "LOGIN_UNSUCCESSFUL":
            return {
                ...initialState,
                loading: false,
                errorMessage: "Please Login"
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`)
    }
};