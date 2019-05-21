import axios from "axios";

export default {
  user: {
    login: credentials =>
      axios.post("/user/loginuser", { credentials }).then(res => res.data.user)
  },
  books: {
    fetchAll: () => axios.get("/api/books").then(res => res.data.books),
    create: book =>
      axios.post("/api/books", { book }).then(res => res.data.book)
  }
};
