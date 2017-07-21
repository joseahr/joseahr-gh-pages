const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase)

exports.storeUserInfo = functions.auth.user().onCreate( event =>{
    // Un usuario se ha conectado por primera vez a nuestra aplicación
    const user = event.data;
    const { displayName, photoURL, email } = user;
    
    admin.database()
        .ref(`users/${user.uid}`)
        .set({ displayName, photoURL, email })

});

