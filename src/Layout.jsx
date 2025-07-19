import React from 'react';
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import Navigation from "./Components/NavigationBar/NavigationBar";


const Layout = ({ children }) => {
  return (
    <div className="App">
      <Header />
      <Navigation />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;