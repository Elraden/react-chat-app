type ErrorMessageProps = {
    message: string
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
    return (
        <div className="error-message" role="alert">
            <span className="error-message__icon">Error Icon</span>
            <span>{message}</span>

        </div>
    )
}

export default ErrorMessage