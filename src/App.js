import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState, useTransition, useMemo, Suspense } from "react";
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
import HotItems from "./components/HotItems";
import MyInterest from "./routes/MyInterest";

function App() {
  const arr = JSON.parse(localStorage.getItem("watched"));
  arr ?? localStorage.setItem("watched", JSON.stringify([]));
  const [data, setData] = useState([]);

  //이름 저장할 state
  const [user, setUser] = useState(null);
  //user collection에 저장
  const [logginedUser, setLogginedUser] = useState(null);
  //admin 이면 true
  const [admin, setAdmin] = useState(false);
  //로그인 됐나 안됐나 판단
  const [loggedIn, setLoggedIn] = useState(false);
  //고유 uid state로 저장하여 활용
  const [uid, setUid] = useState(null);
  // data state는 배열이라서 복사 필요
  const _data = [...data];

  let [isPending, startTransition] = useTransition();
  //상품정보 가져오는 함수, subCollection 가져오기, 비동기 함수의 실행시점 조정하기
  async function getData() {
    const dbData = db.collection("product").orderBy("날짜", "desc").get();
    const result = await dbData;
    result.forEach((doc) => {
      let items = doc.data();
      // 처음 좋아요 데이터를 가져올때는 get으로 가져옴, 첫 실행 이후에 리스너를 부착하여 실시간으로 반영
      doc.ref
        .collection("like")
        .get()
        .then((snapshot) => {
          items.likeCount = snapshot.size;
        })
        .then(() => {
          items.id = doc.id;
          _data.unshift(items);
          //문제의 state 변경을 조금 늦게 처리하여 성능개선
          startTransition(() => {
            setData([].concat(_data));
          });
        });
      doc.ref.collection("like").onSnapshot((snapshot) => {
        items.likeCount = snapshot.size;
      });
    });
  }

  //유저 정보 가져와서 state에 저장하는 함수, onSnapShot은 비동기함수 x
  const getUser = (uid) => {
    db.collection("user")
      .doc(uid)
      .onSnapshot((doc) => {
        let userData = doc.data();
        setLogginedUser(userData);
      });
  };

  //로그인시 user가 생성됨
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
        setUser(user.displayName);
        setUid(user.uid);
        getUser(user.uid);
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

  useMemo(() => {
    return getData();
  }, []);

  //최근본 상품 기능을 위한 로컬스토리지 활용
  let [watched, setWatched] = useState(
    JSON.parse(localStorage.getItem("watched"))
  );

  //변경시 렌더링을 위해 concat 사용
  useEffect(() => {
    setWatched([].concat(JSON.parse(localStorage.getItem("watched"))));
  }, []);

  return (
    <>
      <Header
        user={user}
        setUser={setUser}
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        logginedUser={logginedUser}
        uid={uid}
      />
      <main>
        <Suspense>
          <Routes basename={process.env.PUBLIC_URL}>
            <Route
              path={"/"}
              element={
                <>
                  <Hero />
                  <HotItems data={data} />
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
            <Route
              path={"/chat/:id"}
              element={<Chat uid={uid} logginedUser={logginedUser} />}
            />
            <Route
              path={"/liked/:id"}
              element={
                <MyInterest
                  data={data}
                  setData={setData}
                  uid={uid}
                  loggedIn={loggedIn}
                  admin={admin}
                />
              }
            />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default App;
