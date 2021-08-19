import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableOpacity, Text, Button, Image } from 'react-native';
//cloud database storage
import firebase from 'firebase';
import 'firebase/firestore';
//import * as Permissions from 'expo-permissions'; //deprecated -- will be removed from future release
import * as Camera from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
//import * as MediaLibrary from 'expo-media-library';

export default class CustomActions extends React.Component {

    onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        console.log('user wants to pick an image');
                        return this.pickImage();
                    case 1:
                        console.log('user wants to take a photo');
                        return this.takePhoto();
                    case 2:
                        console.log('user wants get their user location');
                        return this.getLocation();
                        default:
                }
            }
            
        );
    }

    pickImage = async() => {
        //const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const { status } = await Camera.requestPermissionsAsync();

        try{
            if(status === 'granted'){
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images, // only images are allowed
                }).catch(error => console.log(error));

                if(!result.cancelled){
                    const imageUrl = await this.uploadImageFetch(result.uri);
                    this.props.onSend({ image: imageUrl });
                }
            }
        } catch(error){
            console.log(error.message);
        }
    }

    takePhoto = async() => {
        //const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
        const { status } = await Camera.requestPermissionsAsync();

        try{
            if(status === 'granted'){
                let result = await ImagePicker.launchCameraAsync().catch(error => console.log(error));

                if(!result.cancelled){
                    const imageUrl = await this.uploadImageFetch(result.uri);
                    this.props.onSend({ image: imageUrl });
                }
            }
        } catch(error){
            console.log(error.message);
        }
    }

    getLocation = async() => {
        //const { status }  = await Permissions.askAsync(Permissions.LOCATION);
        const { status }  = await Location.requestForegroundPermissionsAsync();

        try{
            if(status === 'granted'){
                let result = await Location.getCurrentPositionAsync({}).catch(error => console.log(error));

                if(result){
                    this.props.onSend({
                        location: {
                            longitude: result.coords.longitude,
                            latitude: result.coords.latitude,
                        },
                    });
                }
            }
        } catch(error){
            console.log(error.message);
        }
    }

    uploadImageFetch = async(uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function(){
                resolve(xhr.response);
            }
            xhr.onerror = function (e){
                console.log(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        const imageNameBefore = uri.split('/');
        const imageName = imageNameBefore[imageNameBefore.length - 1];

        const ref = firebase.storage().ref().child(`images/${imageName}`);
        const snapshot = await ref.put(blob);

        blob.close();
        return await snapshot.ref.getDownloadURL();
    }

    render(){
        return (
            <TouchableOpacity
                accesible={true}
                accessibilityLabel="More Options"
                accessibilityHint="Let's you choose to send an image or your geolocation"
                style={style.container}
                onPress={this.onActionPress}
            >
                <View style={[style.wrapper, this.props.wrapperStyle]} >
                    <Text style={[style.iconText, this.props.iconTextStyle]}>+</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const style = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#B2B2B2',
        borderWidth: 2,
        flex: 1
    },
    iconText: {
        color: '#B2B2B2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center'
    }
});

CustomActions.contextTypes = {
    actionSheet: PropTypes.func
}