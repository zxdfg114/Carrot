import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { db } from "./index";
import "firebase/firestore";
import firebase from "firebase/app";
import "firebase/auth";
import Product from "./components/Product";
import Upload from "./routes/Upload";
import Signup from "./routes/Signup";
import Signin from "./routes/SignIn";
import Detail from "./routes/Detail";
import Edit from "./routes/Edit";
import Chat from "./routes/Chat";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Header from "./components/Header";
import "./css/style.min.css";
import MyPost from "./routes/MyPost";
import Watched from "./components/watched";

function App() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [uid, setUid] = useState(null);
  // data state는 배열이라서 !
  const _data = [...data];
  //상품정보 가져오는 함수
  async function getData() {
    const dbData = db.collection("product").orderBy("날짜", "desc").get();
    const result = await dbData;
    result.forEach((doc) => {
      const items = doc.data();
      items.id = doc.id;
      _data.push(items);
      setData(_data);
    });
  }

  //로그인시 user가 생성됨
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
        setUser(user.displayName);
        setUid(user.uid);
        if (user.email === "chat3@gmail.com") {
          setAdmin(true);
        }
      } else {
        setUser(null);
        setLoggedIn(false);
        setUid(null);
        setAdmin(false);
      }
    });
  }, []);

  useEffect(() => {
    getData();
  }, []);

  let [watched, setWatched] = useState(
    JSON.parse(localStorage.getItem("watched"))
  );

  useEffect(() => {
    setWatched([].concat(JSON.parse(localStorage.getItem("watched"))));
    console.log(watched);
  }, []);

  return (
    <>
      <Header
        user={user}
        setUser={setUser}
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        uid={uid}
      />
      <main>
        <Routes basename={process.env.PUBLIC_URL}>
          <Route
            path={"/"}
            element={
              <>
                <Hero />
                {watched.length !== 0 ? <Watched data={data} /> : null}
                <div className="my-post">
                  <h1>전체 매물</h1>
                </div>
                <Product data={data} setData={setData} />
              </>
            }
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
            path={"/detail/:id"}
            element={
              <Detail
                data={data}
                setData={setData}
                uid={uid}
                loggedIn={loggedIn}
                admin={admin}
              />
            }
          />
          <Route
            path={"/mypost/:id"}
            element={
              <MyPost
                data={data}
                setData={setData}
                uid={uid}
                loggedIn={loggedIn}
                admin={admin}
              />
            }
          />
          <Route
            path={"/edit/:product"}
            element={
              <Edit data={data} setData={setData} uid={uid} user={user} />
            }
          />
          <Route path={"/chat/:id"} element={<Chat uid={uid} />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
