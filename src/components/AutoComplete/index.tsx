import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { employeeService } from '../../service/api';
import styles from './autocomplete.module.scss';

interface AsyncAutocompleteProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    fetchUrl: string;
    placeholder?: string;
    required?: boolean;
}

interface Suggestion {
    id: string;
    name: string;
}

const Autocomplete: React.FC<AsyncAutocompleteProps> = ({
    label,
    value,
    onChange,
    fetchUrl,
    placeholder = '',
    required = false,
}) => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const debouncedValue = useDebounce(value, 300);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (debouncedValue.length === 0) {
            setSuggestions([]);
            setIsOpen(false);
            return;
        }

        const fetchSuggestions = async () => {
            setIsLoading(true);
            try {
                const data = await employeeService.fetchSuggestions<Suggestion[]>(fetchUrl, debouncedValue);
                setSuggestions(data);
                setIsOpen(data.length > 0);
            } catch (error) {
                console.error('Failed to fetch suggestions:', error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuggestions();
    }, [debouncedValue, fetchUrl]);

    const handleSelect = (suggestion: Suggestion) => {
        onChange(suggestion.name);
        setIsOpen(false);
        setHighlightedIndex(-1);
    };

    return (
        <div className={styles.wrapper} ref={wrapperRef}>
            <label className={styles.label}>
                {label}
                {required && <span className={styles.required}>*</span>}
            </label>
            <input
                type="text"
                className={styles.input}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                autoComplete="off"
                aria-expanded={isOpen}
            />
            {isLoading && <div className={styles.loading}>Loading...</div>}
            {isOpen && suggestions.length > 0 && (
                <ul
                    id="autocomplete-listbox"
                    className={styles.dropdown}
                    role="listbox"
                >
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={suggestion.id}
                            className={`${styles.item} ${index === highlightedIndex ? styles.highlighted : ''
                                }`}
                            onClick={() => handleSelect(suggestion)}
                            role="option"
                            aria-selected={index === highlightedIndex}
                        >
                            {suggestion.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Autocomplete;
