   
class userInterface{
     constructor(){
          // Firebase API and config
          this.firebaseApp = firebase.initializeApp({
               
               apiKey: "AIzaSyB381WkgMHYyqyv5cEM6uwUEZWosNB-zBE",
               authDomain: "insta-clone-5f563.firebaseapp.com",
               projectId: "insta-clone-5f563",
               storageBucket: "insta-clone-5f563.appspot.com",
               messagingSenderId: "504232928454",
               appId: "1:504232928454:web:748c998b1e2698a465a3c7"
          
          });
          
          // Attributes
          this.firebaseAuth = firebase.auth()
          this.firebaseUI = document.querySelector('#firebaseui-auth-container');
          this.appUI = document.querySelector('.App');
          this.appUI.style.display = "none";
          this.ui = new firebaseui.auth.AuthUI(firebase.auth());

          //Methods to run when initializing an object
          this.handelAuth();
          this.handelEventListeners();
          this.logout();      
     }


     // App Methods


     // Method to handel the Authentication 
     handelAuth(){

          
          const uiConfig = {
               callbacks: {
                    signInSuccessWithAuthResult:()=>{
               
                         this.appUI.style.display = "block";
                         

                         console.log("I am login");
               
                    },
                    uiShown: function() {

                         // this.appUI.style.display = "none";
                    }
               },
               signInOptions: [
                    // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    firebase.auth.EmailAuthProvider.PROVIDER_ID
               ] 
          };


          this.ui.start(this.firebaseUI, uiConfig);

     }

     //Method to handel all the events
     handelEventListeners(){
          let logOutBtn = document.querySelector(".logout-btn");

          logOutBtn.addEventListener("click",()=>{
               this.logout();
          })
     }


     logout(){
          this.firebaseAuth.signOut().then(() => {
               // Sign-out successful.  
          
               this.handelAuth();

               console.log("logout");
     
             }).catch((error) => {
               // An error happened.
               console.log(error)
             });
     
     }

     

}

const app = new userInterface;
