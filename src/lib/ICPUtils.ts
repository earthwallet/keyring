import * as agent from '@dfinity/agent';
const RAW_KEY_LENGTH = 65;
const DER_PREFIX_HEX = '3056301006072a8648ce3d020106052b8104000a034200';
const DER_PREFIX = Uint8Array.from(Buffer.from(DER_PREFIX_HEX, 'hex'));
import elliptic from 'elliptic';

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
