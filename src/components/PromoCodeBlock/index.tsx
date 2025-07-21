import React from 'react';
import { useTranslation } from "react-i18next";
import styles from './style.module.css';
import { handleOddsTypeChange } from "@/utils/handleOddsChange";
import commonStyles from '@/components/common-style.module.css';

interface PromoProps {
  bookmakerLogo: string;
  promoCode: string;
  promoText?: string;
  teams?: [Team, Team][];
  selectedOddsType?: string
}

const PromoCodeBlock: React.FC<PromoProps> = ({
  bookmakerLogo,
  promoCode,
  teams,
  selectedOddsType,

}) => {
  const { t } = useTranslation();

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(promoCode);
    alert(t('promoCodeBlock.promoCodeCopied'));
  };

  return (
    <div className={styles.container}>
      <div className={styles.bookmaker}>
        <div
          className={styles.bookmakerLogo}
          style={{ backgroundImage: `url(${bookmakerLogo})` }}
        >
          <div className={styles.logoText}>{t('promoCodeBlock.whoWillWin')}</div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.promotionBox} onClick={copyCodeToClipboard}>
          <div className={styles.promoCode}>
            {promoCode}
          </div>
          <div className={styles.promoText}>
            {t('promoCodeBlock.promoText')}
          </div>
        </div>

        {teams && (
          <div className={styles.matchesContainer}>
            {teams.map((match, matchIndex) => (
              <div key={matchIndex} className={styles.matchRow}>
                {match.map((team, teamIndex) => (
                  <div key={`${matchIndex}-${teamIndex}`} className={styles.teamOdds}>
                    <div className={styles.teamInfo}>
                      <img
                        src={team.logo}
                        alt={`${team.name} logo`}
                        className={styles.teamLogo}
                      />
                      <span className={styles.teamName}>{team.name}</span>
                    </div>
                    {(team.homeTeamAsiaOdds && selectedOddsType) &&
                      <div className={commonStyles.oddsValue}>
                        {handleOddsTypeChange(team.homeTeamAsiaOdds, selectedOddsType)}</div>
                    }
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoCodeBlock;