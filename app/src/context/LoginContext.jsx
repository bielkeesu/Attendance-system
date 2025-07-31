import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initialState = {
    user : null,
    isAuthenticated: false,
}

function reducer(state, action){
    switch(action.type){
        case "login":
            return {...state, user:action.payload, isAuthenticated: true};
        default:
            throw new Error("Unknown action.");
    }
}

function LoginContext({children}) {

    const [{user, isAuthenticated}, dispatch] = useReducer(reducer, initialState);

    function login(email, password){
        if(email)
            dispatch({type: "login", payload: ""})
    }

    return <AuthContext.Provider value={{user, isAuthenticated, login}}>
        {children}
    </AuthContext.Provider>
}

function useAuth(){
    const context = useContext(AuthContext);
    if(context === undefined) throw new Error ("AuthContext was used outside the AuthProvider.")
        return context;
}

export  {LoginContext, useAuth}
