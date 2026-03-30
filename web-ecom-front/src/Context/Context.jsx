import React, { createContext, useReducer } from "react";
import { reducer } from "./Reducer";

export const GlobalContext = createContext("Intial Value");

let data = {
    user: {},
    isLogin: false,
    cartCount: 0,
    baseUrl: import.meta.env.VITE_API_URL?.trim() || "http://localhost:5004/api/v1"
}

export default function ContextProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, data)
    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    )
}
