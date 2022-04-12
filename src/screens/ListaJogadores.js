import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native'
import { Text, withTheme, List, Avatar, FAB, ActivityIndicator } from 'react-native-paper'
import Header from '../components/Header'
import { BACKEND } from '../constants'
import ListaJogador from './ListaJogador'

function ListaJogadores({ navigation, theme }) {
    const { colors } = theme
    const [jogadores, setJogadores] = useState([])
    const [carregandoJogadores, setCarregandoJogadores] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        obterJogadores()
    }, [])

    async function obterJogadores() {
        setCarregandoJogadores(true)
        let url = `${BACKEND}/jogadores`
        await fetch(url)
            .then(response => response.json())
            .then(data => {
                setJogadores(data)
                //console.log(data)
            })
            .catch(function (error) {
                console.error('Erro ao obter as jogadores! ' + error.message)
            })
        setCarregandoJogadores(false)
    }

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true)
        try {
            await obterJogadores()
        } catch (error) {
            console.error(error)
        }
        setRefreshing(false)
    }, [refreshing])

    return (
        <>
            <Header titulo="Jogadores" voltar={true} navigation={navigation} />
            {carregandoJogadores && <ActivityIndicator animating={true} size="large" color={colors.primary} />}
            <View>
                <List.Subheader>
                    <Avatar.Icon size={24} icon="refresh" /> Para atualizar os dados
                </List.Subheader>
                
                {jogadores.length === 0 && !carregandoJogadores
                    ? (
                        <View>
                            <Text style={{ fontSize: 20 }}>Ainda não há nenhum jogador cadastrado</Text>
                        </View>
                    )
                    : (
                        <FlatList
                            data={jogadores}
                            renderItem={({ item }) => (
                                <ListaJogador data={item} navigation={navigation} />
                            )}
                            keyExtractor={item => item._id.toString()}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}
                            />}
                        />
                    )}
                <FAB
                    style={styles.fab}
                    icon='plus'
                    label=''
                    onPress={() => navigation.navigate('AdicionaJogador')}
                />

            </View>
        </>
    )
}

const styles = StyleSheet.create({
    fab:{
        position: 'absolute',
        margin: 16,
        right: 4,
        bottom: 8
    }
})

export default withTheme(ListaJogadores)