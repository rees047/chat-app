import React from 'react';
import { ImageBackground, Image, StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

const imageBG = require('../assets/BackgroundImage.png');
const userIcon = require('../assets/icon.svg');
const bgColors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];

export default class Start extends React.Component {

    constructor() {
        super();
        this.state = {
            text: '',
            choosenBG: '#090C08'
        }
    }

    setBGColor = (bgColor) => {
       this.setState({'choosenBG' : bgColor});
    }

    handleChat = (currentState) =>{
        if(currentState.text == ''){
            return Alert.alert('Please enter name');
        }else{
            this.props.navigation.navigate('ChatScreen', {
                name: currentState.text,
                backgroundColor: currentState.choosenBG,
            });
        }
    }

    render(){
        let {choosenBG, text} = this.state;
        return (
            <ImageBackground source={imageBG} style={style.ImageBackground}>
                <View style={style.appCommonWrapper}>
                    <Text style={style.appTitle}>Avian App</Text>
                </View>
                <View style={[style.appCommonWrapper, style.whiteBox]}>
                    <View style={[style.width88, style.yourNameWrapper]}>
                        <Image source={userIcon} style={style.userIcon} />
                        <TextInput
                            style={[style.commonText, style.yourName]}
                            onChangeText={(text) => this.setState({text})}
                            value={this.state.text}
                            placeholder='Your Name' />                   
                    </View>
                    <View style={style.width88}>
                        <Text style={[style.commonText, style.chooseText]}>Choose Background Color</Text>
                        <View style={style.bgColorOptionsWrapper}>
                            {
                                bgColors.map((bgColor) => (
                                    <TouchableOpacity
                                        key={bgColor}
                                        onPress={() => this.setBGColor(bgColor)}
                                        style={[
                                            style.bgColorOptions,
                                            choosenBG === bgColor ? style.border : null,
                                            { backgroundColor: bgColor }
                                        ]}
                                    >
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                        
                    </View>                    
                    <View style={[style.width88, style.ButtonWrapper]}>
                        <TouchableOpacity
                            style={style.Button}
                            onPress={() => { this.handleChat(this.state) }}
                            title="Start Chatting">
                                <Text style={style.ButtonText}>Start Chatting</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>  
        )
    }
    
}

const style = StyleSheet.create({
    ImageBackground : {
        flex : 1,
        resizeMode: 'cover',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        letterSpacing: 2
    },
    width88 : {
        width: '88%'
    },
    appCommonWrapper : {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '88%'        
    },
    appTitle : {
        fontSize: 45,
        fontWeight: '600',
        color: '#ffffff',
    },
    whiteBox : {
        backgroundColor: '#ffffff',
        marginBottom: '5%'
    },
    yourNameWrapper : {
        borderColor: '#757083',
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    userIcon : {
        resizeMode: 'contain',
        height: 25,
        width : '5%'
    },
    yourName : {
        opacity: 0.5,
        width: '100%',
        height: 40
    },
    commonText : {
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
    },
    chooseText:{
        paddingBottom: 25
    },
    bgColorOptionsWrapper : {
       display: 'flex',
       justifyContent: 'space-evenly',
       alignItems: 'center',
       flexDirection: 'row'
    },
    bgColorOptions:{
        width: 100,
        height: 100,
        padding: 10,
        borderRadius: 100,
    },
    border:{
        borderWidth: 2,
        borderColor: '#757083',
    },
    ButtonWrapper : {
        backgroundColor: '#757083',
        alignItems: 'center'
    }, 
    Button : {
        width: '88%',
        textAlign: 'center',
        height: 40,
        paddingTop: 8
    },
    ButtonText : {
        fontSize: 16,
        fontWeight: 600,
        color: '#ffffff',
    }

    
});