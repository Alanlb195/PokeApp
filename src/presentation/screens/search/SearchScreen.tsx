import { FlatList, View } from 'react-native'
import { ActivityIndicator, Text, TextInput } from 'react-native-paper'
import { globalStyles } from '../../../config/theme/global-theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PokemonCard } from '../../components/pokemons/PokemonCard'
import { useQuery } from '@tanstack/react-query'
import { getPokemonNamesWithId } from '../../../actions/pokemons'
import { useMemo, useState } from 'react'
import { FullScreenLoader } from '../../components/ui/FullScreenLoader'
import { getPokemonsByIds } from '../../../actions/pokemons/getPokemonsByIds'
import { useDebounceValue } from '../../hooks/useDebounceValue'

export const SearchScreen = () => {

  const { top } = useSafeAreaInsets();
  const [term, setTerm] = useState('')
  const { debouncedValue } = useDebounceValue( term );

  const { data: pokemonNameList = [], isLoading } = useQuery({
    queryKey: ['pokemons', 'all'],
    queryFn: () => getPokemonNamesWithId()
  })

  // Todo: aplicar debouncer
  const pokemonNameIdList = useMemo(() => {

    if (!isNaN(Number(debouncedValue))) {
      const pokemon = pokemonNameList.find(
        pokemon => pokemon.id === Number(debouncedValue),
      );
      return pokemon ? [pokemon] : [];
    }

    if (debouncedValue.length === 0) return [];
    if (debouncedValue.length < 3) return [];

    return pokemonNameList.filter(pokemon =>
      pokemon.name.includes(debouncedValue.toLocaleLowerCase())
    );

  }, [debouncedValue])

  const { isLoading: isLoadingPokemons, data: pokemons } = useQuery({
    queryKey: ['pokemons', 'by', pokemonNameIdList],
    queryFn: () => getPokemonsByIds(pokemonNameIdList.map(pokemon => pokemon.id)),
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  if (isLoading) {
    return <FullScreenLoader />
  }


  return (
    <View style={{
      ...globalStyles.globalMargin,
      marginTop: top + 10
    }}>

      <TextInput
        placeholder='Buscar pokemon'
        mode='flat'
        autoFocus
        autoCorrect={false}
        onChangeText={setTerm}
        value={term}
      />
      
      {
        isLoadingPokemons ? (
          <ActivityIndicator style={{ paddingTop: 5 }} />
        )
        :
        // <Text>{JSON.stringify(pokemonNameIdList, null, 2)}</Text>

        
        <FlatList
        style={{ paddingTop: 20 }}
          data={pokemons}
          keyExtractor={(pokemon, index) => `${pokemon.id}-${index}`}
          numColumns={2}
          renderItem={({ item }) => (
            <PokemonCard pokemon={item} />
          )}
          onEndReachedThreshold={0.6}
          showsVerticalScrollIndicator={false}
          initialNumToRender={20}
          maxToRenderPerBatch={10}
          windowSize={5}
          ListFooterComponent={ () => <View style={{ height: 120 }} /> }
        />
      }

    </View>
  )
}
