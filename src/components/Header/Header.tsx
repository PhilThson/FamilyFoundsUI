import React from "react";
import logo from "../../assets/logo192.png";

const Header: React.FC<{ title: string }> = ({ title }) => {
  return (
    <header>
      <h1>{title}</h1>
      <img src={logo} alt="React logo" />
    </header>
  );
};

export default Header;
