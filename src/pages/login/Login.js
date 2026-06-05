import InputButton from "../../components/login/input-button/InputButton";
import {useState} from "react";
import SubmitButton from "../../components/login/input-button/SubmitButton";

function Login() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const onChangeId = (e) => {
        setId(e.target.value);
    };
    const onChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const loginIdProps = {
        value: id,
        onChange: onChangeId,
        placeholder: "아이디를 입력하세요."
    };
    const passwordProps = {
        value: password,
        onChange: onChangePassword,
        type: "password",
        placeholder: "비밀번호를 입력하세요."
    };

    return (
        <div>
            <h1>Login</h1>
            <h2>아이디</h2>
            <InputButton {...loginIdProps} />
            <h2>비밀번호</h2>
            <InputButton {...passwordProps} />

            <SubmitButton />
        </div>
    );
}

export default Login;
