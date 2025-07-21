import React, { useContext, useState } from 'react';
import { useTranslation } from "react-i18next";
import { AuthContext } from '../../components/auth/AuthContext.tsx';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWeixin, faQq } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { AxiosError } from 'axios';

interface RegisterFormProps {
  onSubmit?: (username: string, password: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | React.ReactNode | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const authContext = useContext(AuthContext);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!termsAccepted || !ageConfirmed) {
      setError(t('registerForm.errors.termsNotAccepted'));
      return;
    }

    if (!authContext) {
      return;
    }

    try {
      await authContext.register(username, password);

      if (onSubmit) {
        onSubmit(username, password);
      }
    } catch (error) {
      if ((error as AxiosError).response?.status === 409) {
        setError(
          <>
            {t('registerForm.errors.emailAlreadyRegistered')}{' '}
            <Link to="/login" className={styles.errorLink}>
              {t('registerForm.footer.login')}
            </Link>
          </>
        );
      } else {
        setError(t('registerForm.errors.registrationFailed'));
      }
      console.error('Register error:', error);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.welcomeTitle}>{t('registerForm.welcome')}</h1>
        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.socialButtons}>
          <button
            type="button"
            className={styles.socialButton}
            onClick={() => handleSocialLogin('Weixin')}
          >
            <span className={styles.socialIcon}><FontAwesomeIcon icon={faWeixin} /></span>
            {t('registerForm.socialLogin.wechat')}
          </button>

          <button
            type="button"
            className={styles.socialButton}
            onClick={() => handleSocialLogin('QQ')}
          >
            <span className={styles.socialIcon}><FontAwesomeIcon icon={faQq} /></span>
            {t('registerForm.socialLogin.qq')}
          </button>
        </div>

        <div className={styles.divider}>
          <span className={styles.dividerLine}></span>
          <span className={styles.dividerText}>{t('registerForm.divider')}</span>
          <span className={styles.dividerLine}></span>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="login" className={styles.formLabel}>{t('registerForm.form.email.label')}</label>
            <input
              type="email"
              id="login"
              className={styles.formInput}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('registerForm.form.email.placeholder')}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>{t('registerForm.form.password.label')}</label>
            <input
              type="password"
              id="password"
              className={styles.formInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('registerForm.form.password.placeholder')}
              required
            />
          </div>

          <div className={styles.checkboxGroup}>
            <div className={styles.checkboxItem}>
              <input
                type="checkbox"
                id="termsCheckbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
              />
              <label htmlFor="termsCheckbox">
                {t('registerForm.terms.agreement')}{' '}
                <a href="/terms">{t('registerForm.terms.termsOfService')}</a>{' '}
                {t('registerForm.terms.and')}{' '}
                <a href="/privacy">{t('registerForm.terms.privacyPolicy')}</a>
              </label>
            </div>

            <div className={styles.checkboxItem}>
              <input
                type="checkbox"
                id="ageCheckbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                required
              />
              <label htmlFor="ageCheckbox">
                {t('registerForm.ageConfirmation')}
              </label>
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            {t('registerForm.submitButton')}
          </button>
        </form>

        <div className={styles.formFooter}>
          <p className={styles.signupPrompt}>
            {t('registerForm.footer.prompt')}{' '}
            <Link to="/login" className={styles.signupLink}>{t('registerForm.footer.login')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;