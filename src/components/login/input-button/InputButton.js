import "./InputButton.css";
import { forwardRef } from "react";

const InputButton = forwardRef(function InputButton({ className = "", ...props }, ref) {
    return (
        <input ref={ref} {...props} className={["login-input", className].filter(Boolean).join(" ")} />
    );
});

export default InputButton;
