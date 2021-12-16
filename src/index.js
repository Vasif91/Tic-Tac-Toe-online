import "./styles.css";
import { Tik_Tok_Toe } from "./game";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  onValue,
  child,
  get,
  remove,
  update
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD0gyAu30K2TrW4cN2UtpCDf_fmtfvg1_Q",
  authDomain: "my-project-c86c2.firebaseapp.com",
  databaseURL: "https://my-project-c86c2.firebaseio.com",
  projectId: "my-project-c86c2",
  storageBucket: "my-project-c86c2.appspot.com",
  messagingSenderId: "917329553165",
  appId: "1:917329553165:web:b6e85ce1206f64b0",
  measurementId: "G-D9WE4YEK4W"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
if (db) {
  console.log("database hazirdir");
}
const root = document.querySelector("#root");
const root2 = document.querySelector("#root2");
const root3 = document.querySelector("#root3");
const input = document.querySelector("#input");
const submit = document.querySelector("#submit");
const game = new Tik_Tok_Toe();

function createSession(value, player) {
  sessionStorage.setItem("ID", value);
  sessionStorage.setItem("player", player);
}

function createNik(e) {
  get(child(ref(db), `nik/`))
    .then((snap) => {
      if (snap.exists()) {
        if (snap.val()[e]) {
          let date = new Date();
          let time = date.getMinutes();
          set(ref(db, "nik/" + e + "/O"), {
            id: "O",
            bool: false,
            date: time,
            play: true,
            winner: ""
          });
          update(ref(db, "nik/" + e + "/X"), {
            play: true
          });
          createSession(e, "O");
          root.style.display = "none";
          root2.style.display = "block";
          window.onload = game.init();
        } else {
          let date = new Date();
          let time = date.getMinutes();
          set(ref(db, "nik/" + e + "/X"), {
            id: "X",
            bool: true,
            date: time,
            play: false,
            winner: ""
          });
          createSession(e, "X");
          root.style.display = "none";
          root2.style.display = "block";
          window.onload = game.init();
        }
      } else {
        let date = new Date();
        let time = date.getMinutes();
        set(ref(db, "nik/" + e + "/X"), {
          id: "X",
          bool: true,
          date: time,
          play: false,
          winner: ""
        });
        createSession(e, "X");
        root.style.display = "none";
        root2.style.display = "block";
        window.onload = game.init();
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

submit.addEventListener(
  "click",
  (e) => {
    createNik(input.value);
  },
  false
);

onValue(ref(db, "nik/"), (snapshot) => {
  let dbData = snapshot.val();
  root3.innerHTML = " ";
  if (dbData) {
    let date = new Date();
    let time = date.getMinutes();
    Object.keys(dbData).forEach((s) => {
      if (dbData[s]["X"].date + 5 <= time) {
        remove(ref(db, "nik/" + s));
      }
      let list = document.createElement("li");
      list.innerHTML = s;
      list.setAttribute("data-id", s);
      list.className = "list-group-item";
      root3.appendChild(list);
      if (list) {
        list.addEventListener("click", findServer);
      }
    });
  }
});

function findServer() {
  let cardID = this.getAttribute("data-id");
  createNik(cardID);
}
