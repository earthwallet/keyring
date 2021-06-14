import * as agent from '@dfinity/agent';
const RAW_KEY_LENGTH = 65;
const DER_PREFIX_HEX = '3056301006072a8648ce3d020106052b8104000a034200';
const DER_PREFIX = Uint8Array.from(Buffer.from(DER_PREFIX_HEX, 'hex'));
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { key_new, Session } from '@dfinity/rosetta-client';
import { address_from_hex } from '@dfinity/rosetta-client';
import { u8aToU8a } from '@polkadot/util';
import axios, { AxiosRequestConfig } from 'axios';
import { mnemonicToSeedSync } from 'bip39';
import elliptic from 'elliptic';
import * as tweetnacl from 'tweetnacl';
import { SubtleCryptoFactory } from 'verifiablecredentials-crypto-sdk-typescript-plugin-factory';
const subtle = SubtleCryptoFactory.create('SubtleCryptoNode');

const secp256k1 = elliptic.ec('secp256k1');

//https://github.com/dfinity/agent-js/blob/6e8c64cf07c7722aafbf52351eb0f19fcb954ff0/packages/identity-ledgerhq/src/identity/secp256k1.ts
export const derEncode = (publicKey: agent.BinaryBlob) => {
  if (publicKey.byteLength !== RAW_KEY_LENGTH) {
    const bl = publicKey.byteLength;
    console.error(
      `secp256k1 public key must be ${RAW_KEY_LENGTH} bytes long (is ${bl})`
    );
  }
  const derPublicKey = Uint8Array.from([
    ...DER_PREFIX,
    ...new Uint8Array(publicKey),
  ]);
  return agent.derBlobFromBlob(agent.blobFromUint8Array(derPublicKey));
};

export const derDecode = (key: agent.BinaryBlob) => {
  const expectedLength = DER_PREFIX.length + RAW_KEY_LENGTH;
  if (key.byteLength !== expectedLength) {
    const bl = key.byteLength;
    console.error(
      `secp256k1 DER-encoded public key must be ${expectedLength} bytes long (is ${bl})`
    );
  }
  const rawKey = agent.blobFromUint8Array(key.subarray(DER_PREFIX.length));
  if (!derEncode(rawKey).equals(key)) {
    console.error(
      'secp256k1 DER-encoded public key is invalid. A valid secp256k1 DER-encoded public key ' +
        `must have the following prefix: ${DER_PREFIX}`
    );
  }
  return rawKey;
};

export const getUncompressPublicKey = (publicKey: string): string => {
  const ecKey = secp256k1.keyFromPublic(
    publicKey.startsWith('0x') ? publicKey.slice(2) : publicKey,
    'hex'
  );
  return ecKey.getPublic(false, 'hex');
};

/**
 * @function getPrincipalFromPublicKey
 * @param  {string} publicKey: uncompressed public key
 * @return {string} {principal text}
 */
export const getPrincipalFromPublicKey = (publicKey: string) => {
  const secp256k1PubKey = derEncode(agent.blobFromHex(publicKey));
  const auth = agent.Principal.selfAuthenticating(secp256k1PubKey);
  return auth;
};

export const signWithPrivateKey = (
  message: Uint8Array | string,
  privateKey: Uint8Array | Buffer
): Uint8Array => {
  return tweetnacl.sign.detached(u8aToU8a(message), u8aToU8a(privateKey));
};

export const verifyWithPublicKey = (
  message: Uint8Array | string,
  signature: Uint8Array | string,
  publicKey: Uint8Array
): boolean => {
  return tweetnacl.sign.detached.verify(
    u8aToU8a(message),
    u8aToU8a(signature),
    publicKey
  );
};

