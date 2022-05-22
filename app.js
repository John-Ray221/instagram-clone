   
class App{
     constructor(){
          
          //Firebase Configuration
          this.firebaseConfig = {
               apiKey: "AIzaSyB381WkgMHYyqyv5cEM6uwUEZWosNB-zBE",
               authDomain: "insta-clone-5f563.firebaseapp.com",
               projectId: "insta-clone-5f563",
               storageBucket: "insta-clone-5f563.appspot.com",
               messagingSenderId: "504232928454",
               appId: "1:504232928454:web:748c998b1e2698a465a3c7"
          }


          firebase.initializeApp(this.firebaseConfig);

          //This is the Post data object that will be uploaded and read from methods
          this.postData = {
               postID : "",
               displayName : "",
               imgFile : "",
               userUID : "",
               caption: "This is a caption",
               likes: 7
          }

          
          // Attributes
          this.firebaseAuth = firebase.auth();
          this.firebaseStorage = firebase.storage();
          this.db = firebase.firestore();
          this.firebaseUI = document.querySelector('#firebaseui-auth-container');
          this.appUI = document.querySelector('.App');
          this.ui = new firebaseui.auth.AuthUI(firebase.auth());
          this.loadedPosts = [];

          //Methods to run when initializing an object
          this.handelAuth();    
          this.handelEventListeners();


          
          
     }


     // App Methods


     // Method to handel the Authentication 
     handelAuth(){

          
          const uiConfig = {
               callbacks: {
                    signInSuccessWithAuthResult:()=>{
                         
                         console.log("Loged in")

                         let user = this.firebaseAuth.currentUser;
                         this.postData.userUID = user.uid;
                         this.postData.displayName = user.displayName;
                         
                         this.appUI.style.display = "block";

                         this.RetrivePost();
                         
                         
                         
          
                    }
               },
               signInOptions: [
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    firebase.auth.EmailAuthProvider.PROVIDER_ID
               ] 
          };


          this.ui.start(this.firebaseUI, uiConfig);

     }

     //Method to handel all the events on page
     handelEventListeners(){


          
           document.querySelector(".logout-btn").addEventListener("click",()=>{
               this.logout();
          });
          

          document.querySelector('#files').addEventListener("change",(e)=>{

               this.uploadImage(e.target.files[0])

               
          });

          document.querySelector('#post-btn').addEventListener("click",()=>{
               let captionText = document.querySelector("#post-caption-text").value;
               this.postData.postID = `post${(Math. floor(Math. random() * 100))}`
               this.postData.caption = captionText
               this.UploadPost();
               this.closeSection();
          });

          document.querySelector("#update-btn").addEventListener("click",()=>{
               
               let captionText = document.querySelector("#post-caption-text").value;
               this.postData.caption = captionText;

               this.UploadPost();
               this.closeSection();

               
               
               
               
          })

          document.querySelector(".post-btn").addEventListener("click",()=>{
               this.newPost();
          });

          
          document.querySelector(".exit-edit").addEventListener("click",()=>{
            this.closeSection();
            
          })

          document.querySelector(".exit-post").addEventListener("click",()=>{
            this.closeSection();
            
          });

             

      // Click event on body for the options to edit and delete a posts
          document.body.addEventListener("click",(e)=>{

               //Selecting the edit and delete button
               let editBtn = document.querySelector(".edit");
               let deleteBtn = document.querySelector(".delete");


               //Check if the user is on that posted the post and that the options menu are clicked
               if(e.target.classList.contains("openEdit") & e.target.classList.contains(this.postData.userUID)){
                    this.postData.postID = e.target.classList[2];
                    this.postData.ImgUrl = e.target.classList[3];
                    this.postData.imgFile = e.target.classList[4];

                    editBtn.style.display = "flex"
                    deleteBtn.style.display = "flex";
                    this.openOptionsModal();
               }
               else if(e.target.classList.contains("openEdit") & e.target.classList.contains(this.postData.userUID) === false){
                    //If it is not the user that posted it hide the edit and delete button
                   editBtn.style.display = "none";
                   deleteBtn.style.display = "none";

                   this.openOptionsModal();

                   
               }

               //Check if the user click the edit button on options modal
               if(e.target.classList.contains("edit")){
                    this.editPost();
               }

               //Check if the user click the delete button on options modal
               if(e.target.classList.contains("delete")){
                    this.deleteImg();
                    this.closeSection();
               }
          })
          
     }
     //Method to open the options modal
     openOptionsModal(){
      let editSection = document.querySelector(".edit-section");
      
      editSection.style.display = "block"
      


     }
     //Method to hide post section and options modal
     closeSection(){
      let editSection = document.querySelector(".edit-section");
      let postSection = document.querySelector(".new-post-section");

      editSection.style.display = "none";
      postSection.style.display = "none";
     }

