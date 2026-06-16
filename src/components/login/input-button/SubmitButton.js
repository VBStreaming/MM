function SubmitButton(props) {
    return (
        <button className={props.className} type={props.type || "submit"}>{props.text}</button>
    )
}

export default SubmitButton;
