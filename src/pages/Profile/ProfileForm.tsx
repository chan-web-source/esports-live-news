import React from 'react';
import { useTranslation } from "react-i18next";
import styles from './profile-style.module.css';
import commonStyles from '@/components/common-style.module.css';
import Spacer from '@/components/Spacer';

interface ProfileFormProps {
  email: string;
  displayName: string;
  country?: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ displayName, email }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={commonStyles.block}>
        <div className={commonStyles.heading}>{t('profileForm.overviewTitle')}</div>
        <div className={styles.overview}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatar}>
              {displayName.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
          <div className={styles.userInfo}>
            <h2>{displayName}</h2>
            <div className={styles.location}>
              <span className={styles.flag}>🇸🇬</span> Singapore
            </div>
          </div>
        </div>
      </div>
      <Spacer space={20} />
      <div className={commonStyles.block}>
        <div className={commonStyles.heading}>{t('profileForm.profileTitle')}</div>
        <form className={styles.form} method='POST'>
          <div className={styles.formGroup}>
            <label htmlFor="email">{t('profileForm.emailLabel')}</label>
            <div className={styles.inputContainer}>
              <span className={styles.lockIcon}>🔒</span>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                readOnly
                className={styles.lockedInput}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="displayName">{t('profileForm.displayNameLabel')}</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={displayName}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="newPassword">{t('profileForm.currentPasswordLabel')}</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="newPassword">{t('profileForm.newPasswordLabel')}</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">{t('profileForm.confirmPasswordLabel')}</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={styles.input}
            />
          </div>

          <button
            className={commonStyles.actionButton}
            onClick={(e) => e.preventDefault()}
            type="button"
          >
            {t('profileForm.updateButton')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;