//import { blobFromBuffer } from '@dfinity/agent';
//import { Bip39Ed25519KeyIdentity } from '@dfinity/authentication';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { address_to_hex } from '@dfinity/rosetta-client';
import Keyring from '@polkadot/keyring';
import { u8aToHex, u8aToU8a } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { Client as bnbClient } from '@xchainjs/xchain-binance';
import { Client as btcClient } from '@xchainjs/xchain-bitcoin';
import { Client as bchClient } from '@xchainjs/xchain-bitcoincash';
import { Network } from '@xchainjs/xchain-client';
import { Client as cosmosClient } from '@xchainjs/xchain-cosmos';
import { Client as ethClient } from '@xchainjs/xchain-ethereum';
import { Client as ltcClient } from '@xchainjs/xchain-litecoin';
import { Client as thorClient } from '@xchainjs/xchain-thorchain';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import elliptic from 'elliptic';
import { publicToAddress } from 'ethereumjs-util';
import HDKey from 'hdkey';
import * as nacl from 'tweetnacl';

import 'isomorphic-fetch';
import type { EarthKeyringPair } from '../types';
import { principal_id_to_address } from '../util/icp';

import SLIP44 from './slip44';

const secp256k1 = new elliptic.ec('secp256k1');

export const getPublicKeySecp256k1 = (privateKey, compress) => {
  const ecKey = secp256k1.keyFromPrivate(
    privateKey.toLowerCase().replace('0x', ''),
    'hex'
  );
  return ecKey.getPublic(compress || false, 'hex');
};

/**
 * Generate a new random Mnemonic
 *
 * ### Example (es module)
 * ```js
 * import { newMnemonic } from 'earthjs'
 * await newMnemonic();
 * // => open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano
 * ```
 * @returns mnemonic.
 */
export const newMnemonic = async () => {
  try {
    return await generateMnemonic(); // default to 128
  } catch (e) {
    return false;
  }
};

/**
 * Get slip44 object for a symbol
 *
 * ### Example (es module)
 * ```js
 * import { getSlipFromSymbol } from 'earthjs'
 * getSlipFromSymbol("ICP");
 * // => {
    index: '223',
    hex: '0x800000df',
    symbol: 'ICP',
    name: 'Internet Computer (DFINITY)',
    link: 'https://dfinity.org/',
  }
 * ```
 * @returns slipObject
 */

export const getSlipFromSymbol = (symbol: string) => {
  if (symbol === undefined || symbol === null) return { index: -1 };
  return Object.values(SLIP44).filter(
    (a) => a?.symbol.toUpperCase() === symbol.toUpperCase()
  )[0];
};

/**
 * Creates a wallet from mnemonic and symbol with optional account index.
 *
 * ### Example (es module)
 * ```js
    const walletObj = await createWallet(
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
      'ICP'
    );
 * // => {
      publicKey:
        '0x7806e3f1de6b8690b8eb57fded933c66f059993ba1d675f49ba3f94fac1f8425',
      address: 'FHhJyt9RgGin3yfYgdzaAu9MXBodkAuULpao6rGcEyHTscN',
      type: 'sr25519',
    }
 * ```
 *
 * ### Example (commonjs)
 * ```js
    const walletObj = await createWallet(
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
      'ICP'
    );
 * // => {
      publicKey:
        '0x7806e3f1de6b8690b8eb57fded933c66f059993ba1d675f49ba3f94fac1f8425',
      address: 'FHhJyt9RgGin3yfYgdzaAu9MXBodkAuULpao6rGcEyHTscN',
      type: 'sr25519',
    }
 * ```
 *
 * @param mnemonic - Comment describing the `value` parameter.
 * @param symbol - Comment describing the `value` parameter.
 * @param account - Comment describing the `value` parameter.
 * @returns Comment describing the return type.
 * @anotherNote Some other value.
 */
