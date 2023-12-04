"use client";

import {
    useContext,
    createContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { usePathname, useRouter } from "next/navigation";

const HOME_ROUTE = "/";
const ACCOUNT_ROUTE = "/admin";

interface IAuthContext {
    user: User | null;
}

const AuthContext = createContext<IAuthContext>({
    user: null,
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userLoading, setUserLoading] = useState<boolean>(false);
    const router = useRouter();
    const pathName = usePathname();

    useEffect(() => {
        setUserLoading(true);
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setUserLoading(false);
            if (!currentUser) {
                // Redirect to login page
                router.push(HOME_ROUTE);
            } else if (pathName === HOME_ROUTE) {
                router.push(ACCOUNT_ROUTE);
            }
        });
        return () => unsubscribe();
    }, [user]);

    return (
        <AuthContext.Provider value={{ user }}>
            {userLoading ? <></> : children}
        </AuthContext.Provider>
    );
};

export const UserProvider = () => {
    return useContext(AuthContext);
};
