import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { BACKEND } from '../constants'

import { List, withTheme, Avatar } from 'react-native-paper';

function ListaJogador({ data, navigation, theme }) {
  const { colors } = theme

  async function confirmaExclusaoRegistro() {
    try {
      Alert.alert('Atenção!', 'Deseja mesmo excluir esta jogador?', [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          onPress: async () => {
            await excluirJogador(data)
          },
        },
      ])
    } catch (response) {
      Alert.alert(response.data.error)
    }
  }

  async function excluirJogador(data) {
    let url = `${BACKEND}/jogadors/${data._id}`
    await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(data => {
        Alert.alert('Aviso', data.message)
        navigation.goBack()
      })
      .catch(function (error) {
        console.error('Houve um problema ao excluir a jogador: ' + error.message);
      })
  }

  const alteraJogador = async (data) => {
    navigation.navigate('AlteraJogador',{ jogador: data })
  }

  function botaoLadoDireito() {
    return (
      <View>
        <TouchableOpacity
          style={styles.buttonDesativar}
          onPress={confirmaExclusaoRegistro}
        >
          <Avatar.Icon size={24} icon="delete"  style={{backgroundColor: colors.background}}/>
          <Text style={{color: colors.background}} >Excluir</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <Swipeable renderRightActions={botaoLadoDireito}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => alteraJogador(data)}
      >

        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.background, borderRadius: 20 }}>
          <List.Item
            title={data.nome}
            description={`status: ${data.status}`}
            descriptionStyle={[styles.descricao]}
            left={props => <List.Icon {...props} icon={"image"} />}
          />
  
        </View>
      </TouchableOpacity>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    height: 100,
    borderRadius: 8,
    marginBottom: 2,
    marginHorizontal: 8,
  },
  buttonDesativar: {
    backgroundColor: '#d9534f',
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderTopEndRadius: 20,
    borderBottomEndRadius: 20,
  },
  descricao: {
    paddingBottom: 36
  }
})

export default withTheme(ListaJogador)