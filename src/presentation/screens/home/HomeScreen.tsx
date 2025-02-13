import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { FlatList, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getPokemons } from '../../../actions/pokemons';
import { Pokeball } from '../../components/ui/PokeballBg';
import { FAB, Text } from 'react-native-paper';
import { PokemonCard } from '../../components/pokemons/PokemonCard';
import { globalStyles } from '../../../config/theme/global-theme';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { IonIcon } from '../../components/ui/IonIcon';
import { RootStackParams } from '../../navigator/StackNavigator';
import { StackScreenProps } from '@react-navigation/stack';

interface Props extends StackScreenProps<RootStackParams, 'HomeScreen'> { }

export const HomeScreen = ( { navigation } : Props) => {

  const { top } = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { theme, isDark } = useContext(ThemeContext);

  //* Forma tradicional de una peticion http
  // const { isLoading, data: pokemons = [] } = useQuery({
  //   queryKey: ['pokemons'],
  //   queryFn: () => getPokemons(0),
  //   staleTime: 1000 * 60 * 60, // 60 minutes
  // })

  //* Forma scroll infinito
  const { isLoading, data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['pokemons', 'infinite'],
    initialPageParam: 0,
    staleTime: 1000 * 60 * 60, // 60 minutes

    // using cache
    queryFn: async params => {
      const pokemons = await getPokemons(params.pageParam);
      pokemons.forEach(pokemon => {
        queryClient.setQueryData(['pokemon', pokemon.id], pokemon);
      });
      return pokemons;
    },

    // queryFn: params => getPokemons(params.pageParam), // basic form
    getNextPageParam: (lastPage, pages) => pages.length,
  })

  return (

    <View style={globalStyles.globalMargin}>

      <Pokeball style={styles.imgPosition} />

      <FlatList
        data={data?.pages.flat() ?? []}
        keyExtractor={(pokemon, index) => `${pokemon.id}-${index}`}
        numColumns={2}
        style={{ paddingTop: top + 10 }}
        ListHeaderComponent={() => (
          <Text variant='displayMedium'>Pókedex</Text>
        )}
        renderItem={({ item }) => (
          <PokemonCard pokemon={item}></PokemonCard>
        )}
        onEndReachedThreshold={0.6}
        onEndReached={() => fetchNextPage()}
        showsVerticalScrollIndicator={false}
        initialNumToRender={20}
        maxToRenderPerBatch={10}
        windowSize={5}
      />

      <FAB
        style={{
          ...globalStyles.globalFab,
          backgroundColor: theme.colors.primary
        }}
        icon={() => <IonIcon name="search" color={ isDark ? 'black' : 'white' } /> }
        onPress={() =>  navigation.push('SearchScreen') }
      />

    </View>
  )
}

const styles = StyleSheet.create({
  imgPosition: {
    position: 'absolute',
    top: -100,
    right: -100
  }
})
