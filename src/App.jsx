// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header/Header";
import SideBar from "./Components/SideBar/SideBar";
import LoginPage from "./Components/LoginPage/LoginPage";
import HomePage from "./Components/HomePage/HomePage";
import SurveyIndex from "./Components/SurveyIndex/SurveyIndex";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import QuestionIndex from "./Components/QuestionIndex/QuestionIndex";

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Router>
      {!isAuthenticated ? (
        <LoginPage />
      ) : (
        <>
          <Header />
          <SideBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/survey-index" element={<SurveyIndex />} />
            <Route path="/question-index" element={<QuestionIndex />} />
          </Routes>
        </>
      )}
    </Router>
  );
}

export default App;

