import { useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  name?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for user in cookie/localStorage
    const userId = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userId="))
      ?.split("=")[1];

    if (userId) {
      // In a real app, fetch user data from backend
      setUser({
        id: userId,
        email: "user@example.com",
        name: "User",
      });
    }

    setIsLoading(false);
  }, []);

  const login = (userId: string) => {
    document.cookie = `userId=${userId}; path=/; max-age=31536000`;
    setUser({
      id: userId,
      email: "user@example.com",
      name: "User",
    });
  };

  const logout = () => {
    document.cookie = "userId=; path=/; max-age=0";
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
