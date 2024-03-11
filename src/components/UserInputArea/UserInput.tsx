import type { ComponentProps } from "react";
import { useState } from "react";

interface InputGroupProps extends ComponentProps<"input"> {
  id: string;
  name: string;
  isValid?: boolean;
  errorText?: string;
  invalidClass?: string;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const UserInput: React.FC<InputGroupProps> = ({
  id,
  name,
  isValid,
  errorText,
  invalidClass,
  onBlur,
  ...rest
}) => {
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (!isTouched) {
      setIsTouched(true);
    }
    onBlur(event);
  };

  return (
    <div className={isValid === true ? "" : invalidClass}>
      <label htmlFor={id}>{name}</label>
      <input id={id} onBlur={handleBlur} {...rest} />
      {isValid === false && <p className="error-text">{errorText}</p>}
    </div>
  );
};

export default UserInput;
