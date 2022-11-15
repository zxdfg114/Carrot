import { configureStore, createSlice } from "@reduxjs/toolkit";

let userUid = createSlice({
  name: "userUid",
  initialState: "첫 state",
  // 1. 변경함수 설정
  reducers: {
    setUserUid(state, action) {
      //파라미터로 바꾸려면 .payload 붙여줘야함
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
