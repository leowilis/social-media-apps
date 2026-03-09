"use client";

import { useEffect } from "react";
import { store } from "@/lib/store";
import { Provider, useDispatch } from "react-redux";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { setToken, setIsLoggedIn } from "@/store/authSlice";

const queryClient = new QueryClient();

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setToken(token));
      dispatch(setIsLoggedIn(true));
    }
  }, [dispatch]);

  return <>{children}</>;
}

export default function ProviderContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>{children}</AuthInitializer>
      </QueryClientProvider>
    </Provider>
  );
}