function SubmitButton({ className, type = "submit", text, ...buttonProps }) {
    return (
        <button className={className} type={type} {...buttonProps}>{text}</button>
    )
}

export default SubmitButton;
