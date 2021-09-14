import { Client as bnbClient } from '@xchainjs/xchain-binance';
import { Client as btcClient, BTC_DECIMAL } from '@xchainjs/xchain-bitcoin';
import { Client as bchClient } from '@xchainjs/xchain-bitcoincash';
import { Network } from '@xchainjs/xchain-client';
import { Client as ethClient, ETH_DECIMAL } from '@xchainjs/xchain-ethereum';
import { Client as ltcClient, LTC_DECIMAL } from '@xchainjs/xchain-litecoin';
import { Client as polkaClient } from '@xchainjs/xchain-polkadot';
import { baseAmount, AssetBTC, AssetLTC } from '@xchainjs/xchain-util';
import BigNumber from 'bignumber.js';
import { TxsPage, Tx, Fees } from '@xchainjs/xchain-client';

import type { EarthBalance } from '../types';

import {
  getBalance as getBalanceICP,
  getTransactions as getTransactionsICP,
  sendICP,
} from './icp';

export const send = async (identity, to_aid, from_sub, amount, symbol) => {
  let hash;
  if (symbol === 'ICP') {
    hash = await sendICP(identity, to_aid, from_sub, amount);
  }
  return hash;
};

export const transfer = async (
  recipient: string,
  amount: string,
  fromMnemonic: string,
  symbol: string,
  options?: Record<string, unknown>
): Promise<string> => {
  if (symbol === 'ETH') {
    const _amount = new BigNumber(amount).shiftedBy(ETH_DECIMAL);
    const _ethClient = new ethClient({
      network: (options?.network as Network) || ('testnet' as Network),
      phrase: fromMnemonic,
      ethplorerUrl: options?.ethplorerUrl as string,
      ethplorerApiKey: options?.ethplorerApiKey as string,
      etherscanApiKey: options?.etherscanApiKey as string,
    });
    const gasFee = await _ethClient.estimateFeesWithGasPricesAndLimits({
      recipient,
      amount: baseAmount(_amount, ETH_DECIMAL),
    });

    const txHash = await _ethClient.transfer({
      recipient,
      amount: baseAmount(_amount),
      gasLimit: gasFee.gasLimit,
      gasPrice: gasFee.gasPrices.average,
    });

    return txHash;
  } else if (symbol === 'BTC') {
    const _amount = new BigNumber(amount).shiftedBy(BTC_DECIMAL);
    const _btcClient = new btcClient({
      network: (options?.network as Network) || ('testnet' as Network),
      phrase: fromMnemonic,
    });

    const txHash = await _btcClient.transfer({
      asset: AssetBTC,
      recipient,
      amount: baseAmount(_amount),
    });

    return txHash;
  } else if (symbol === 'LTC') {
    const _amount = new BigNumber(amount).shiftedBy(LTC_DECIMAL);
    const _ltcClient = new ltcClient({
      network: (options?.network as Network) || ('testnet' as Network),
      phrase: fromMnemonic,
    });

    const txHash = await _ltcClient.transfer({
      asset: AssetLTC,
      recipient,
      amount: baseAmount(_amount),
    });

    return txHash;
  }
  return '';
};

/* const TEST_MNE_0 =
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
 */
const TEST_MNE_1 =
  'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano';

export const getBalance = async (
  address: string,
  symbol: string,
  options?: Record<string, unknown>
): Promise<EarthBalance> => {
  let balance = {
    value: 0,
    currency: {
      symbol: symbol,
      decimals: 0,
    },
  };

  if (symbol === 'ICP') {
    balance = await getBalanceICP(address);
  } else if (symbol === 'BNB') {
    const _client = new bnbClient({
      network: 'mainnet' as Network,
      phrase: TEST_MNE_1,
    });
    const _balance = await _client.getBalance(address);
    balance = {
      value: _balance[0] && _balance[0].amount.amount().toNumber(),
      currency: {
        symbol: symbol,
        decimals: _balance[0].amount.decimal,
      },
    };
  } else if (symbol === 'DOT') {
    const _client = new polkaClient({
      network: 'mainnet' as Network,
      phrase: TEST_MNE_1,
    });
    const _balance = await _client.getBalance(address);
    balance = {
      value: _balance[0].amount.amount().toNumber(),
      currency: {
        symbol: symbol,
        decimals: _balance[0].amount.decimal,
      },
    };
  } else if (symbol === 'KSM') {
    const _client = new polkaClient({
      network: 'mainnet' as Network,
      phrase: TEST_MNE_1,
    });
    const _balance = await _client.getBalance(address);
    balance = {
      value: _balance[0].amount.amount().toNumber(),
      currency: {
        symbol: symbol,
        decimals: _balance[0].amount.decimal,
      },
    };
  } else if (symbol === 'BTC') {
    const _client = new btcClient({
      network: 'mainnet' as Network,
      phrase: TEST_MNE_1,
    });
    const _balance = await _client.getBalance(address);
    balance = {
      value: _balance[0].amount.amount().toNumber(),
      currency: {
        symbol: symbol,
        decimals: _balance[0].amount.decimal,
      },
    };
  } else if (symbol === 'ETH') {
    const _client = new ethClient({
      network: 'mainnet' as Network,
      phrase: TEST_MNE_1,
      ethplorerUrl: options?.ethplorerUrl as string,
      ethplorerApiKey: options?.ethplorerApiKey as string,
      etherscanApiKey: options?.etherscanApiKey as string,
    });
    const _balance = await _client.getBalance(address);
    balance = {
      value: _balance[0].amount.amount().toNumber(),
      currency: {
        symbol: symbol,
        decimals: _balance[0].amount.decimal,
      },
    };
  } else if (symbol === 'BCH') {
    const _client = new bchClient({
      network: 'mainnet' as Network,
      phrase: TEST_MNE_1,
    });
    const _balance = await _client.getBalance(address);
    balance = {
      value: _balance[0].amount.amount().toNumber(),
      currency: {
        symbol: symbol,
        decimals: _balance[0].amount.decimal,
      },
    };
  } else if (symbol === 'LTC') {
    const _client = new ltcClient({
      network: 'mainnet' as Network,
      phrase: TEST_MNE_1,
    });
    const _balance = await _client.getBalance(address);
    balance = {
      value: _balance[0].amount.amount().toNumber(),
      currency: {
        symbol: symbol,
        decimals: _balance[0].amount.decimal,
      },
    };
  }

  return balance;
};

