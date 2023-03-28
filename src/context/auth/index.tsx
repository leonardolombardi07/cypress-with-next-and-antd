"use client";

import * as Firebase from "@/services/firebase";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import React from "react";

interface ContextValue {
  state: {
    user: User | null;
    error: string | null;
  };
}

const context = React.createContext<ContextValue | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<ContextValue["state"]["user"]>(null);
  const [error, setError] =
    React.useState<ContextValue["state"]["error"]>(null);

  const router = useRouter();

  React.useEffect(
    function onMount() {
      const unsubscribe = Firebase.onAuthStateChanged({
        next: (user) => {
          setUser(user);
          console.log(user);
          if (!user) {
            router.push("/signin");
          } else {
            router.push("/");
          }
        },
        error: (error) => {
          setError(error.message);
        },
        complete: () => {},
      });

      return function onUnmount() {
        if (typeof unsubscribe === "function") unsubscribe();
      };
    },
    [router]
  );

  const value: ContextValue = React.useMemo(() => {
    return {
      state: { user, error },
    };
  }, [user, error]);

  return <context.Provider value={value}>{children}</context.Provider>;
}

function useAuth() {
  const authContext = React.useContext(context);
  if (!authContext) {
    throw new Error(
      `${useAuth.name} must be used within an ${AuthProvider.name}`
    );
  }
  return authContext;
}

export { useAuth };

export default AuthProvider;
