import React from "react";

const UserInput = ({ id, name, ...props }) => {
  return (
    <div>
      <label htmlFor={id}>{name}</label>
      <input id={id} {...props} />
    </div>
  );
};

export default UserInput;
