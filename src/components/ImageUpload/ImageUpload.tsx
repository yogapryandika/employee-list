import React, { useRef, useState } from 'react';
import styles from './ImageUpload.module.scss';

interface ImageUploadProps {
    label: string;
    value: string;
    onChange: (base64: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ label, value, onChange }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (file: File | null) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            onChange(base64String);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        handleFileChange(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemove = () => {
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={styles.wrapper}>
            <label className={styles.label}>{label}</label>

            {value ? (
                <div className={styles.preview}>
                    <img src={value} alt="Preview" className={styles.image} />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className={styles.removeButton}
                    >
                        Remove
                    </button>
                </div>
            ) : (
                <div
                    className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={handleClick}
                >
                    <svg
                        className={styles.icon}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>
                    <p className={styles.text}>
                        Drag and drop an image, or click to select
                    </p>
                    <p className={styles.subtext}>PNG, JPG up to 5MB</p>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                className={styles.hiddenInput}
            />
        </div>
    );
};
