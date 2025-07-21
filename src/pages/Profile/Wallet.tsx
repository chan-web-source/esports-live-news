import React from 'react';
import { useTranslation } from "react-i18next";
import { ArrowUp, ArrowLeftRight, ArrowDownToLine } from 'lucide-react';
import styles from './wallet-style.module.css';

interface WalletProps {
  balance: number;
  currencies: {
    name: string;
    symbol: string;
    price: number;
    change: number;
    amount: number;
    value: number;
  }[];
}

const Wallet: React.FC<WalletProps> = ({ balance, currencies }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.balanceSection}>
        <h1 className={styles.balanceTitle}>{t('wallet.walletBalanceTitle')}</h1>
        <div className={styles.balanceAmount}>
          <span className={styles.currencySymbol}>$</span>
          <span className={styles.balanceValue}>
            {Math.floor(balance).toString()}
            <span className={styles.balanceCents}>
              .{(balance % 1).toFixed(2).substring(2)}
            </span>
          </span>
        </div>
      </div>

      <div className={styles.actionButtons}>
        <div className={styles.actionButton}>
          <div className={styles.actionIcon}>
            <ArrowDownToLine size={24} color="#fff" />
          </div>
          <span className={styles.actionText}>{t('wallet.walletDeposit')}</span>
        </div>
        <div className={styles.actionButton}>
          <div className={styles.actionIcon}>
            <ArrowUp size={24} color="#fff" />
          </div>
          <span className={styles.actionText}>{t('wallet.walletWithdraw')}</span>
        </div>
        <div className={styles.actionButton}>
          <div className={styles.actionIcon}>
            <ArrowLeftRight size={24} color="#fff" />
          </div>
          <span className={styles.actionText}>{t('wallet.walletTransfer')}</span>
        </div>
      </div>

      <div className={styles.currenciesList}>
        {currencies.map((currency, index) => (
          <div key={index} className={styles.currencyItem}>
            <div className={styles.currencyInfo}>
              <div
                className={styles.currencyIcon}
              >
                {currency.name === 'USDT' ? (
                  <img src="/img/crypto/usdt.svg" alt="USDT" width={36} />
                ) : currency.name === 'BTC' ? (
                  <img src="/img/crypto/btc.svg" alt="BTC" width={36} />
                ) : currency.name === 'TRX' ? (
                  <img src="/img/crypto/trx.svg" alt="TRX" width={36} />
                ) : currency.name === 'ETH' ? (
                  <img src="/img/crypto/eth.svg" alt="ETH" width={36} />
                ) : null}
              </div>
              <div className={styles.currencyDetails}>
                <div className={styles.currencyName}>{currency.name}</div>
                <div className={styles.currencyPriceInfo}>
                  <span className={styles.currencyPrice}>
                    ${currency.name === 'Bitcoin' ? currency.price.toLocaleString() : currency.price.toFixed(2)}
                  </span>
                  {currency.change !== 0 && (
                    <span className={`${styles.currencyChange} ${currency.change < 0 ? styles.negative : styles.positive}`}>
                      {currency.change < 0 ? '↓' : '↑'} {Math.abs(currency.change).toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.currencyValue}>
              <div className={styles.currencyValueAmount}>
                ${currency.value.toFixed(2)}
              </div>
              <div className={styles.currencyValueSymbol}>
                {currency.amount > 0 ? `${currency.amount} ${currency.symbol}` : `0 ${currency.symbol}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wallet;