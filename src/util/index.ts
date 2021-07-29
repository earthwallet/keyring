import { Client as bnbClient } from '@xchainjs/xchain-binance';
import { Client as btcClient } from '@xchainjs/xchain-bitcoin';
import { Client as bchClient } from '@xchainjs/xchain-bitcoincash';
import { Network } from '@xchainjs/xchain-client';
import { Client as ethClient } from '@xchainjs/xchain-ethereum';
import { Client as ltcClient } from '@xchainjs/xchain-litecoin';
import { Client as polkaClient } from '@xchainjs/xchain-polkadot';

import type { EarthBalance } from '../types';

import {
  getBalance as getBalanceICP,
  getTransactions as getTransactionsICP,
  sendICP,
} from './icp';

export const send = async (id, to_aid, from_sub, amount, symbol) => {
  let hash;
  if (symbol === 'ICP') {
    hash = await sendICP(id, to_aid, from_sub, amount);
  }
  return hash;
};

export const getBalance = async (
  address: string,
  symbol: string
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
      phrase:
        'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
    });
    console.log(address, symbol, 'getBalance');
    const _balance = await _client.getBalance(address);
    balance = {
      value: _balance[0] && _balance[0].amount.amount().toNumber(),
      currency: {
        symbol: symbol,
        decimals: _balance[0].amount.decimal,
      },
    };
    console.log(JSON.stringify(_balance), 'getBalance');
  } /* else if (symbol === 'DOT') {
    const _client = new polkaClient({ network: 'mainnet' as Network });
    balance = await _client.getBalance(address);
  } else if (symbol === 'KSM') {
    const _client = new polkaClient({ network: 'mainnet' as Network });
    balance = await _client.getBalance(address);
  } */ else if (symbol === 'BTC') {
    const _client = new btcClient({ network: 'mainnet' as Network });
    const _balance = await _client.getBalance(address);
    balance = {
      value: _balance[0].amount.amount().toNumber(),
      currency: {
        symbol: symbol,
        decimals: _balance[0].amount.decimal,
      },
    };
  } /* else if (symbol === 'BCH') {
    const _client = new bchClient({ network: 'mainnet' as Network });
    balance = await _client.getBalance(address);
  } else if (symbol === 'ATOM') {
    const _client = new cosmosClient({ network: 'mainnet' as Network });
    balance = await _client.getBalance(address);
  } else if (symbol === 'RUNE') {
    const _client = new thorClient({ network: 'mainnet' as Network });
    balance = await _client.getBalance(address);
  } else if (symbol === 'ETH') {
    const _client = new ethClient({ network: 'mainnet' as Network });
    balance = await _client.getBalance(address);
  } else if (symbol === 'LTC') {
    const _client = new ltcClient({ network: 'mainnet' as Network });
    balance = await _client.getBalance(address);
  } */

  return balance;
};

export const getTransactions = async (address, symbol) => {
  let txns = {};
  if (symbol === 'ICP') {
    txns = await getTransactionsICP(address);
  } else if (symbol === 'BNB') {
    const _client = new bnbClient({ network: 'mainnet' as Network });
    txns = await _client.getTransactions({ address });
  } else if (symbol === 'DOT') {
    const _client = new polkaClient({ network: 'mainnet' as Network });
    txns = await _client.getTransactions({ address });
  } else if (symbol === 'KSM') {
    const _client = new polkaClient({ network: 'mainnet' as Network });
    txns = await _client.getTransactions({ address });
  } else if (symbol === 'BTC') {
    const _client = new btcClient({ network: 'mainnet' as Network });
    txns = await _client.getTransactions({ address });
  } else if (symbol === 'BCH') {
    const _client = new bchClient({ network: 'mainnet' as Network });
    txns = await _client.getTransactions({ address });
  } else if (symbol === 'ETH') {
    const _client = new ethClient({ network: 'mainnet' as Network });
    txns = await _client.getTransactions({ address });
  } else if (symbol === 'LTC') {
    const _client = new ltcClient({ network: 'mainnet' as Network });
    txns = await _client.getTransactions({ address });
  }
  return txns;
};
