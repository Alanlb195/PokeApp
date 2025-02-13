import { createContext } from "react";
import { useColorScheme } from "react-native";
import {
    NavigationContainer,
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
    ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import {
    adaptNavigationTheme,
    MD3DarkTheme,
    MD3LightTheme,
    Provider,
    ProviderProps,
} from "react-native-paper";



const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
    materialDark: MD3DarkTheme,
    materialLight: MD3LightTheme,
});


export const ThemeContext = createContext({
    isDark: false,
    theme: LightTheme
});


export function PaperProvider({ children, ...otherProps }: ProviderProps) {

    const colorScheme = useColorScheme();
    const isThemeDark = colorScheme === "dark";

    const paperTheme = isThemeDark
        ? {
            ...MD3DarkTheme,
            ...DarkTheme,
            colors: {
                ...MD3DarkTheme.colors,
                ...DarkTheme.colors,
            },
            fonts: {
                ...MD3DarkTheme.fonts,
                ...NavigationDarkTheme.fonts,
            },
        }
        : {
            ...MD3LightTheme,
            ...LightTheme,
            colors: {
                ...MD3LightTheme.colors,
                ...LightTheme.colors,
            },
            fonts: {
                ...MD3LightTheme.fonts,
                ...NavigationDefaultTheme.fonts,
            },
        };



    return (
        <Provider theme={paperTheme} {...otherProps}>
            <NavigationThemeProvider value={paperTheme}>
                <NavigationContainer theme={paperTheme}>
                    <ThemeContext.Provider
                        value={{
                            isDark: isThemeDark,
                            theme: paperTheme
                        }}>
                        {children}
                    </ThemeContext.Provider>
                </NavigationContainer>
            </NavigationThemeProvider>
        </Provider>
    );
}
