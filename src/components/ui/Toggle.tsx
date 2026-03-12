
type ToggleProps = {
    checked: boolean;
    onChange: (value: boolean) => void;
    label?: string;
}

const Toggle = ({ checked, onChange, label }: ToggleProps) => {
    return (
        <label className="toggle">
            <span>{label}</span>
            <button
                type="button"
                className={`toggle__track ${checked ? "toggle__track--active" : ""}`}
                onClick={() => onChange(!checked)}
                aria-pressed={checked}
            >
                <span className={`toggle__thumb ${checked ? "toggle__thumb--active" : ""}`} />
            </button>
        </label>
    )
}

export default Toggle