     //Method to logout 
     logout(){
          this.firebaseAuth.signOut().then(() => {
               // Sign-out successful.
               
              
                    this.appUI.style.display = "none";
               
               
               this.handelAuth();

               console.log("loged out")
     
             }).catch((error) => {
               // An error happened.
               console.log(error)
             });
  
          
     }

     //Method to upload image to the firebase storage
     uploadImage(file){
          if(file){
               
               this.postData.imgFile = file.name;

               let storage = this.firebaseStorage.ref().child(file.name);

               storage.put(file).then((snapshot) => {
                   console.log('Uploaded a blob or file!');
                   this.getURL(file);
                 });
               
            
      }
     }
     
     //Method to get the url of the images from firebase storage to display images
     getURL(file){

          let storage = firebase.storage();
          
          storage.ref().child(file.name).getDownloadURL()
               .then((url)=>{

                    this.postData.ImgUrl = url;
               })           
     }

     //Method to upload the post object to the firebase store database
     UploadPost(){
          

          this.db.collection("posts").doc(this.postData.postID).set(this.postData)
           .then(() => {
               console.log("Document successfully written!");
               this.RetrivePost();
           })
           .catch((error) => {
               console.error("Error writing document: ", error);
           });

           
           
           

           
          
     }
     
     //Method to retrive the data from the firebase store database
     RetrivePost(){


         this.loadedPosts = [];
          this.db.collection("posts").get().then((querySnapshot) => {
               querySnapshot.forEach((doc) => {
                   // doc.data() is never undefined for query doc snapshots
                   this.loadedPosts.push(doc.data());
                    
               });
               this.loadPost();
           });

            

     }

