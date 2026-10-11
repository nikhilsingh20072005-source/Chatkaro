import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export const ThemeContext =
  createContext(null);

const ThemeContextProvider = ({
  children,
}) => {
  const [theme, setTheme] =
    useState(() => {
      const savedTheme =
        localStorage.getItem(
          "chatkaro_theme"
        );

      return (
        savedTheme || "light"
      );
    });

  const toggleTheme = useCallback(
    () => {
      setTheme((currentTheme) =>
        currentTheme === "dark"
          ? "light"
          : "dark"
      );
    },
    []
  );

  const changeTheme = useCallback(
    (newTheme) => {
      if (
        newTheme !== "light" &&
        newTheme !== "dark"
      ) {
        return;
      }

      setTheme(newTheme);
    },
    []
  );

  useEffect(() => {
    localStorage.setItem(
      "chatkaro_theme",
      theme
    );

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    document.body.classList.remove(
      "light-theme",
      "dark-theme"
    );

    document.body.classList.add(
      `${theme}-theme`
    );
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      isDarkMode:
        theme === "dark",
      toggleTheme,
      changeTheme,
    }),
    [
      theme,
      toggleTheme,
      changeTheme,
    ]
  );

  return (
    <ThemeContext.Provider
      value={value}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;