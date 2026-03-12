type SliderProps = {
    label: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (value: number) => void;
}

const Slider = ({ label, min, max, step, value, onChange }: SliderProps) => {
    return (
        <label className="form-control">
            <div className="form-control__row">
                <span>{label}</span>
                <span>{value}</span>
            </div>

            <input
                className="slider"
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
            />
        </label>
    )
}

export default Slider