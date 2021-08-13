import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';

export default class Chat extends Component {

    render(){
        let { name, backgroundColor } = this.props.route.params;
        //or let name = this.props.route.params.name;
        console.log(this.props.route.params);
        
        this.props.navigation.setOptions({ title: name});
        return (
            <View style={[style.container, {backgroundColor: backgroundColor}]}>
                <Text>Welcome to the Chatroom { name }</Text>
            </View>
        )
    }
    
}

const style = StyleSheet.create({
    container: {
        flex: 1
    }
});