import { USER_LOGGED_IN, USER_LOGGED_OUT } from "../types";
import api from "../api";
import setAuthorizationHeader from "../utils/setAuthorizationHeader";

export const userLoggedIn = user => ({
  type: USER_LOGGED_IN,
  user
});

export const userLoggedOut = () => ({
  type: USER_LOGGED_OUT
});

export const login = credentials => {
  console.log("login", credentials);
  setAuthorizationHeader(true);
  /* fetch(URL + `user/loginUser`, {
    method: "POST",
    body: credentials
  }).then(response => console.log(response.json())); */
};

api.user.login().then(user => {
  console.log(user);
  /* localStorage.bookwormJWT = user.token;
  setAuthorizationHeader(user.token);
  dispatch(userLoggedIn(user)); */
});

export const logout = () => dispatch => {
  localStorage.removeItem("isAuthenticated");
  setAuthorizationHeader();
  dispatch(userLoggedOut());
};

export const confirm = token => dispatch =>
  api.user.confirm(token).then(user => {
    localStorage.bookwormJWT = user.token;
    dispatch(userLoggedIn(user));
  });

export const resetPasswordRequest = ({ email }) => () =>
  api.user.resetPasswordRequest(email);

export const validateToken = token => () => api.user.validateToken(token);

export const resetPassword = data => () => api.user.resetPassword(data);
