import React, { useContext, useState } from 'react';
import { useTranslation } from "react-i18next";
import { AuthContext } from '../../components/auth/AuthContext.tsx';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWeixin, faQq } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

interface LoginFormProps {
  onSubmit?: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Do nothing if authContext not ready
    if (!authContext) {
      return;
    }

    try {
      await authContext.login(username, password);

      // Call the onSubmit prop to notify parent component
      if (onSubmit) {
        onSubmit(username, password);
      }
    } catch (error) {
      setError(t('loginForm.loginFailed'));
      console.error('Login error:', error);
    }
  };


  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    // Implement social login logic here
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.welcomeTitle}>{t('loginForm.welcomeTitle')}</h1>
        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.socialButtons}>
          <button
            type="button"
            className={styles.socialButton}
            onClick={() => handleSocialLogin('Weixin')}
          >
            <span className={styles.socialIcon}><FontAwesomeIcon icon={faWeixin} /></span>
            {t('loginForm.weixinLogin')}
          </button>

          <button
            type="button"
            className={styles.socialButton}
            onClick={() => handleSocialLogin('QQ')}
          >
            <span className={styles.socialIcon}><FontAwesomeIcon icon={faQq} /></span>
            {t('loginForm.qqLogin')}
          </button>
        </div>

        <div className={styles.divider}>
          <span className={styles.dividerLine}></span>
          <span className={styles.dividerText}>{t('loginForm.or')}</span>
          <span className={styles.dividerLine}></span>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="login" className={styles.formLabel}>{t('loginForm.email')}</label>
            <input
              type="email"
              id="login"
              className={styles.formInput}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>{t('loginForm.password')}</label>
            <input
              type="password"
              id="password"
              className={styles.formInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            {t('loginForm.signIn')}
          </button>
        </form>

        <div className={styles.formFooter}>
          <a href="#forgot" className={styles.forgotLink}>
            {t('loginForm.forgotPassword')}
          </a>

          <p className={styles.signupPrompt}>
            {t('loginForm.noAccount')} <Link to="/register" className={styles.signupLink}>{t('loginForm.signUp')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;