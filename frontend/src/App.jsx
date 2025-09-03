import React from 'react'
import Signup from './components/Signup'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import DocDetails from './components/DocDetails'
import SemanticSearch from './components/SemanticSearch'
import QA from './components/QA'
import { useContext } from 'react'
import { UserDataContext } from './Context/UserContext'

const App = () => {
  const  {userData, setUserData,loading} = useContext(UserDataContext);

   if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }
  return (
    <div>
      <Routes>
        <Route path="/" element={userData ? <Home /> : <Login />} />
        <Route path="/home" element={userData ? <Navigate to="/" />: <Login />} />
        <Route path="/login" element={userData ? <Navigate to="/" />: <Login />} />
        <Route path="/signup" element={userData ? <Home /> : <Signup />} />
        <Route path="/docs/:id" element={userData ? <DocDetails /> : <Login />} />
        <Route path="/semantic-search" element={userData ? <SemanticSearch /> : <Login />} />
        <Route path="/qa" element={userData ? <QA /> : <Login />} />
      </Routes>
    </div>
  )
} 

export default App