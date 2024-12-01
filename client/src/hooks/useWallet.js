import { useState, useEffect, useCallback } from 'react';
import walletService from '../services/walletService';

const useWallet = () => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [networkName, setNetworkName] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const updateWalletInfo = useCallback(async () => {
    if (walletService.isConnected()) {
      try {
        const balance = await walletService.getBalance();
        setBalance(balance);
        setAccount(walletService.getAccount());
        const { chainId, networkName } = walletService.getNetworkInfo();
        setChainId(chainId);
        setNetworkName(networkName);
      } catch (error) {
        console.error('Error updating wallet info:', error);
        setError(error.message);
      }
    }
  }, []);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      await walletService.initialize();
      await updateWalletInfo();
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    walletService.disconnect();
    setAccount(null);
    setChainId(null);
    setNetworkName(null);
    setBalance(null);
    setError(null);
  };

  const switchNetwork = async (targetChainId) => {
    try {
      setError(null);
      await walletService.switchNetwork(targetChainId);
      await updateWalletInfo();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signMessage = async (message) => {
    try {
      setError(null);
      return await walletService.signMessage(message);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const sendTransaction = async (to, value, data) => {
    try {
      setError(null);
      return await walletService.sendTransaction(to, value, data);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  useEffect(() => {
    const handleAccountsChanged = (event) => {
      setAccount(event.detail.account);
      updateWalletInfo();
    };

    const handleChainChanged = (event) => {
      setChainId(event.detail.chainId);
      setNetworkName(event.detail.networkName);
      updateWalletInfo();
    };

    const handleDisconnect = () => {
      setAccount(null);
      setChainId(null);
      setNetworkName(null);
      setBalance(null);
    };

    // Add event listeners
    window.addEventListener('walletAccountChanged', handleAccountsChanged);
    window.addEventListener('walletChainChanged', handleChainChanged);
    window.addEventListener('walletDisconnected', handleDisconnect);

    // Check if wallet is already connected
    if (walletService.isConnected()) {
      updateWalletInfo();
    }

    // Cleanup
    return () => {
      window.removeEventListener('walletAccountChanged', handleAccountsChanged);
      window.removeEventListener('walletChainChanged', handleChainChanged);
      window.removeEventListener('walletDisconnected', handleDisconnect);
    };
  }, [updateWalletInfo]);

  return {
    account,
    chainId,
    networkName,
    balance,
    isConnecting,
    error,
    isConnected: !!account,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    signMessage,
    sendTransaction,
  };
};

export default useWallet;
