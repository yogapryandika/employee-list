import { Link, Outlet } from "react-router-dom";
import styles from "./layout.module.scss"
import { Suspense } from "react";

const Layout = () => {
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>👥</span>
            <span className={styles.logoText}>Employee Wizard</span>
          </Link>
          <div className={styles.navLinks}>
            <Link to="/wizard?role=admin" className={styles.navLink}>
              Add Employee
            </Link>
            <Link to="/employees" className={styles.navLink}>
              View Employees
            </Link>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>

    </div>
  );
};

export default Layout;