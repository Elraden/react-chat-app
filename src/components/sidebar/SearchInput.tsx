import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

type SearchInputProps = {
    value: string;
    onChange: (value: string) => void;
}

const SearchInput = ({ value, onChange }: SearchInputProps) => {
    return (
        <div className="search-input">
            <span className="search-input__icon">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </span>
            <input type="text"
                placeholder="Поиск чатов"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}

export default SearchInput