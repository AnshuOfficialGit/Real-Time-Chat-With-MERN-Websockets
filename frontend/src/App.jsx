import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./components/layouts/AuthLayout";
import Login from "./components/pages/auth/Login";
import Register from "./components/pages/auth/Register";
import UserList from "./components/pages/users/UserList";
import ChatList from "./components/pages/chat/ChatList";
import Chat from "./components/pages/chat/Chat";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/chat-list/:id" element={<ChatList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
