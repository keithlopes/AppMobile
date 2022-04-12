import React, {useContext} from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { AppContext } from '../themes/ThemeProvider'

const Stack = createStackNavigator()

import Inicio from '../screens/Inicio'
import Configuracoes from '../screens/Configuracoes'
import ListaJogadores from '../screens/ListaJogadores'
import AdicionaJogador from '../screens/AdicionaJogador'
import AlteraJogador from '../screens/AlteraJogador'


export default function Navigation(){
    const { tema } = useContext(AppContext)
    return(
        <NavigationContainer theme={tema}>
            <Stack.Navigator initialRouteName="Inicio" screenOptions={{headerShown: false}}>
                <Stack.Screen name="Inicio" component={Inicio} />
                <Stack.Screen name="Configuracoes" component={Configuracoes} /> 
                <Stack.Screen name="ListaJogadores" component={ListaJogadores}  />
                <Stack.Screen name="AdicionaJogador" component={AdicionaJogador}  /> 
                <Stack.Screen name="AlteraJogador" component={AlteraJogador}  />      
            </Stack.Navigator>
        </NavigationContainer>
    )
}