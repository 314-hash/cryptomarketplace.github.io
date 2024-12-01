import Web3 from 'web3';
import { BrowserProvider } from 'ethers';

class WalletService {
  constructor() {
    this.web3 = null;
    this.provider = null;
    this.account = null;
    this.chainId = null;
    this.networkName = null;
  }

  async initialize() {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      // Create Web3 instance
      this.web3 = new Web3(window.ethereum);
      this.provider = new BrowserProvider(window.ethereum);

      // Request account access
      await this.requestAccounts();

      // Set up event listeners
      this.setupEventListeners();

      return {
        account: this.account,
        chainId: this.chainId,
        networkName: this.networkName,
      };
    } catch (error) {
      console.error('Failed to initialize wallet:', error);
      throw error;
    }
  }

  async requestAccounts() {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      this.account = accounts[0];
      
      // Get network information
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      this.updateNetwork(chainId);

      return this.account;
    } catch (error) {
      console.error('Failed to request accounts:', error);
      throw error;
    }
  }

  setupEventListeners() {
    window.ethereum.on('accountsChanged', (accounts) => {
      this.account = accounts[0];
      window.dispatchEvent(new CustomEvent('walletAccountChanged', {
        detail: { account: this.account }
      }));
    });

    window.ethereum.on('chainChanged', (chainId) => {
      this.updateNetwork(chainId);
      window.dispatchEvent(new CustomEvent('walletNetworkChanged', {
        detail: { 
          chainId: this.chainId,
          networkName: this.networkName
        }
      }));
    });

    window.ethereum.on('disconnect', () => {
      this.account = null;
      this.chainId = null;
      this.networkName = null;
      window.dispatchEvent(new CustomEvent('walletDisconnected'));
    });
  }

  updateNetwork(chainId) {
    this.chainId = chainId;
    this.networkName = this.getNetworkName(chainId);
  }

  getNetworkName(chainId) {
    const networks = {
      '0x1': 'Ethereum Mainnet',
      '0x3': 'Ropsten',
      '0x4': 'Rinkeby',
      '0x5': 'Goerli',
      '0x2a': 'Kovan',
      '0x89': 'Polygon',
      '0x13881': 'Mumbai',
    };
    return networks[chainId] || 'Unknown Network';
  }

  async getBalance() {
    if (!this.account) {
      throw new Error('No account connected');
    }
    const balance = await this.web3.eth.getBalance(this.account);
    return this.web3.utils.fromWei(balance, 'ether');
  }

  async signMessage(message) {
    if (!this.account) {
      throw new Error('No account connected');
    }
    try {
      const signer = await this.provider.getSigner();
      return await signer.signMessage(message);
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw error;
    }
  }

  async sendTransaction(to, value, data = '') {
    if (!this.account) {
      throw new Error('No account connected');
    }
    try {
      const signer = await this.provider.getSigner();
      const tx = await signer.sendTransaction({
        to,
        value: this.web3.utils.toWei(value.toString(), 'ether'),
        data,
      });
      return tx;
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw error;
    }
  }

  disconnect() {
    this.account = null;
    this.chainId = null;
    this.networkName = null;
    window.dispatchEvent(new CustomEvent('walletDisconnected'));
  }

  isConnected() {
    return !!this.account;
  }
}

// Create a singleton instance
const walletService = new WalletService();

export default walletService;
