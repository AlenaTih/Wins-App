import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"

const firebaseConfig = {
  apiKey: "AIzaSyChR30UHiZ4u-_t1mbqPfBTY0g57Smr_HA",
  authDomain: "realtime-database-67683.firebaseapp.com",
  databaseURL: "https://realtime-database-67683-default-rtdb.europe-west1.firebasedatabase.app",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
// const winsDatainDB = ref(database, "AchievementsData")

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

const loginButton = document.getElementById("login-button")
const logoutButton = document.getElementById("logout-button")

const saveButton = document.getElementById("save-button")
const typeInput = document.getElementById("type-input")
const winInput = document.getElementById("win-input")
const winsFeed = document.getElementById("wins-feed")

const userName = document.getElementById("user-name")

document.addEventListener("click", function(e) {
    if (e.target.id === "login-button") {
        signInWithGoogle()
    } else if (e.target.id === "logout-button") {
        signOutFromApp()
    }
})

async function signInWithGoogle() {
  try {
    const response = await signInWithPopup(auth, provider)
    console.log("Everything worked", response)
    // User signed in successfully
    
    // console.log(auth)

    // Store user information in session storage
    sessionStorage.setItem('user', JSON.stringify(response.user))

    // After user signed in, render their wins
    // renderWinsFromDatabase(response.user.uid)
    renderWinsFromDatabase(auth.currentUser.uid)

    checkAuthentication()
  } catch (error) {
      // Handle errors
      console.error("Error signing in:", error)
  }
}

async function signOutFromApp() {
  try {
      await signOut(auth)

      // User signed out successfully
      console.log("User signed out")

      sessionStorage.clear()
  
      checkAuthentication()
  } 
  catch (error) {
        // Handle errors
        console.error("Error signing out:", error)
  }
}

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     console.log("Logged in")
//     loginButton.style.display = "none"
//     document.getElementById("view-logged-out").style.display = "none"
//     document.getElementById("view-logged-in").style.display = "flex"
//     // const user = JSON.parse(sessionStorage.getItem('user'))
//     console.log(user.uid)
//     renderWinsFromDatabase(user.uid)
//   } else {
//       console.log("Logged out")
//       loginButton.style.display = "block"
//       document.getElementById("view-logged-out").style.display = "flex"
//       document.getElementById("view-logged-in").style.display = "none"
//   }
// })

// Function to check if user is already authenticated
function checkAuthentication() {
    const user = JSON.parse(sessionStorage.getItem('user'))
    if (user) {
        // User is authenticated, render their wins
        console.log("Logged in")
        // renderWinsFromDatabase(user.uid)
        renderWinsFromDatabase(auth.currentUser.uid)
        loginButton.style.display = "none"
        logoutButton.style.display = "block"
        document.getElementById("view-logged-out").style.display = "none"
        document.getElementById("view-logged-in").style.display = "flex"
    } else {
        // User is not authenticated, handle accordingly
        console.log("Logged out")
        loginButton.style.display = "block"
        logoutButton.style.display = "none"
        document.getElementById("view-logged-out").style.display = "flex"
        document.getElementById("view-logged-in").style.display = "none"
    }
}

// Call checkAuthentication when the page loads
window.addEventListener('load', checkAuthentication)
                                          

let inputValue = {
  type: "",
  achievement: ""
}

  saveButton.addEventListener("click", function() {
    if (!winInput.value.trim()) {
        alert("Please type in your achievement ❤️")
        return
    } else {
        // alert("Wow, great win! It is saved! ❤️"️)

        inputValue.type = typeInput.value
        inputValue.achievement = winInput.value

      const user = JSON.parse(sessionStorage.getItem('user'))

      let userReference = ref(database, `AchievementsData/${user.uid}`)

      push(userReference, inputValue)

        // form.reset()
      typeInput.value = ""
      winInput.value = ""
    }
  })

// function saveButtonClick() {
//   if (saveButton) {
//     if (!winInput.value.trim()) {
//         alert("Please type in your achievement ❤️")
//         return
//     } else {
//         // alert("Wow, great win! It is saved! ❤️"️)

//         inputValue.type = typeInput.value
//         inputValue.achievement = winInput.value

//       const user = JSON.parse(sessionStorage.getItem('user'))

//       let userReference = ref(database, `AchievementsData/${user.uid}`)

//       push(userReference, inputValue)

//         // form.reset()
//       typeInput.value = ""
//       winInput.value = ""
//     }
//   }

// }
    

function renderWinsFromDatabase(userId) {
  let userWinsRef = ref(database, `AchievementsData/${userId}`)

  onValue(userWinsRef, function(snapshot) {
    if (snapshot.exists()) {

      winsFeed.innerHTML = ""

      const winsObj = snapshot.val()

      for (let key in winsObj) {
        renderWins(winsObj[key], key)
      }

    }
  })
}

function renderWins(win, id) {

  userName.innerHTML = `
  <h2>${auth.currentUser.displayName}</h2>
  <p>${auth.currentUser.email}<p>`
  
  const newWin = document.createElement("li")
  newWin.setAttribute("id", id)
  
  newWin.innerHTML = `
    <h3>${win.type}</h3>
    <p>${win.achievement}</p>
  `
  winsFeed.prepend(newWin)
}
  