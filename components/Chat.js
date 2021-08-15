import React from 'react';
import { Platform, KeyboardAvoidingView, StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

export default class Chat extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            messages : []
        }
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }

    componentDidMount(){
        let name = this.props.route.params.name;
        let displayName = name.split(' ').map(this.capitalize).join(' ');

        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hello ' + displayName,
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any'
                    }
                },
                {
                    _id: 2,
                    text: displayName + ' has entered the chat ',
                    createdAt: new Date(),
                    system: true
                }
            ]
        })
    }

    onSend(messages = []){
        this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, messages)
        }));
    }

    renderBubble(props){
        return (
            <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: '#FDF4E3'
                }
            }}
            timeTextStyle={{
                right: {
                  color: '#999999',
                },
            }}
            textStyle={{
                right: {
                    color: '#000000',
                }
            }}
            />
        )
    }

    render(){
        let { name, backgroundColor } = this.props.route.params;
        let displayName = name.split(' ').map(this.capitalize).join(' ');
        //or let name = this.props.route.params.name;
        //console.log(this.props.route.params);
        
        this.props.navigation.setOptions({ title: displayName});
        return (
            <View style={[style.container, {backgroundColor: backgroundColor}]} >
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={(messages) => this.onSend(messages)}
                    user={{
                        _id: 1
                    }}
                />
                { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
            </View>
        )
    }
    
}

const style = StyleSheet.create({
    container: {
        flex: 1
    }
});