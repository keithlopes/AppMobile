import React, { useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { withTheme, Caption, TextInput, FAB, HelperText, Checkbox, Snackbar } from 'react-native-paper'
import Header from '../components/Header'
import { BACKEND } from '../constants'

function AlteraJogador({ navigation, theme, route }) {
    //Obtendo os dados passados via parâmetro
    const jogadorAlterada = route.params.jogador
     //Atribuindo os valores nos campos a partir do valor passado
    const [id, setId] = useState(jogadorAlterada._id)
    const [nome, setNome] = useState(jogadorAlterada.nome)
    const [status, setStatus] = useState((jogadorAlterada.status === 'ativo') ? true : false)
    const [erros, setErros] = useState({})
    const [aviso, setAviso] = useState('')
    const [salvandoJogador, setSalvandoJogador] = useState(false)

    const { colors } = theme

   const validaErrosJogador = () => {
       const novosErros = {}
       //Validação do nome
       if (!nome || nome ==='') novosErros.nome = 'O nome não pode ser vazio!'
       else if (nome.length > 30) novosErros.nome = 'O nome informado é muito longo!'
       else if (nome.length < 3) novosErros.nome = 'O nome informado é muito curto!'
       
       return novosErros
   }

   async function salvaJogadorAlterada() {
       const novosErros = validaErrosJogador()
       //Existe algum erro no objet?
       if (Object.keys(novosErros).length > 0) {
           //Sim, temos erros
           setErros(novosErros)
       } else {
           //Iremos salvar os dados alterados...
           setErros({})
           let statusJogador = (status === true || status === 'ativo') ? 'ativo' : 'inativo'
           let jogador = {_id: id, nome: nome, status: statusJogador}
           setSalvandoJogador(true)
           let url = `${BACKEND}/jogadors`
           await fetch(url, {
               mode: 'cors',
               method: 'PUT',
               headers: {
                   Accept: 'application/json',
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify(jogador)
           }).then(response => response.json())
           .then(data => {
               (data.message || data._id) ? setAviso('Jogador alterada com sucesso!') : setAviso('')
               setNome('')
               setStatus(true)
           })
           .catch(function (error) {
               setAviso('Não foi possível salvar a jogador alterada '+error.message)
           })
       }
       setSalvandoJogador(false)
   }

    return (
        <View style={{flex:1, paddingVertical: 0}}>
        <Header titulo="Cadastro de Jogadores"
        voltar={true} navigation={navigation} />
        <View style={{ flex: 1, backgroundColor: colors.surface, paddingHorizontal: 16,
        paddingVertical: 4 }}>  
            <Caption style={styles.titulo}>Alteração das Jogadores</Caption>
            <TextInput
                label="Nome da Jogador"
                mode="outlined"
                name="nome"
                value={nome}
                onChangeText={setNome}
                error={!!erros.nome}
            />
            <HelperText type="error" visible={!!erros.nome}>
                {erros.nome}
            </HelperText>
            <View style={styles.checkbox}>
                <Checkbox
                    status={status ? 'checked' : 'unchecked'}
                    onPress={() => setStatus(!status)}
                />
                <Text style={{ color: colors.text, marginTop: 8 }}>Ativa?</Text>
            </View>
        </View>
        <FAB style={styles.fab}
             icon='content-save'
             loading={salvandoJogador}
             disabled={erros.length>0}
             onPress={() => salvaJogadorAlterada()}
             />
        <Snackbar
            visible={aviso.length > 0}
            onDismiss={()=> setAviso('')}
            action={{
                label: 'Voltar',
                onPress: () => navigation.goBack()
            }}>
                <Text>{aviso}</Text>
            </Snackbar>
        </View>
    )
}

const styles  = StyleSheet.create({
    checkbox: {
        flexDirection: 'row'
    },
    fab:{
        position: 'absolute',
        margin: 16,
        right: 4,
        bottom: 8
    },
    titulo: {
        fontSize: 20,
        marginBottom: 16,
        marginTop: 16

    }
})

export default withTheme(AlteraJogador)