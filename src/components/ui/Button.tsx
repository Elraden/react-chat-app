import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode,
    variant?: "primary" | "secondary" | "ghost" | "danger";
};

const Button = ({
    children, variant = "primary", className = "", ...props
}: ButtonProps) => {
    return (
        <button className={`btn btn--${variant} ${className}`.trim()} {...props}>
            {children}
        </button>
    )
}

export default Button