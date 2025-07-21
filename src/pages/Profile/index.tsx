import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import styles from './style.module.css';
import ProfileForm from './ProfileForm';
import Header from '@/components/Header';
import BottomAds from '@/components/BottomAds';
import Spacer from '@/components/Spacer';
import Wallet from './Wallet';
import authService from '@/service/authService';
import ChatBubble from '@/components/ChatBubble';

const Profile: React.FC = () => {
  const { username } = useAuth();
  const getDisplayName = (email: string) => {
    return email?.split('@')[0] || email;
  };
  // Default wallet data
  const [walletData, setWalletData] = useState({
    balance: 0,
    currencies: [
      {
        name: 'USDT',
        symbol: 'USDT',
        price: 1.00,
        change: 0,
        amount: 0,
        value: 0.00
      },
      {
        name: 'BTC',
        symbol: 'BTC',
        price: 99420.81,
        change: 2.65,
        amount: 0,
        value: 0.00
      },
      {
        name: 'ETH',
        symbol: 'ETH',
        price: 1991.20,
        change: 9.41,
        amount: 0,
        value: 0.00
      },
      {
        name: 'TRX',
        symbol: 'TRX',
        price: 0.2501,
        change: 1.3,
        amount: 0,
        value: 0.00
      }
    ]
  });

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await authService.getWallet();
        if (response.data) {
          // Update the wallet data with real balances
          setWalletData(prevData => {
            const updatedCurrencies = prevData.currencies.map(currency => ({
              ...currency,
              amount: response.data!.balances[currency.symbol as CurrencyCode],
              value: response.data!.balances[currency.symbol as CurrencyCode] * currency.price
            }));
            
            // Find USDT currency and use its value as the total balance
            const usdtCurrency = updatedCurrencies.find(c => c.symbol === 'USDT');
            const usdtValue = usdtCurrency ? usdtCurrency.value : 0;
            
            return {
              balance: usdtValue,
              currencies: updatedCurrencies
            };
          });
        }
      } catch (error) {
        console.error('Failed to fetch wallet data:', error);
      }
    };

    fetchWalletData();
  }, []);
  
  return (
    <>
      <Header />
      <Spacer space={55} />
      <section className="container">
        <h1 className={styles.title}>{username}</h1>
        <div className={styles.container}>
          <ProfileForm email={username || ''} displayName={getDisplayName(username || '')} />
          <Wallet {...walletData} />
        </div>
        <Spacer space={60} />
      </section>
      <BottomAds />
      <ChatBubble />
    </>
  );
};

export default Profile;