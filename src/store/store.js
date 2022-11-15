import { configureStore, createSlice } from "@reduxjs/toolkit";

let userUid = createSlice({
  name: "userUid",
  initialState: "첫 state",
  // 1. 변경함수 설정
  reducers: {
    setUserUid(state, action) {
      return action.payload;
    },
  },
});
export let { setUserUid } = userUid.actions;

export default configureStore({
  reducer: {
    userUid: userUid.reducer,
  },
});

//2. 내보내기
