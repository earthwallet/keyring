/* eslint-disable @typescript-eslint/no-explicit-any */
/* esleslint-disable  prefer-const */

import { Actor, HttpAgent } from '@dfinity/agent';
import { key_new, Session } from '@dfinity/rosetta-client';
import { address_from_hex } from '@dfinity/rosetta-client';
import { sha224 } from '@dfinity/rosetta-client/lib/hash';
import axios, { AxiosRequestConfig } from 'axios';
import ledger from './candid/ledger.did';
import fetch from 'cross-fetch';

export { address_to_hex } from '@dfinity/rosetta-client';
import { TxsPage } from '@xchainjs/xchain-client';
import { Principal } from '@dfinity/principal';
import { getAllUserNFTs, NFTCollection } from '@earthgohan/dab-js';
import {
  ICP_HOST,
  ICP_NETWORK_IDENTIFIER,
  LEDGER_CANISTER_ID,
  ROSETTA_URL,
} from './constants';
import { default as IDL_EXT } from './candid/ext.did';
import { Identity } from '@dfinity/agent';
import { address_to_hex } from '@dfinity/rosetta-client';

//https://github.com/dfinity/agent-js/blob/6e8c64cf07c7722aafbf52351eb0f19fcb954ff0/packages/identity-ledgerhq/src/identity/secp256k1.ts

