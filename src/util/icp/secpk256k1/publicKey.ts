import { DerEncodedBlob, PublicKey } from '@dfinity/agent';
import {
  BinaryBlob,
  blobFromUint8Array,
  derBlobFromBlob,
} from '@dfinity/candid';

// This implementation is adjusted from the Ed25519PublicKey.
// The RAW_KEY_LENGTH and DER_PREFIX are modified accordingly
class Secp256k1PublicKey implements PublicKey {
  public static fromRaw(rawKey: BinaryBlob): Secp256k1PublicKey {
    return new Secp256k1PublicKey(rawKey);
  }

  public static fromDer(
    derKey: BinaryBlob | DerEncodedBlob
  ): Secp256k1PublicKey {
    return new Secp256k1PublicKey(this.derDecode(derKey as BinaryBlob));
  }

  public static from(key: PublicKey): Secp256k1PublicKey {
    return this.fromDer(key.toDer());
  }

  private static RAW_KEY_LENGTH = 65;
  private static DER_PREFIX_HEX =
    '3056301006072a8648ce3d020106052b8104000a034200';
  private static DER_PREFIX = Uint8Array.from(
    Buffer.from(Secp256k1PublicKey.DER_PREFIX_HEX, 'hex')
  );

  private static derEncode(publicKey: BinaryBlob): DerEncodedBlob {
    if (publicKey.byteLength !== Secp256k1PublicKey.RAW_KEY_LENGTH) {
      const bl = publicKey.byteLength;
      throw new TypeError(
        `secp256k1 public key must be ${Secp256k1PublicKey.RAW_KEY_LENGTH} bytes long (is ${bl})`
      );
    }

    const derPublicKey = Uint8Array.from([
      ...Secp256k1PublicKey.DER_PREFIX,
      ...new Uint8Array(publicKey),
    ]);

    return derBlobFromBlob(blobFromUint8Array(derPublicKey));
  }

  private static derDecode(key: BinaryBlob): BinaryBlob {
    const expectedLength =
      Secp256k1PublicKey.DER_PREFIX.length + Secp256k1PublicKey.RAW_KEY_LENGTH;
    if (key.byteLength !== expectedLength) {
      const bl = key.byteLength;
      throw new TypeError(
        `secp256k1 DER-encoded public key must be ${expectedLength} bytes long (is ${bl})`
      );
    }

    const rawKey = blobFromUint8Array(
      key.subarray(Secp256k1PublicKey.DER_PREFIX.length)
    );
    if (!this.derEncode(rawKey).equals(key)) {
      throw new TypeError(
        'secp256k1 DER-encoded public key is invalid. A valid secp256k1 DER-encoded public key ' +
          `must have the following prefix: ${Secp256k1PublicKey.DER_PREFIX}`
      );
    }

    return rawKey;
  }

  private readonly rawKey: BinaryBlob;

  private readonly derKey: DerEncodedBlob;

  // `fromRaw` and `fromDer` should be used for instantiation, not this constructor.
  private constructor(key: BinaryBlob) {
    this.rawKey = key;
    this.derKey = Secp256k1PublicKey.derEncode(key);
  }

  public toDer(): DerEncodedBlob {
    return this.derKey;
  }

  public toRaw(): BinaryBlob {
    return this.rawKey;
  }
}
export default Secp256k1PublicKey;
