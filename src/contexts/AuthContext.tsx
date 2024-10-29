import { ReactNode, useState, useEffect, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseConnection";

interface AuthProviderProps{
    children: ReactNode;
}

type AuthContextData = {
    signed: boolean;
    loadingAuth: boolean;
    user: UserProps | null;
    updateInfoUser: ({ name, email, uid }: UserProps) => void
}

interface UserProps{
    uid: string;
    name: string | null;
    email: string | null;
}

export const AuthContext = createContext({} as AuthContextData)

function AuthProvider({ children }: AuthProviderProps){
    const [user, setUser] = useState<UserProps | null>(null)
    const [loadingAuth, setLoadingAuth] = useState(true)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user){
                setUser({
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email
                })

                setLoadingAuth(false)

            } else{
                setUser(null)
                setLoadingAuth(false)
            }
        })

        return () => {
            unsub()
        }
    }, [])

    function updateInfoUser({name, email, uid}: UserProps){
        setUser({
            name,
            email,
            uid
        })
    }

    return(
        <AuthContext.Provider value={{ signed: !!user, loadingAuth, user, updateInfoUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;