export const getBalance = async (address) => {
  let serverRes = {
    value: 0,
    currency: {
      symbol: 'ICP',
      decimals: 0,
    },
  };

  const data = {
    network_identifier: ICP_NETWORK_IDENTIFIER,
    account_identifier: {
      address: address,
    },
  };

  const config: AxiosRequestConfig = {
    method: 'post',
    url: `${ROSETTA_URL}/account/balance`,
    headers: {
      accept: 'application/json, text/plain, */*',
    },
    data: data,
  };

  await axios(config)
    .then(function (response) {
      serverRes = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  return serverRes;
};

export const getTransactions = async (address): Promise<TxsPage> => {
  let serverRes = { total_count: 0, transactions: [] };
  const txns = {} as TxsPage;
  const data = {
    network_identifier: ICP_NETWORK_IDENTIFIER,
    account_identifier: {
      address: address,
    },
  };

  const config: AxiosRequestConfig = {
    method: 'post',
    url: `${ROSETTA_URL}/search/transactions`,
    headers: {
      accept: 'application/json, text/plain, */*',
    },
    data: data,
  };

  await axios(config)
    .then(function (response) {
      serverRes = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  txns.total = serverRes?.total_count;
  txns.txs = serverRes?.transactions;
  return txns;
};

/**
 *
 * @param {String} src_private_key
 * hex of derived child private key of character length 64 and buffer size 32 bytes
 * @param {String} dest_addr
 * e.g 07b1b5f1f023eaa457a6d63fe00cea8cae5c943461350de455cb2d1f3dec8992
 * @param {BigInt} amount
 * Specifies the number of ICP tokens to transfer. Can be specified as a number with up to eight (8) decimal places.
 * @param {BigInt?} max_fee
 * Specifies a transaction fee. The default is 10000 e8s i.e 0.0001 ICP .
 * @param {object} opts
 * @returns {Promise<TransactionIdentifierResponse>}
 */

export const sendTransaction = async (src_private_key, dest_addr, amount) => {
  const session = new Session({
    baseUrl: ROSETTA_URL,
  });

  const _src_private_key = key_new(Buffer.from(src_private_key, 'hex'));
  const _dest_addr_buff = address_from_hex(dest_addr);

  let submit_result;

  try {
    submit_result = await session.transfer(
      _src_private_key,
      _dest_addr_buff,
      amount
    );
  } catch (error) {
    console.log(error);
  }

  return submit_result;
};

const getSubAccountArray = (s) => {
  return Array(28)
    .fill(0)
    .concat(to32bits(s ? s : 0));
};
const to32bits = (num) => {
  const b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, num);
  return Array.from(new Uint8Array(b));
};

export const sendICP = async (identity, to_aid, from_sub, amount) => {
  const agent = await Promise.resolve(
    new HttpAgent({
      host: ICP_HOST,
      fetch,
      identity: identity,
    })
  ).then(async (ag) => {
    // await ag.fetchRootKey();
    return ag;
  });

  const API = Actor.createActor(ledger, {
    agent: agent,
    canisterId: LEDGER_CANISTER_ID,
  });

  const b = await API.send_dfx({
    to: to_aid,
    fee: { e8s: 10000 },
    memo: 0,
    from_subaccount: [getSubAccountArray(from_sub)],
    created_at_time: [],
    amount: { e8s: Math.floor(amount * 100000000) },
  });
  return b;
};

export const utf8ToBytes = (str: string): Uint8Array => {
  const isString = (obj: any): boolean => {
    return obj === `${obj}`;
  };
  if (!isString(str)) {
    throw new Error(`${str} is not string`);
  }
  const arr = [];
  for (let i = 0; i < str.length; i++) {
    arr.push(str.charCodeAt(i));
  }
  return new Uint8Array(arr);
};

export const SUB_ACCOUNT_ZERO = Buffer.alloc(32);
export const ACCOUNT_DOMAIN_SEPERATOR = Buffer.from('\x0Aaccount-id');

export const principal_id_to_address_buffer = (pid) => {
  return sha224([
    ACCOUNT_DOMAIN_SEPERATOR,
    pid.toUint8Array(),
    SUB_ACCOUNT_ZERO,
  ]);
};

export const indexToHash = async (index: BigInt | number) => {
  let serverRes = { block: { transactions: [] } };
  const data = {
    network_identifier: ICP_NETWORK_IDENTIFIER,
    block_identifier: { index: Number(index) },
  };

  const config: AxiosRequestConfig = {
    method: 'post',
    url: `${ROSETTA_URL}/block`,
    headers: {
      accept: 'application/json, text/plain, */*',
    },
    data: data,
  };

  await axios(config)
    .then(function (response) {
      serverRes = response.data;
    })
    .catch(function (error) {
      console.log(error);
      return null;
    });

  return serverRes?.block?.transactions[0]?.transaction_identifier?.hash;
};

export const stringifyBigInt = (data) =>
  JSON.stringify(data, (_, value) =>
    typeof value === 'bigint' ? value.toString() + 'n' : value
  );

export const getNFTCollections = async (
  principal: string
): Promise<NFTCollection[]> => {
  const agent = await Promise.resolve(
    new HttpAgent({
      host: ICP_HOST,
      fetch,
    })
  ).then(async (ag) => {
    await ag.fetchRootKey();
    return ag;
  });

  const collections = await getAllUserNFTs(
    agent,
    Principal.fromText(principal)
  );

  return collections;
};

export const getNFTsFromCanisterExt = async (
  canisterId: string,
  accountId: string
) => {
  //const fetchWallet = await createWallet(TEST_MNE_1, 'ICP');

  const agent = await Promise.resolve(
    new HttpAgent({
      host: ICP_HOST,
      fetch,
    })
  ).then(async (ag) => {
    await ag.fetchRootKey();
    return ag;
  });

  const API = Actor.createActor(IDL_EXT, {
    agent: agent,
    canisterId: canisterId,
  });

  let tokens: any;

  try {
    tokens = await API.tokens_ext(accountId);
  } catch (error) {
    console.log(error);
    tokens = null;
  }

  const tokensOK = tokens?.ok || [];

  return tokensOK.map((token) => {
    const tokenIndex = parseInt(token[0]);
    const info = { seller: '', price: BigInt(0), locked: [] };
    let forSale = false;
    if (token[1][0] !== undefined) {
      info.seller = token[1][0]?.seller.toText();
      info.price = BigInt(token[1][0]?.price);
      info.locked = token[1][0]?.locked;
      forSale = true;
    }

    const metadata = token[2];
    const tokenIdentifier = getTokenIdentifier(canisterId, tokenIndex);
    return {
      metadata,
      info,
      tokenIndex,
      tokenIdentifier,
      forSale,
    };
  });
};

export const principal_to_address = (princial) =>
  address_to_hex(principal_id_to_address_buffer(princial));

export const getTokenIdentifier = (
  canisterId: string,
  index: number
): string => {
  const padding = Buffer.from('\x0Atid');
  const array = new Uint8Array([
    ...padding,
    ...Principal.fromText(canisterId).toUint8Array(),
    ...to32bits(index),
  ]);
  return Principal.fromUint8Array(array).toText();
};

export const transferNFTsExt = async (
  canisterId: string,
  fromIdentity: Identity,
  toAccountId: string,
  tokenIndex: string
) => {
  //const fetchWallet = await createWallet(TEST_MNE_1, 'ICP');

  const agent = await Promise.resolve(
    new HttpAgent({
      host: ICP_HOST,
      fetch,
      identity: fromIdentity,
    })
  ).then(async (ag) => {
    await ag.fetchRootKey();
    return ag;
  });

  const API = Actor.createActor(IDL_EXT, {
    agent: agent,
    canisterId: canisterId,
  });

  let status: any;
  const token = getTokenIdentifier(canisterId, parseInt(tokenIndex));
  const memo = new Array(32).fill(0);

  try {
    status = await API.transfer({
      to: { address: toAccountId },
      from: { address: principal_to_address(fromIdentity.getPrincipal()) },
      token,
      amount: BigInt(1),
      memo,
      notify: false,
      subaccount: [],
    });
  } catch (error) {
    console.log(error, JSON.stringify(error));
    status = null;
  }

  if (status?.err?.Other === 'This token is currently listed for sale!') {
    status = 'TOKEN_LISTED_FOR_SALE';
  } else if (
    status?.err?.Unauthorized ===
    principal_to_address(fromIdentity.getPrincipal())
  ) {
    status = 'UNAUTHORISED';
  } else if (status.ok === BigInt(1)) {
    status = 'SUCCESS';
  }
  return status;
};

export const listNFTsExt = async (
  canisterId: string,
  identity: Identity,
  tokenIndex: string,
  price: number
) => {
  //const fetchWallet = await createWallet(TEST_MNE_1, 'ICP');

  const agent = await Promise.resolve(
    new HttpAgent({
      host: ICP_HOST,
      fetch,
      identity,
    })
  ).then(async (ag) => {
    await ag.fetchRootKey();
    return ag;
  });

  const API = Actor.createActor(IDL_EXT, {
    agent: agent,
    canisterId: canisterId,
  });

  let status: any;
  const token = getTokenIdentifier(canisterId, parseInt(tokenIndex));

  try {
    status = await API.list({
      token,
      price: [Math.floor(price * 100000000)],
      from_subaccount: [getSubAccountArray(0)],
    });
  } catch (error) {
    console.log(error, JSON.stringify(error));
    status = null;
  }

  if (status?.err?.Other === 'Not authorized') {
    status = 'UNAUTHORISED';
  } else if (status.ok === null) {
    status = 'SUCCESS';
  }
  return status;
};
