import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/style.min.css";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { db } from "./index";
import "firebase/firestore";
import firebase from "firebase/app";
import "firebase/auth";
import Header from "./components/Header";
import Product from "./components/Product";
import Upload from "./routes/Upload";
import Signup from "./routes/Signup";
import Signin from "./routes/SignIn";
import Detail from "./routes/Detail";
import Edit from "./routes/Edit";

function App() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [uid, setUid] = useState(null);

  const _data = [...data];
  async function getData() {
    const dbData = db.collection("product").get();
    const result = await dbData;
    result.forEach((doc) => {
      const items = doc.data();
      items.id = doc.id;
      _data.push(items);
      setData(_data);
    });
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(`${user.displayName} 로그인중`);
        setLoggedIn(true);
        setUser(user.displayName);
        setUid(user.uid);
      } else {
        console.log("no user loggeedin");
        setUser(null);
        setLoggedIn(false);
        setUid(null);
      }
    });
  }, []);

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Header
        user={user}
        setUser={setUser}
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
      />
      <main>
        <Routes>
          <Route
            path={"/"}
            element={<Product data={data} setData={setData} />}
          />
          <Route
            path={"/upload"}
            element={
              <Upload data={data} setData={setData} uid={uid} user={user} />
            }
          />
          <Route
            path={"/signup"}
            element={<Signup user={user} setUser={setUser} />}
          />
          <Route
            path={"/signin"}
            element={<Signin user={user} setUser={setUser} />}
          />
          <Route
            path={"detail/:id"}
            element={<Detail data={data} setData={setData} uid={uid} />}
          />
          <Route
            path={"edit/:product"}
            element={
              <Edit data={data} setData={setData} uid={uid} user={user} />
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
