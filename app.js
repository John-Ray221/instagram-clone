const firebaseApp = firebase.initializeApp({
     /* Firebase config */ 
     apiKey: "AIzaSyB381WkgMHYyqyv5cEM6uwUEZWosNB-zBE",
     authDomain: "insta-clone-5f563.firebaseapp.com",
     projectId: "insta-clone-5f563",
     storageBucket: "insta-clone-5f563.appspot.com",
     messagingSenderId: "504232928454",
     appId: "1:504232928454:web:748c998b1e2698a465a3c7"

});



const firebaseUI = document.querySelector('#firebaseui-auth-container');
const appUI = document.querySelector('.main-container');
appUI.style.display = 'none';


// Authentication UI
let ui = new firebaseui.auth.AuthUI(firebase.auth());
const uiConfig = {
     callbacks: {
       signInSuccessWithAuthResult:function(){
         // User successfully signed in.
         // Return type determines whether we continue the redirect automatically
         // or whether we leave that to developer to handle.
         appUI.style.display = "block";
         firebaseUI.style.display = 'none';
         
       },
       uiShown: function() {
         // The widget is rendered.
         // Hide the loader.
     //     document.getElementById('loader').style.display = 'none';
          appUI.style.display = "none";
       }
     },
     signInOptions: [
       // Leave the lines as is for the providers you want to offer your users.
       firebase.auth.GoogleAuthProvider.PROVIDER_ID,
       firebase.auth.EmailAuthProvider.PROVIDER_ID
     ] 
   };

   

   //Local Functions

   function logout(){
     firebase.auth().signOut().then(() => {
          // Sign-out successful.
          appUI.style.display = "none";
          firebaseUI.style.display = "block";

          ui.start(firebaseUI, uiConfig);
          
        }).catch((error) => {
          // An error happened.
          console.log(error)
        });

   }

   ui.start(firebaseUI, uiConfig);

  
