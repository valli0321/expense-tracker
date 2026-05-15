import React, { useContext } from 'react'
import {
  BrowserRouter as Router,
  Routes, 
  Route,
  Navigate,
  Outlet
} from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import Login from './pages/auth/login';
import SignUp from './pages/auth/SignUp';
import Home from './pages/Dashboard/Home';
import Expense from './pages/Dashboard/Expense';
import Income from './pages/Dashboard/Income';
import UserProvider from './context/UserProvider';
import { UserContext } from './context/UserContext';
import AuthLoader from './components/AuthLoader';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <UserProvider>
      <div>
        <Toaster position="top-center" reverseOrder={false} />
        <Router>
          <Routes>
            <Route path='/' element={<Root/>} />
            <Route path='/login' exact element={<Login />} />
            <Route path='/signup' exact element={<SignUp />} />

            <Route element={<ProtectedRoute />}>
              <Route path='/dashboard' exact element={<Home />} />
              <Route path='/expense' exact element={<Expense />} />
              <Route path='/income' exact element={<Income />} />
            </Route>
          </Routes>
        </Router>
      </div>
    </UserProvider>
  )
}

export default App

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if(loading){
    return <AuthLoader />
  }

  // Redirect to login if authenticated otherwise to login
  return user ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};