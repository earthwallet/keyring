import { blobFromUint8Array } from '@dfinity/candid';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { Secp256k1PublicKey } from '@dfinity/identity-ledgerhq';
import Keyring from '@polkadot/keyring';
import { u8aToHex, u8aToU8a } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { Client as bnbClient } from '@xchainjs/xchain-binance';
import { Client as btcClient } from '@xchainjs/xchain-bitcoin';
import { Client as bchClient } from '@xchainjs/xchain-bitcoincash';
import { Network } from '@xchainjs/xchain-client';
import { Client as ethClient } from '@xchainjs/xchain-ethereum';
import { Client as ltcClient } from '@xchainjs/xchain-litecoin';
import {
  generateMnemonic,
  mnemonicToSeedSync,
  validateMnemonic as _validateMnemonic,
} from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import elliptic from 'elliptic';
import { publicToAddress } from 'ethereumjs-util';
import HDKey from 'hdkey';
import Secp256k1 from 'secp256k1';
import * as nacl from 'tweetnacl';

import type { EarthKeyringPair } from '../types';
import Secp256k1KeyIdentity from '../util/icp/secpk256k1/identity';
import { principal_to_address } from '../util/icp';

import SLIP44 from './slip44';
import * as bitcoin from 'bitcoinjs-lib';
import { MnemonicWallet } from '@avalabs/avalanche-wallet-sdk';

