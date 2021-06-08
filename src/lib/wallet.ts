import {
  address_to_hex,
  principal_id_to_address,
} from '@dfinity/rosetta-client';
import Keyring from '@polkadot/keyring';
import { u8aToHex } from '@polkadot/util';
import { cryptoWaitReady, secp256k1Sign } from '@polkadot/util-crypto';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import elliptic from 'elliptic';
import { publicToAddress } from 'ethereumjs-util';
import HDKey from 'hdkey';
import * as nacl from 'tweetnacl';

import type { KeyringPair } from '../types/index';
import { getPrincipalFromPublicKey, signWithPrivateKey } from '../util/icp';

import SLIP44 from './slip44';

const secp256k1 = elliptic.ec('secp256k1');

export const getPublicKeySecp256k1 = (privateKey, compress) => {
  const ecKey = secp256k1.keyFromPrivate(
    privateKey.toLowerCase().replace('0x', ''),
    'hex'
  );

  return ecKey.getPublic(compress || false, 'hex');
};

export const getPublicKeyEd25519 = (
  privateKey: Buffer,
  withZeroByte = true
): Buffer => {
  const keyPair = nacl.sign.keyPair.fromSeed(privateKey);
  const signPk = keyPair.secretKey.subarray(32);
  const zero = Buffer.alloc(1, 0);
  return withZeroByte
    ? Buffer.concat([zero, Buffer.from(signPk)])
    : Buffer.from(signPk);
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
): Promise<KeyringPair> => {
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
    case 'ETH':
    case 'ICP': {
      const seed = mnemonicToSeedSync(mnemonic);
      const node = HDKey.fromMasterSeed(seed);
      const masterPrv = node.derive(SLIP_PATH);

      const privateKey = masterPrv.privateKey.toString('hex');
      const publicKey = getPublicKeySecp256k1(privateKey, false);

      const publicKeyBuffer = Buffer.from(publicKey, 'hex');
      const addressBuffer = publicToAddress(publicKeyBuffer, true);

      masterPrv.wipePrivateData();
      return {
        publicKey: publicKey,
        address:
          symbol === 'ETH'
            ? '0x' + addressBuffer.toString('hex')
            : address_to_hex(
                principal_id_to_address(getPrincipalFromPublicKey(publicKey))
              ),
        sign:
          symbol === 'ICP'
            ? (message: string) =>
                signWithPrivateKey(message, masterPrv.privateKey)
            : (message: string) =>
                secp256k1Sign(message, { secretKey: seed }, 'keccak'),
        type: 'ecdsa',
      };
    }

    default: {
      const seed = mnemonicToSeedSync(mnemonic);
      const node = HDKey.fromMasterSeed(seed);
      const masterPrv = node.derive(SLIP_PATH);

      const privateKey = masterPrv.privateKey.toString('hex');
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
