import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud } from "@fortawesome/free-solid-svg-icons";

const EmptyState = () => {
    return (
        <div className="empty-state">
            <div className="empty-state__icon"><FontAwesomeIcon icon={faCloud} /></div>
            <h2>Начните новый диалог</h2>
            <p>Выберите существующий чат или создайте новый</p>
        </div>
    )
}

export default EmptyState