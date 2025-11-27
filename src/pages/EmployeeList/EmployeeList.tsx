import React, { useEffect, useState } from 'react';
import styles from "./employeeList.module.scss"
import type { Employee } from '../../types/employee';
import { employeeService } from '../../service/api';

const ITEMS_PER_PAGE = 6;

const EmployeePage: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEmployees = async () => {
        setLoading(true);
        setError(null);

        try {
            const basicInfo = await employeeService.getAllBasicInfo();
            const details = await employeeService.getAllDetails();

            const mergedEmployees: Employee[] = basicInfo.map(basic => {
                const detail = details.find(d => d.email === basic.email);
                return {
                    ...basic,
                    photo: detail?.photo || '',
                    employmentType: detail?.employmentType || 'N/A',
                    location: detail?.location || 'N/A',
                    notes: detail?.notes || '',
                };
            });

            setAllEmployees(mergedEmployees);
            setTotalPages(Math.ceil(mergedEmployees.length / ITEMS_PER_PAGE));


        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (allEmployees.length > 0) {
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            setEmployees(allEmployees.slice(startIndex, endIndex));
        }
    }, [currentPage, allEmployees]);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    return (
        <div className={styles.container}>
            {
                loading && (
                    <div className={styles.loading}>Loading employees...</div>
                )
            }
            {
                error && (
                    <div className={styles.error}>
                        <h2>Error</h2>
                        <p>{error}</p>
                    </div>
                )
            }
            {
                !loading && !error && (
                    <>
                        <div className={styles.header}>
                            <h1>Employee Directory</h1>
                            <p className={styles.subtitle}>
                                Showing {employees.length} employee
                                {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
                            </p>
                        </div>
                        {
                            employees.length === 0 ? (
                                <div className={styles.empty}>
                                    <h3>No employees found</h3>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.grid}>
                                        {
                                            employees.map((item) => (
                                                <div key={item.id || item.email} className={styles.card}>
                                                    <div className={styles.cardHeader}>
                                                        {item.photo ? (
                                                            <img
                                                                src={item.photo}
                                                                alt={item.fullName}
                                                                className={styles.avatar}
                                                            />
                                                        ) : (
                                                            <div className={styles.avatarPlaceholder}>
                                                                {item.fullName.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className={styles.cardBody}>
                                                        <h3 className={styles.name}>{item.fullName}</h3>
                                                        <p className={styles.email}>{item.email}</p>

                                                        <div className={styles.details}>
                                                            <div className={styles.detailItem}>
                                                                <span className={styles.label}>ID:</span>
                                                                <span className={styles.value}>{item.employeeId}</span>
                                                            </div>
                                                            <div className={styles.detailItem}>
                                                                <span className={styles.label}>Role:</span>
                                                                <span className={styles.value}>{item.role}</span>
                                                            </div>
                                                            <div className={styles.detailItem}>
                                                                <span className={styles.label}>Department:</span>
                                                                <span className={styles.value}>{item.department}</span>
                                                            </div>
                                                            <div className={styles.detailItem}>
                                                                <span className={styles.label}>Location:</span>
                                                                <span className={styles.value}>{item.location}</span>
                                                            </div>
                                                            <div className={styles.detailItem}>
                                                                <span className={styles.label}>Type:</span>
                                                                <span className={styles.value}>{item.employmentType}</span>
                                                            </div>
                                                        </div>

                                                        {item.notes && (
                                                            <p className={styles.notes}>{item.notes}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    {totalPages > 1 && (
                                        <div className={styles.pagination}>
                                            <button
                                                onClick={handlePrevPage}
                                                disabled={currentPage === 1}
                                                className={styles.paginationButton}
                                            >
                                                ← Previous
                                            </button>
                                            <span className={styles.pageInfo}>
                                                Page {currentPage} of {totalPages}
                                            </span>
                                            <button
                                                onClick={handleNextPage}
                                                disabled={currentPage === totalPages}
                                                className={styles.paginationButton}
                                            >
                                                Next →
                                            </button>
                                        </div>
                                    )}
                                </>
                            )
                        }
                    </>
                )
            }
        </div>
    )
}

export default EmployeePage;