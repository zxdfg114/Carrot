import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, HashRouter } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/firebase-storage";
import "firebase/firebase-auth";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

// const firebaseConfig = {
//   apiKey: "AIzaSyDGQ7rNazNMvFOPdafbigX7Hj6O9bCgyp8",
//   authDomain: "eggplant-2cc57.firebaseapp.com",
//   projectId: "eggplant-2cc57",
//   storageBucket: "eggplant-2cc57.appspot.com",
//   messagingSenderId: "491636354361",
//   appId: "1:491636354361:web:2db3a26d565e5d90c00ce8",
// };

const firebaseConfig = {
  apiKey: "AIzaSyBdO-irCCWskpTCMHt4Pe81RQgaRg38Z5g",
  authDomain: "temporary-59256.firebaseapp.com",
  projectId: "temporary-59256",
  storageBucket: "temporary-59256.appspot.com",
  messagingSenderId: "516727100937",
  appId: "1:516727100937:web:a4b2ad6ab457f5ff8ccad8",
};

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const storage = firebase.storage();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    <HashRouter>
      <App />
    </HashRouter>
  </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
