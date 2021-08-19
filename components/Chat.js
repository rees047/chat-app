import React from 'react';
import { Platform, KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
//cloud database storage
import firebase from 'firebase';
import 'firebase/firestore';
//local browser/mobile storage
import AsyncStorage from '@react-native-async-storage/async-storage';
//app to idenity user offline or online
import NetInfo from '@react-native-community/netinfo';
//mapview component
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

const firebaseConfig = {
    apiKey: "AIzaSyCZdwccg52188RwpfQ33os152z0_Cw0Wwg",
    authDomain: "chat-app-661f6.firebaseapp.com",
    projectId: "chat-app-661f6",
    storageBucket: "chat-app-661f6.appspot.com",
    messagingSenderId: "1080192921551",
    appId: "1:1080192921551:web:bf672e0f65e98f54e1acba",
};

export default class Chat extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            messages : [],
            uid: 0,
            user: '',
            isConnected: '',
            image:  null,
            location: null
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
        const name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: this.capitalize(name)});

        //check if user is offline or online
        NetInfo.fetch().then(connection => {
            if(connection.isConnected){
                this.setState({isConnected: true});
                console.log('online');

                //listen to authentication events
                //this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
                this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
                    if (!user) {
                        //await firebase.auth().signInAnonymously();
                        firebase.auth().signInAnonymously();
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
            }else{
                this.setState({isConnected: false});
                console.log('offline');
                this.getMessages();
            }
        });
        //firebase.firestore.setLogLevel('debug') //firebase debugging purposes
    }

    componentWillUnmount(){
        if (this.state.isConnected == false) {
        } else {
            //stop listening to authentication
            this.authUnsubscribe();    
            //stop listenting for changes
            this.unsubscribe();
        }        
    }

    async getMessages(){
        let messages = '';
        try{
            messages = await AsyncStorage.getItem('messages') || [];
            this.setState({
                messages: JSON.parse(messages)
            });
        }catch (error){
            console.log(error.message);
        }
    }

    async saveMessages(){
        try{
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        }catch(error){
            console.log(error.message);
        }
    }

    async deleteMessages(){
        try{
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            });
        }catch(error){
            console.log(error.message);
        }
    }
    
    addMessage(msg){
        // add a new messages to the collection
        // data from Gifted Chat
        this.referenceChatMessages.add({
            _id: msg._id,
            text: msg.text || null,
            createdAt: msg.createdAt,
            user: msg.user,
            image: msg.image || null,
            location: msg.location || null
        });
    }

    onSend(messages = []){
        //append the new message to the chat screen
        this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, messages)
        }), () => { //callback functions to do after setting the state of messages
            this.addMessage(messages[0]); //the newest messsage written by the user is the first index of array
            this.saveMessages(); //save the messages locally
        });
        
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
            user: data.user,
            image: data.image || null,
            location: data.location || null
          });
        });

        this.setState({
            messages
        });
    }

    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return(
                <InputToolbar
                {...props}
                />
            )
        }
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

    renderCustomActions = (props) => {
        return <CustomActions {...props} />
    }

    renderCustomView(props){
        const { currentMessage } = props;
        if(currentMessage.location){
            return(
                <MapView
                style={{
                    width: 150,
                    height: 100,
                    borderRadius: 13,
                    margin: 3}}
                region={{
                    latitude: currentMessage.location.latitude,
                    longitude: currentMessage.location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
              />
            );
        }
        return null;
    }

    render(){
        let { name, backgroundColor } = this.props.route.params;
        //or let name = this.props.route.params.name;
        return (
            <View style={[style.container, {backgroundColor: backgroundColor}]} >
                <GiftedChat
                    renderActions={this.renderCustomActions}
                    renderCustomView={this.renderCustomView}
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={(messages) => this.onSend(messages)}
                    user={{
                        _id: this.state.uid,  //Authenticated ID of the signed user.
                        name: this.capitalize(name) // Name of the user typed in the Start component.
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