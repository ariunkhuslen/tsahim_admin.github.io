import axios from "axios";

export default (token = null) => {
  console.log("setauth");
  localStorage.setItem("isAuthenticated", true);
  /* if (token) {
    axios.defaults.headers.common.authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.authorization;
  } */
};
