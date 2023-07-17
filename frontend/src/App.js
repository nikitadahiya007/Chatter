import "./App.css";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import { Route } from "react-router-dom";
import EmailVerify from "./Pages/EmailVerify";

function App() {
  return (
    <div className="App">
      <Route path="/" component={HomePage} exact />
      <Route path="/chats" component={ChatPage} />
      <Route path="/verify" component={EmailVerify} />
    </div>
  );
}

export default App;
