// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import './index.css';
// import NavBar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import BookDetails from "./components/Dasboard/BookDetails";
import Favourites from "./components/pages/Favourite/Favourites";
import Login from "./components/login-singin/Login";
import Register from "./components/login-singin/Register";
import Orders from "./components/pages/MyOrders";
import Admin from "./components/Dasboard/admin";
import User_dasboard from "./components/Dasboard/user"
import AddBooks from "./components/Dasboard/AddBooks"
import Purchase from './components/Dasboard/purchased_details'
import { FavoritesProvider } from './components/pages/Favourite/FavoritesContext';
import { AuthProvider } from "./components/Navbar/AuthContext";
import Notifications from "./components/Navbar/Notifications";
import User_charts from './components/Dasboard/charts/purchase_charts';
import Gallery from "./components/Dasboard/gallery";

const App = () => {
  return (
    <FavoritesProvider>
      <AuthProvider>
        <Router>
          {/* <NavBar /> */}
          <div className="bg-[#f3f3f3] w-full min-h-screen">
            <Routes>
              {/* <Route path="/" element={<Home />} /> */}
              {/* <Route path="/hotels" element={<Hotels />} /> */}
              {/* <Route path="/transportation" element={<Transportation />} /> */}
              <Route path="/" element={<User_dasboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/favourites" element={<Favourites />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/add_books" element={<AddBooks />} />
              <Route path="/book_details" element={<BookDetails />} />
              <Route path="/purchase" element={<Purchase />} />
              <Route path="/myorders" element={<Orders />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/user_charts" element={<User_charts />} />
              {/* <Route path="/user_charts" element={<Gallery />} /> */}
            </Routes>
          </div>
          <FooterConditionally />
        </Router>
      </AuthProvider>
    </FavoritesProvider>
  );
}

const FooterConditionally = () => {
  const location = useLocation();
  const noFooterPaths = ["/admin", "/add_books", "/book_details","/purchase","/login","/register","/notifications"];

  if (noFooterPaths.includes(location.pathname)) {
    return null;
  }

  return <Footer />;
}

export default App;
