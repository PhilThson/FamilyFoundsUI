import type { ComponentProps } from "react";
interface InputGroupProps extends ComponentProps<"input"> {
  id: string;
  name: string;
}

const UserInput: React.FC<InputGroupProps> = ({ id, name, ...rest }) => {
  return (
    <div>
      <label htmlFor={id}>{name}</label>
      <input id={id} {...rest} />
    </div>
  );
};

export default UserInput;