export const getBalance = async (address) => {
  let serverRes = {};

  const data = {
    network_identifier: {
      blockchain: 'Internet Computer',
      network: '00000000000000020101',
    },
    account_identifier: {
      address: address,
    },
  };

  const config: AxiosRequestConfig = {
    method: 'post',
    url: 'https://rosetta-api.internetcomputer.org/account/balance',
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

export const getTransactions = async (address) => {
  let serverRes = {};

  const data = {
    network_identifier: {
      blockchain: 'Internet Computer',
      network: '00000000000000020101',
    },
    account_identifier: {
      address: address,
    },
  };

  const config: AxiosRequestConfig = {
    method: 'post',
    url: 'https://rosetta-api.internetcomputer.org/search/transactions',
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

/**
 *
 * @param {String} src_private_key
 * hex of derived child private key of character length 64 and buffer size 32 bytes
 * @param {String} dest_addr
 * e.g 07b1b5f1f023eaa457a6d63fe00cea8cae5c943461350de455cb2d1f3dec8992
 * @param {BigInt} amount
 * Specifies the number of ICP tokens to transfer. Can be specified as a number with up to eight (8) decimal places.
 * @param {BigInt?} max_fee
 * Specifies a transaction fee. The default is 10000 e8s i.e 0.001 ICP .
 * @param {object} opts
 * @returns {Promise<TransactionIdentifierResponse>}
 */

export const sendTransaction = async (src_private_key, dest_addr, amount) => {
  const session = new Session({
    baseUrl: 'https://rosetta-api.internetcomputer.org',
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

  console.log(submit_result);
  return submit_result;
};

/**
 * Create an Ed25519 based on a mnemonic phrase according to SLIP 0010:
 * https://github.com/satoshilabs/slips/blob/master/slip-0010.md
 *
 * NOTE: This method derives an identity even if the mnemonic is invalid. It's
 * the responsibility of the caller to validate the mnemonic before calling this method.
 *
 * @param mnemonic A BIP-39 mnemonic.
 * @param derivationPath an array that is always interpreted as a hardened path.
 * e.g. to generate m/44'/223’/0’/0’/0' the derivation path should be [44, 223, 0, 0, 0]
 * @param skipValidation if true, validation checks on the mnemonics are skipped.
 */
export async function fromMnemonicWithoutValidation(
  mnemonic: string,
  derivationPath: number[] = []
): Promise<Ed25519KeyIdentity> {
  const seed = mnemonicToSeedSync(mnemonic);
  return fromSeedWithSlip0010(seed, derivationPath);
}

/**
 * Create an Ed25519 according to SLIP 0010:
 * https://github.com/satoshilabs/slips/blob/master/slip-0010.md
 *
 * The derivation path is an array that is always interpreted as a hardened path.
 * e.g. to generate m/44'/223’/0’/0’/0' the derivation path should be [44, 223, 0, 0, 0]
 */

const HARDENED = 0x80000000;

export async function fromSeedWithSlip0010(
  masterSeed: Uint8Array,
  derivationPath: number[] = []
): Promise<Ed25519KeyIdentity> {
  let [slipSeed, chainCode] = await generateMasterKey(masterSeed);

  for (let i = 0; i < derivationPath.length; i++) {
    [slipSeed, chainCode] = await derive(
      slipSeed,
      chainCode,
      derivationPath[i] | HARDENED
    );
  }

  return Ed25519KeyIdentity.generate(slipSeed);
}

async function generateMasterKey(
  seed: Uint8Array
): Promise<[Uint8Array, Uint8Array]> {
  const data = new TextEncoder().encode('ed25519 seed');
  const algo: Algorithm = {
    name: 'HMAC',
    hash: { name: 'SHA-512' },
  };
  const key = await subtle.importKey('raw', data, algo, false, ['sign']);
  const h = await subtle.sign(algo, key, seed);
  const slipSeed = new Uint8Array(h.slice(0, 32));
  const chainCode = new Uint8Array(h.slice(32));
  return [slipSeed, chainCode];
}

async function derive(
  parentKey: Uint8Array,
  parentChaincode: Uint8Array,
  i: number
): Promise<[Uint8Array, Uint8Array]> {
  // From the spec: Data = 0x00 || ser256(kpar) || ser32(i)
  const data = new Uint8Array([0, ...parentKey, ...toBigEndianArray(i)]);
  const algo: Algorithm = {
    name: 'HMAC',
    hash: { name: 'SHA-512' },
  };
  const key = await subtle.importKey('raw', parentChaincode, algo, false, [
    'sign',
  ]);

  const h = await subtle.sign(algo, key, data.buffer);
  const slipSeed = new Uint8Array(h.slice(0, 32));
  const chainCode = new Uint8Array(h.slice(32));
  return [slipSeed, chainCode];
}

// Converts a 32-bit unsigned integer to a big endian byte array.
function toBigEndianArray(n: number): Uint8Array {
  const byteArray = new Uint8Array([0, 0, 0, 0]);
  for (let i = byteArray.length - 1; i >= 0; i--) {
    const byte = n & 0xff;
    byteArray[i] = byte;
    n = (n - byte) / 256;
  }
  return byteArray;
}