export const getPublicKeySecp256k1 = (privateKey, compress) => {
  const _secp256k1 = new elliptic.ec('secp256k1');

  const ecKey = _secp256k1.keyFromPrivate(
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
 * import { newMnemonic } from '@earthwallet/keyring'
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
 * Validate Mnemonic
 *
 * ### Example (es module)
 * ```js
 * import { validateMnemonic } from '@earthwallet/keyring'
 * validateMnemonic('open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano');
 * // => true
 * ```
 * @returns boolean.
 */

export const validateMnemonic = (
  mnemonic: string,
  wordlist?: string[]
): boolean => _validateMnemonic(mnemonic, wordlist);

/**
 * Get slip44 object for a symbol
 *
 * ### Example (es module)
 * ```js
 * import { getSlipFromSymbol } from '@earthwallet/keyring'
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
  account?: number,
  options?: Record<string, unknown>
): Promise<EarthKeyringPair> => {
  const SLIP_ACCOUNT = account === undefined ? 0 : account;
  const SLIP_INDEX = getSlipFromSymbol(symbol)?.index; //defaults to ethereum
  const SLIP_PATH = `m/44'/${SLIP_INDEX}'/0'/0/${SLIP_ACCOUNT}`;
  //  const ICP_PATH = `m/44'/223'/0'`;

  switch (symbol) {
    case 'DOT':
    case 'KSM': {
      await cryptoWaitReady();
      const keyring = new Keyring({ type: 'sr25519' });
      if (symbol === 'KSM') {
        keyring.setSS58Format(2);
      } else if (symbol === 'DOT') {
        keyring.setSS58Format(0);
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
    case 'DOGE': {
      const network = {
        messagePrefix: '\x19Dogecoin Signed Message:\n',
        bip32: {
          public: 0x02facafd,
          private: 0x02fac398,
        },
        bech32: null,
        pubKeyHash: 0x1e,
        scriptHash: 0x16,
        wif: 0x9e,
        dustThreshold: 0, // https://github.com/dogecoin/dogecoin/blob/v1.7.1/src/core.h#L155-L160
      };
      const seed = mnemonicToSeedSync(mnemonic);
      const master = bitcoin.bip32
        .fromSeed(seed, network)
        .derivePath(SLIP_PATH);

      const keyPair = bitcoin.ECPair.fromPrivateKey(master.privateKey, {
        network: network,
      });
      const { address } = bitcoin.payments.p2pkh({
        pubkey: keyPair.publicKey,
        network: network,
      });

      return {
        address,
        desc: 'bech32 address',
        type: 'ecdsa',
      };
    }
    case 'ZEC': {
      //Error
      const network = {
        messagePrefix: '\x18ZCash Signed Message:\n',
        bip32: {
          public: 0x0488b21e,
          private: 0x0488ade4,
        },
        bech32: null,
        pubKeyHash: 0x1cb8,
        scriptHash: 0x1cbd,
        wif: 0x80,
        dustThreshold: 0, // https://github.com/dogecoin/dogecoin/blob/v1.7.1/src/core.h#L155-L160
      };
      const seed = mnemonicToSeedSync(mnemonic);
      const master = bitcoin.bip32
        .fromSeed(seed, network)
        .derivePath(SLIP_PATH);

      const keyPair = bitcoin.ECPair.fromPrivateKey(master.privateKey, {
        network: network,
      });
      const { address } = bitcoin.payments.p2pkh({
        pubkey: keyPair.publicKey,
        network: network,
      });

      return {
        address,
        desc: 'bech32 address',
        type: 'ecdsa',
      };
    }
    case 'BTG': {
      const network = {
        messagePrefix: '\x18Bitcoin Gold Signed Message:\n',
        bip32: {
          public: 0x0488b21e,
          private: 0x0488ade4,
        },
        bech32: 'btg',
        pubKeyHash: 0x26,
        scriptHash: 0x17,
        wif: 0x80,
        dustThreshold: 0, // https://github.com/dogecoin/dogecoin/blob/v1.7.1/src/core.h#L155-L160
      };
      const seed = mnemonicToSeedSync(mnemonic);
      const master = bitcoin.bip32
        .fromSeed(seed, network)
        .derivePath(SLIP_PATH);

      const keyPair = bitcoin.ECPair.fromPrivateKey(master.privateKey, {
        network: network,
      });
      const { address } = bitcoin.payments.p2pkh({
        pubkey: keyPair.publicKey,
        network: network,
      });

      return {
        address,
        desc: 'bech32 address',
        type: 'ecdsa',
      };
    }
    case 'AVAX': {
      const wallet = MnemonicWallet.fromMnemonic(mnemonic);

      return {
        address: wallet.getAddressX(),
        desc: 'X-Chain address to receive funds.',
        type: 'ecdsa',
      };
    }
    case 'AVAP': {
      const wallet = MnemonicWallet.fromMnemonic(mnemonic);

      return {
        address: wallet.getAddressP(),
        desc: 'P-Chain address to receive funds.',
        type: 'ecdsa',
      };
    }
    case 'MATIC':
    case 'BSC':
    case 'AVAC':
    case 'ETH': {
      const _ethClient = new ethClient({
        network: 'mainnet' as Network,
        phrase: mnemonic,
        ethplorerUrl: 'https://api.ethplorer.io',
      });

      const address = _ethClient.getAddress(account);

      return {
        address: address,
        desc:
          symbol === 'BSC' || symbol === 'MATIC'
            ? symbol === 'MATIC'
              ? 'EVM network address'
              : 'Binance Smartchain EVM network address'
            : 'Ethereum address',
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
      switch (options?.type) {
        case 'Ed25519': {
          //backward compatiabile
          const seed = mnemonicToSeedSync(mnemonic);

          const ICP_SLIP_PATH = `m/44'/223'/0'/0'/${SLIP_ACCOUNT}'`;
          const { key: privateKey } = derivePath(
            `${ICP_SLIP_PATH}`,
            seed as any
          );
          const uintSeed = Uint8Array.from(privateKey);
          const keyPair = Ed25519KeyIdentity.generate(uintSeed);

          return {
            identity: keyPair,
            publicKey: keyPair.toJSON()[0],
            address: principal_to_address(keyPair.getPrincipal()),
            sign: (message: string) =>
              nacl.sign.detached(
                u8aToU8a(message),
                u8aToU8a('0x' + keyPair.toJSON()[1])
              ),
            type: 'ed25519',
          };
        }
        case 'Secp256k1':
        default: {
          //DERIVATION_PATH = "m/44'/223'/0'/0";
          const seed = mnemonicToSeedSync(mnemonic);
          const masterKey = HDKey.fromMasterSeed(seed);
          const masterPrv = masterKey.derive(SLIP_PATH);

          const privateKey = masterPrv.privateKey;
          const publicKey = Secp256k1.publicKeyCreate(privateKey, false);
          const identity = Secp256k1KeyIdentity.fromKeyPair(
            Secp256k1PublicKey.fromRaw(blobFromUint8Array(publicKey)).toRaw(),
            privateKey
          );

          return {
            identity: identity,
            publicKey: identity.toJSON()[0],
            address: principal_to_address(identity.getPrincipal()),
            type: 'ecdsa',
          };
        }
      }
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
