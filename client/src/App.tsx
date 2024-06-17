import React from "react";
import Register from "./components/register/Register";
import { Route, Routes } from "react-router-dom";
import Login from "./components/login/Login";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="" element={<Register></Register>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
      </Routes>
    </div>
  );
}
