import React from 'react'
import {
  BrowserRouter as Router,
  Routes, 
  Route,
  Navigate
} from "react-router-dom";
import Login from './pages/auth/login';
import SignUp from './pages/auth/SignUp';
import Home from './pages/Dashboard/Home';
import Expense from './pages/Dashboard/Expense';
import Income from './pages/Dashboard/Income';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Root/>} />
          <Route path='/login' exact element={<Login />} />
          <Route path='/signup' exact element={<SignUp />} />
          <Route path='/dashboard' exact element={<Home />} />
          <Route path='/expense' exact element={<Expense />} />
          <Route path='/income' exact element={<Income />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App

const Root = () => {
  // check if tokens exists in local storage
  const isAuthenticated = !!localStorage.getItem("token");

  // Redirect to login if authenticated otherwise to login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};