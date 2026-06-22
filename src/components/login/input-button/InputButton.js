import "./InputButton.css";

function InputButton({ className = "", ...props }) {
    return (
        <input {...props} className={["login-input", className].filter(Boolean).join(" ")} />
    );
}

export default InputButton;
