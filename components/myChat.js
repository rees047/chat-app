import React from 'react';
import { Platform, KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import firebase from "firebase";
import "firebase/firestore"; 

const firebaseConfig = {
    apiKey: "AIzaSyCZdwccg52188RwpfQ33os152z0_Cw0Wwg",
    authDomain: "chat-app-661f6.firebaseapp.com",
    projectId: "chat-app-661f6",
    storageBucket: "chat-app-661f6.appspot.com",
    messagingSenderId: "1080192921551",
    appId: "1:1080192921551:web:bf672e0f65e98f54e1acba",
    measurementId: "G-G38MQ2K56V"
};

export default class Chat extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            messages : [],
            uid: 0,
            user: '',
            displayName: ''
        }

        if (!firebase.apps.length){
            firebase.initializeApp(firebaseConfig);
        }

        this.referenceChatMessages = null;
    }

    capitalize(str) {
        str = str.split(' ').map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1)
        }).join(' ');
        return str;
    }

    componentDidMount(){
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: this.capitalize(name)});

        this.referenceChatMessages = firebase.firestore().collection('messages');
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) {
             await firebase.auth().signInAnonymously();
            }
          
            //update user state with currently active user data
            this.setState({
                uid: user.uid,
                messages: []
            });

           //create a reference to the active user's documents (messages)
           this.referenceChatMessages = firebase.firestore().collection('messages');
           // listen for collection changes for current user
           this.unsubscribe = this.referenceChatMessages.orderBy("createdAt", "desc").onSnapshot(this.onCollectionUpdate);
        });     
    }

    componentWillUnmount(){
        //stop listening to authentication
        this.authUnsubscribe();    
        //stop listenting for changes
        this.unsubscribe();
    }   
    
    addMessage(messages){
        let msg = messages[0]
        // add a new messages to the collection
        this.referenceChatMessages.add({
            uid: this.state.uid,
            _id: msg._id,
            text: msg.text,
            createdAt: msg.createdAt,
            user: msg.user
        });
    }

    onSend(messages = []){
        //append the new message to the chat screen
        this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, messages)
        }));

        //the newest messsage written by the user is the first index of array
        this.addMessage(this.state.messages);
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        //go through each documents
        querySnapshot.forEach((doc) => {
          //get the QueryDocumentSnapshot's data
          let data = doc.data();
          messages.push({
            _id: data._id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: data.user
          });
        });
        this.setState({
            messages
        });
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
        //or let name = this.props.route.params.name;
        //console.log(this.props.route.params);
        return (
            <View style={[style.container, {backgroundColor: backgroundColor}]} >
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={(messages) => this.onSend(messages)}
                    user={{
                        /* Authenticated ID of the signed user. */
                        _id: this.state.uid,
                        /* Name of the user typed in the Start component. */
                        name: this.capitalize(name),
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