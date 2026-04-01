import { useState } from "react";
import { scopeOptions } from "../../data/mocks";
import type { ScopeType } from "../../features/chat/model/types";
import Button from "../ui/Button";
import ErrorMessage from "../ui/ErrorMessage";

type AuthFormProps = {
    onLogin: () => void;
};

const AuthForm = ({ onLogin }: AuthFormProps) => {
    const [credentials, setCredentials] = useState("");
    const [scope, setScope] = useState<ScopeType>("GIGACHAT_API_PERS");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!credentials.trim()) {
            setError("Поле Credentials не должно быть пустым.");
            return;
        }

        setError("");
        console.log("Mock auth:", { credentials, scope });
        onLogin();
    };

    return (
        <div className="auth-page">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Вход</h1>

                <label className="form-control">
                    <span>Credentials (Base64)</span>
                    <input
                        type="password"
                        value={credentials}
                        onChange={(e) => setCredentials(e.target.value)}
                        placeholder="Введите credentials"
                    />
                </label>

                <fieldset className="form-control">
                    <legend>Scope</legend>

                    <div className="radio-group">
                        {scopeOptions.map((item) => (
                            <label key={item} className="radio-option">
                                <input
                                    type="radio"
                                    name="scope"
                                    value={item}
                                    checked={scope === item}
                                    onChange={() => setScope(item)}
                                />
                                <span>{item}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                {error && <ErrorMessage message={error} />}

                <Button type="submit" variant="primary">
                    Войти
                </Button>
            </form>
        </div>
    );
}

export default AuthForm;