const functions = require('firebase-functions');
const admin = require('firebase-admin');
const gravatar = require('gravatar');

admin.initializeApp(functions.config().firebase)

exports.storeUserInfo = functions.auth.user().onCreate( event => {
    // Un usuario se ha conectado por primera vez a nuestra aplicación
    const user = event.data;
    const { 
          displayName = 'Anonymous'
        , photoURL = gravatar.url(user.displayName, { protocol: 'https', s: '100', r: 'x', d: 'retro' })
        , uid
    } = user;

    console.log('data', event);
    console.log('photoURL', photoURL);
    
    let storeUser = admin.database()
        .ref(`users/${uid}`)
        .set({ displayName, photoURL });

    if(user.photoURL) return;

    storeUser.then( ()=> 
        admin.auth().updateUser(uid, { photoURL }) );

});


exports.onDeleteUser = functions.auth.user().onDelete( event => {
    // Se va a eliminar un usuario
    let user = event.data;
    let { uid } = user;
    let endpoints = ['users', 'messages'];

    Promise.all(
        endpoints.map( endpoint => admin
                                    .database()
                                    .ref(`${endpoint}/${uid}`)
                                    .remove() )
    ).then( ()=> console.log('User and Info deleted, uid : ' + uid ) )
})