export const getTransactions = async (address, symbol): Promise<TxsPage> => {
  let txns = {} as TxsPage;
  if (symbol === 'ICP') {
    txns = await getTransactionsICP(address);
  } else if (symbol === 'BNB') {
    const _client = new bnbClient({
      network: 'mainnet' as Network,
      phrase: TEST_MNE_1,
    });
    txns = await _client.getTransactions({ address });
  } else if (symbol === 'DOT') {
    const _client = new polkaClient({
      network: 'mainnet' as Network,
      phrase: TEST_MNE_1,
    });
    txns = await _client.getTransactions({ address });
  } else if (symbol === 'KSM') {
    const _client = new polkaClient({
      network: 'mainnet' as Network,
      phrase: TEST_MNE_1,
    });
    txns = await _client.getTransactions({ address });
  } else if (symbol === 'BTC') {
    const _client = new btcClient({
      network: 'mainnet' as Network,
      phrase: TEST_MNE_1,
    });
    txns = await _client.getTransactions({ address });
  } else if (symbol === 'BCH') {
    const _client = new bchClient({
      network: 'mainnet' as Network,
      phrase: TEST_MNE_1,
    });
    txns = await _client.getTransactions({ address });
  } else if (symbol === 'ETH') {
    const _client = new ethClient({
      network: 'mainnet' as Network,
      phrase: TEST_MNE_1,
    });
    txns = await _client.getTransactions({ address });
  } else if (symbol === 'LTC') {
    const _client = new ltcClient({
      network: 'mainnet' as Network,
      phrase: TEST_MNE_1,
    });
    txns = await _client.getTransactions({ address });
  }
  return txns;
};

export const getFees = async (
  symbol: string,
  options?: Record<string, unknown>
): Promise<Fees> => {
  let fees = {} as Fees;
  if (symbol === 'BTC') {
    const _client = new btcClient({
      network: 'mainnet' as Network,
      phrase: TEST_MNE_1,
    });
    fees = await _client.getFees();

    return fees;
  }
  if (symbol === 'LTC') {
    const _client = new ltcClient({
      network: 'mainnet' as Network,
      phrase: TEST_MNE_1,
    });
    fees = await _client.getFees();

    return fees;
  } else if (symbol === 'ETH') {
    const _client = new ethClient({
      network: 'mainnet' as Network,
      phrase: TEST_MNE_1,
      ethplorerUrl: options?.ethplorerUrl as string,
      ethplorerApiKey: options?.ethplorerApiKey as string,
      etherscanApiKey: options?.etherscanApiKey as string,
    });
    fees = await _client.getFees();

    return fees;
  } else {
    return fees;
  }
};

export const getTransactionData = async (
  txId: string,
  symbol: string,
  options?: Record<string, unknown>
): Promise<Tx> => {
  let txn = {} as Tx;
  if (symbol === 'BTC') {
    const _client = new btcClient({
      network: 'mainnet' as Network,
      phrase: TEST_MNE_1,
    });
    txn = await _client.getTransactionData(txId);

    return txn;
  } else if (symbol === 'ETH') {
    const _client = new ethClient({
      network: 'mainnet' as Network,
      phrase: TEST_MNE_1,
      ethplorerUrl: options?.ethplorerUrl as string,
      ethplorerApiKey: options?.ethplorerApiKey as string,
      etherscanApiKey: options?.etherscanApiKey as string,
    });
    txn = await _client.getTransactionData(txId);

    return txn;
  } else {
    return txn;
  }
};
