   
class userInterface{
     constructor(){
          

          this.firebaseConfig = {
               apiKey: "AIzaSyB381WkgMHYyqyv5cEM6uwUEZWosNB-zBE",
               authDomain: "insta-clone-5f563.firebaseapp.com",
               projectId: "insta-clone-5f563",
               storageBucket: "insta-clone-5f563.appspot.com",
               messagingSenderId: "504232928454",
               appId: "1:504232928454:web:748c998b1e2698a465a3c7"
          }

          firebase.initializeApp(this.firebaseConfig);


          
          // Attributes
          this.firebaseAuth = firebase.auth();
          this.firebaseStorage = firebase.storage();
          this.db = firebase.firestore();
          this.firebaseUI = document.querySelector('#firebaseui-auth-container');
          this.appUI = document.querySelector('.App');
          this.appUI.style.display = "none";
          this.ui = new firebaseui.auth.AuthUI(firebase.auth());
          this.currentUser = {}
          this.files = [];
          this.URLs = [];

          //Methods to run when initializing an object
          this.handelAuth();
          this.handelEventListeners();
          this.logout();    
          
          
          //Debug Output
          
     }


     // App Methods


     // Method to handel the Authentication 
     handelAuth(){

          
          const uiConfig = {
               callbacks: {
                    signInSuccessWithAuthResult:()=>{
                         
                         let user = this.firebaseAuth.currentUser;
                         this.appUI.style.display = "block";
                         this.currentUser = {...user}

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
          });


          document.querySelector('#files').addEventListener("change",(e)=>{

               this.files = [...e.target.files];

          });

          document.querySelector('#send').addEventListener("click",()=>{
               this.uploadImage();
          })

          document.querySelector('#post').addEventListener("click",()=>{
               this.UploadPost();
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

     uploadImage(){
          if(this.files){
               this.files.forEach((item)=>{

                    let storage = this.firebaseStorage.ref(item.name);

                    let upload = storage.put(item);

                    upload.on("state_changed", function progress(snapshot) {
                           var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                           document.getElementById("progress").value = percentage;
                         },
               
                         function error() {
                           alert("error uploading file");
                         },
               
                         function complete(){
                           document.getElementById("uploading").innerHTML += `${item.name} uploaded <br />`;
                           
                         }
                       );
                     });
                    this.getURL();
          }
     }

     UploadPost(){
          const post = {
               userID : this.currentUser._delegate.uid,
               urls : this.URLs
          }

          this.db.collection("users").doc(this.currentUser._delegate.uid).set(post)
           .then(() => {
               console.log("Document successfully written!");
           })
           .catch((error) => {
               console.error("Error writing document: ", error);
           });

          


     }
     

     getURL(){
          let storage = firebase.storage();
          

          this.files.forEach((item)=>{
             
               storage.ref().child(item.name).getDownloadURL()
               .then((url)=>{
                    this.URLs.push(url); 
               })
          });
     }

}

const app = new userInterface;