export const createWallet = async (
  mnemonic: string,
  symbol: string,
  account?: number
): Promise<EarthKeyringPair> => {
  const SLIP_ACCOUNT = account === undefined ? 0 : account;
  const SLIP_INDEX = getSlipFromSymbol(symbol).index; //defaults to ethereum
  const SLIP_PATH = `m/44'/${SLIP_INDEX}'/0'/0/${SLIP_ACCOUNT}`;
  //  const ICP_PATH = `m/44'/223'/0'`;

  switch (symbol) {
    case 'DOT':
    case 'KSM': {
      await cryptoWaitReady();
      const keyring = new Keyring({ type: 'sr25519' });
      if (symbol === 'KSM') {
        keyring.setSS58Format(2);
      }
      const {
        address,
        publicKey,
        meta,
        isLocked,
        type,
        decodePkcs8,
        encodePkcs8,
        lock,
        setMeta,
        sign,
        toJson,
        unlock,
        verify,
        vrfSign,
        vrfVerify,
      } = keyring.addFromUri(mnemonic);
      return {
        address: address,
        publicKey: u8aToHex(publicKey),
        meta,
        isLocked,
        type,
        decodePkcs8,
        encodePkcs8,
        lock,
        setMeta,
        sign,
        toJson,
        unlock,
        verify,
        vrfSign,
        vrfVerify,
      };
    }

    case 'BTC': {
      const _btcClient = new btcClient({
        network: 'mainnet' as Network,
        phrase: mnemonic,
        sochainUrl: 'https://sochain.com/api/v2',
      });

      const address = _btcClient.getAddress(account);

      return {
        address: address,
        desc: 'bech32 address',
        type: 'ecdsa',
      };
    }
    case 'BCH': {
      const _bchClient = new bchClient({
        network: 'mainnet' as Network,
        phrase: mnemonic,
      });

      const address = _bchClient.getAddress(account);

      return {
        address: address,
        type: 'ecdsa',
      };
    }
    case 'ATOM': {
      const _cosmosClient = new cosmosClient({
        network: 'mainnet' as Network,
        phrase: mnemonic,
      });

      const address = _cosmosClient.getAddress(account);

      return {
        address: address,
        type: 'ecdsa',
      };
    }
    case 'RUNE': {
      const _thorClient = new thorClient({
        network: 'mainnet' as Network,
        phrase: mnemonic,
      });

      const address = _thorClient.getAddress(account);

      return {
        address: address,
        type: 'ecdsa',
      };
    }
    case 'ETH': {
      const _ethClient = new ethClient({
        network: 'mainnet' as Network,
        phrase: mnemonic,
        ethplorerUrl: 'https://api.ethplorer.io',
      });

      const address = _ethClient.getAddress(account);

      return {
        address: address,
        type: 'ecdsa',
      };
    }

    case 'BNB': {
      const _bnbClient = new bnbClient({
        network: 'mainnet' as Network,
        phrase: mnemonic,
      });

      const address = _bnbClient.getAddress(account);

      return {
        address: address,
        desc: 'Binance chain network address',
        type: 'ecdsa',
      };
    }

    case 'LTC': {
      const _ltcClient = new ltcClient({
        network: 'mainnet' as Network,
        phrase: mnemonic,
      });

      const address = _ltcClient.getAddress(account);

      return {
        address: address,
        desc: 'bech32 address',
        type: 'ecdsa',
      };
    }
    case 'ICP': {
      const seed = mnemonicToSeedSync(mnemonic);

      const ICP_SLIP_PATH = `m/44'/223'/0'/0'/${SLIP_ACCOUNT}'`;
      const { key: privateKey } = derivePath(`${ICP_SLIP_PATH}`, seed as any);
      const uintSeed = Uint8Array.from(privateKey);
      const keyPair = Ed25519KeyIdentity.generate(uintSeed);

      return {
        identity: keyPair,
        publicKey: keyPair.toJSON()[0],
        address: address_to_hex(
          principal_id_to_address(keyPair.getPrincipal())
        ),
        sign: (message: string) =>
          nacl.sign.detached(
            u8aToU8a(message),
            u8aToU8a('0x' + keyPair.toJSON()[1])
          ),
        type: 'ed25519',
      };
    }

    default: {
      const seed = mnemonicToSeedSync(mnemonic);
      const node = HDKey.fromMasterSeed(seed);
      const childNode = node.derive(SLIP_PATH);

      const privateKey = childNode.privateKey.toString('hex');
      const publicKey = getPublicKeySecp256k1(privateKey, false);

      const publicKeyBuffer = Buffer.from(publicKey, 'hex');
      const addressBuffer = publicToAddress(publicKeyBuffer, true);
      return {
        publicKey: publicKey,
        address: addressBuffer.toString('hex'),
        type: 'ecdsa',
      };
    }
  }
};
