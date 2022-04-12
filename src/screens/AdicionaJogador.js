import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { withTheme, Caption, TextInput, FAB, HelperText, Checkbox, Snackbar } from 'react-native-paper'
import Header from '../components/Header'
import { BACKEND } from '../constants'

function AdicionaJogador({ navigation, theme }) {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [jogo, setJogo] = useState('')
    const [telefone, setTelefone] = useState('')
    const [telSecundario, settelSecundario] = useState('')    
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

   async function salvaJogador() {
       const novosErros = validaErrosJogador()
       //Existe algum erro no objet?
       if (Object.keys(novosErros).length > 0) {
           //Sim, temos erros
           setErros(novosErros)
       } else {
           //Iremos salvar os dados..
           setErros({})
           let jogador = {nome: nome, email: email, jogo: jogo,
                            telefone: telefone, telSecundario: telSecundario}
           setSalvandoJogador(true)
           let url = `${BACKEND}/jogadores`
           await fetch(url, {
               mode: 'cors',
               method: 'POST',
               headers: {
                   Accept: 'application/json',
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify(jogador)
           }).then(response => response.json())
           .then(data => {
               (data.message || data._id) ? setAviso('Jogador incluído com sucesso!') : setAviso('')
               setNome('')
               setEmail('')
               setJogo('')
               setTelefone('')
               settelSecundario('')
           })
           .catch(function (error) {
               setAviso('Não foi possível salvar a jogador '+error.message)
           })
       }
       setSalvandoJogador(false)
   }

    return (
        <View style={{flex:1, paddingVertical: 0, paddingHorizontal:0}}>
        <Header titulo="Cadastro de Jogadores"
        voltar={true} navigation={navigation} />
        <View style={{ flex: 1, backgroundColor: colors.surface, paddingHorizontal: 16,
        paddingVertical: 4 }}>  
            <Caption style={styles.titulo}>Inclusão das Jogadores</Caption>
            <TextInput
                label="Nome do Jogador"
                mode="outlined"
                name="nome"
                value={nome}
                onChangeText={setNome}
                error={!!erros.nome}
            />
            <HelperText type="error" visible={!!erros.nome}>
                {erros.nome}
            </HelperText>

            <TextInput
                label="Email do Jogador"
                mode="outlined"
                name="email"
                value={email}
                onChangeText={setEmail}
                error={!!erros.email}
            />
            <HelperText type="error" visible={!!erros.email}>
                {erros.email}
            </HelperText>

            <TextInput
                label="Jogo preferido"
                mode="outlined"
                name="jogo"
                value={jogo}
                onChangeText={setJogo}
                error={!!erros.jogo}
            />
            <HelperText type="error" visible={!!erros.jogo}>
                {erros.jogo}
            </HelperText>

            <TextInput
                label="Telefone do Jogador"
                mode="outlined"
                name="telefone"
                value={telefone}
                onChangeText={setTelefone}
                error={!!erros.telefone}
            />
            <HelperText type="error" visible={!!erros.telefone}>
                {erros.telefone}
            </HelperText>

            <TextInput
                label="Outro Telefone do Jogador"
                mode="outlined"
                name="telSecundario"
                value={telSecundario}
                onChangeText={settelSecundario}
                error={!!erros.telSecundario}
            />
            <HelperText type="error" visible={!!erros.telSecundario}>
                {erros.telSecundario}
            </HelperText>
            
        </View>
        <FAB style={styles.fab}
             icon='content-save'
             loading={salvandoJogador}
             disabled={erros.length>0}
             onPress={() => salvaJogador()}
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

export default withTheme(AdicionaJogador)