     //Load the post to the webpage from the object 
     loadPost(){
     

       if(this.loadedPosts){

          let postContainer = document.querySelector(".posts")
          postContainer.innerHTML = null

        this.loadedPosts.forEach((item)=>{

          postContainer.innerHTML += `
           <div class="post">
                <div class="header">
                  <div class="profile-area">
                    <div class="post-pic">
                      <img
                        alt="jayshetty's profile picture"
                        class="_6q-tv"
                        data-testid="user-avatar"
                        draggable="false"
                        src="assets/akhil.png"
                      />
                    </div>
                    <span class="profile-name">${item.displayName}</span>
                  </div>
                  <div class="options">
                    <div
                      class="Igw0E rBNOH YBx95 _4EzTm"
                      style="height: 24px; width: 24px"
                    >
                      <svg class="openEdit ${item.userUID} ${item.postID} ${item.ImgUrl} ${item.imgFile}"
                        aria-label="More options"
                        class="_8-yf5"
                        fill="#262626"
                        height="16"
                        viewBox="0 0 48 48"
                        width="16"
                      >
                        <circle
                          clip-rule="evenodd"
                          cx="8"
                          cy="24"
                          fill-rule="evenodd"
                          r="4.5"
                        ></circle>
                        <circle
                          clip-rule="evenodd"
                          cx="24"
                          cy="24"
                          fill-rule="evenodd"
                          r="4.5"
                        ></circle>
                        <circle
                          clip-rule="evenodd"
                          cx="40"
                          cy="24"
                          fill-rule="evenodd"
                          r="4.5"
                        ></circle>
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="body">
                  <img
                    alt="Photo by Jay Shetty on September 12, 2020. Image may contain: 2 people."
                    class="FFVAD"
                    decoding="auto"
                    sizes="614px"
                    src="${item.ImgUrl}"
                    style="object-fit: cover"
                  />
                </div>
                <div class="footer">
                  <div class="user-actions">
                    <div class="like-comment-share">
                      <div>
                        <span class=""
                          ><svg
                            aria-label="Like"
                            class="_8-yf5"
                            fill="#262626"
                            height="24"
                            viewBox="0 0 48 48"
                            width="24"
                          >
                            <path
                              d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"
                            ></path></svg></span>
                      </div>
                      <div class="margin-left-small">
                        <svg
                          aria-label="Comment"
                          class="_8-yf5"
                          fill="#262626"
                          height="24"
                          viewBox="0 0 48 48"
                          width="24"
                        >
                          <path
                            clip-rule="evenodd"
                            d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z"
                            fill-rule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div class="margin-left-small">
                        <svg
                          aria-label="Share Post"
                          class="_8-yf5"
                          fill="#262626"
                          height="24"
                          viewBox="0 0 48 48"
                          width="24"
                        >
                          <path
                            d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5 22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <div class="bookmark">
                      <div class="QBdPU rrUvL">
                        <svg
                          aria-label="Save"
                          class="_8-yf5"
                          fill="#262626"
                          height="24"
                          viewBox="0 0 48 48"
                          width="24"
                        >
                          <path
                            d="M43.5 48c-.4 0-.8-.2-1.1-.4L24 29 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1zM24 26c.8 0 1.6.3 2.2.9l15.8 16V3H6v39.9l15.8-16c.6-.6 1.4-.9 2.2-.9z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <span class="likes"
                    >Likes <b>${item.likes}</b></span
                  >
                  <span class="caption">
                    <span class="caption-username"><b>${item.displayName}</b></span>
                    <span class="caption-text">
                     ${item.caption}
                     </span>
                  </span>
                  <span class="comment">
                    <span class="caption-username"><b>akhilboddu</b></span>
                    <span class="caption-text">Thank you</span>
                  </span>
                  <span class="comment">
                    <span class="caption-username"><b>imharjot</b></span>
                    <span class="caption-text"> Great stuff</span>
                  </span>
                  <span class="posted-time">5 HOURS AGO</span>
                </div>
                <div class="add-comment">
                  <input type="text" placeholder="Add a comment..." />
                  <a class="post-btn">Post</a>
                </div>
              </div>
          
          `;

        })
       }
     }

     //Method to display the data when users click on edit button
     editPost(){
          if(this.loadedPosts){
               this.loadedPosts.forEach((item)=>{
                    if(item.postID === this.postData.postID){
                         

                         let postSection = document.querySelector(".new-post-section");
                         let editSection = document.querySelector(".edit-section");
                         let postContainer = document.querySelector(".post-container");
                         postSection.style.display = "block";
                         editSection.style.display = "none";

                         console.log(postContainer.children);

                         postContainer.children[0].style.display = "block";
                         postContainer.children[0].src = item.ImgUrl;
                         postContainer.children[1].style.display ="none";
                         postContainer.children[4].textContent = item.caption;
                         postContainer.children[5].value = item.caption;
                         postContainer.children[7].style.display = "none";
                         postContainer.children[8].style.display = "block";

                    }
               })
          }
     }

     //Method to display Html when user want to create a new post
     newPost(){
                         let postSection = document.querySelector(".new-post-section");
                         let editSection = document.querySelector(".edit-section");
                         let postContainer = document.querySelector(".post-container");
                         postSection.style.display = "block";
                         editSection.style.display = "none";

                         console.log(postContainer.children);

                         postContainer.children[0].style.display = "none";
                         postContainer.children[1].style.display = "block";
                         postContainer.children[4].textContent = null;
                         postContainer.children[5].value = null;
                         postContainer.children[7].style.display = "block";
                         postContainer.children[8].style.display = "none";
     }

     //Method to delete an image from the firebase storage
     deleteImg(){
          console.log(this.postData.postID)

          let storage = this.firebaseStorage.ref().child(this.postData.imgFile);

          storage.delete();

          setTimeout(() => {
               this.deletePost();
          }, 3000);
             
     }

     //Method to delete the post from the firebase database
     deletePost(){
          this.db.collection("posts").doc(this.postData.postID).delete().then(() => {
               console.log("Document successfully deleted!");
               this.RetrivePost();
           }).catch((error) => {
               console.error("Error removing document: ", error);
           });
     }

}

const app = new App;
