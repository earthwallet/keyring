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

export const getBalance = async (address, symbol) => {
  let balance = {};
  if (symbol === 'ICP') {
    balance = await getBalanceICP(address);
  }
  return balance;
};

export const getTransactions = async (address, symbol) => {
  let txns = {};
  if (symbol === 'ICP') {
    txns = await getTransactionsICP(address);
  }
  return txns;
};
