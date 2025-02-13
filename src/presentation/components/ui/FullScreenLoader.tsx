import { useContext } from 'react'
import { View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { ThemeContext } from '../../context/ThemeContext'

export const FullScreenLoader = () => {

    const { theme } = useContext( ThemeContext );

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.background
        }}>
            <ActivityIndicator
                color={ theme.colors.primary }
                size={50}
            />
        </View>
    )
}
