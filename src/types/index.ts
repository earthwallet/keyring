/**
 * If you import a dependency which does not include its own type definitions,
 * TypeScript will try to find a definition for it by following the `typeRoots`
 * compiler option in tsconfig.json. For this project, we've configured it to
 * fall back to this folder if nothing is found in node_modules/@types.
 *
 * Often, you can install the DefinitelyTyped
 * (https://github.com/DefinitelyTyped/DefinitelyTyped) type definition for the
 * dependency in question. However, if no one has yet contributed definitions
 * for the package, you may want to declare your own. (If you're using the
 * `noImplicitAny` compiler options, you'll be required to declare it.)
 *
 * This is an example type definition which allows import from `module-name`,
 * e.g.:
 * ```ts
 * import something from 'module-name';
 * something();
 * ```
 */

export type EncryptedJsonVersion = '0' | '1' | '2' | '3';
export type EncryptedJsonEncoding = 'none' | 'scrypt' | 'xsalsa20-poly1305';
export interface EncryptedJsonDescriptor {
  content: string[];
  type: EncryptedJsonEncoding | EncryptedJsonEncoding[];
  version: EncryptedJsonVersion;
}
export interface EncryptedJson {
  encoded: string;
  encoding: EncryptedJsonDescriptor;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type KeyringPair$Meta = Record<string, unknown>;
export type KeypairType = 'ed25519' | 'sr25519' | 'ecdsa' | 'ethereum';
export interface SignOptions {
  withType?: boolean;
}
export interface KeyringPair$Json extends EncryptedJson {
  address: string;
  meta: KeyringPair$Meta;
}

export type JsonnableEd25519KeyIdentity = [string, string];

export interface KeyringPair {
  readonly address: string;
  readonly meta?: KeyringPair$Meta;
  readonly isLocked?: boolean;
  readonly publicKey: string;
  readonly type: KeypairType;
  identity?: any;
  decodePkcs8?(passphrase?: string, encoded?: Uint8Array): void;
  derive?(suri: string, meta?: KeyringPair$Meta): KeyringPair;
  encodePkcs8?(passphrase?: string): Uint8Array;
  lock?(): void;
  setMeta?(meta: KeyringPair$Meta): void;
  sign?(message: string | Uint8Array, options?: SignOptions): Uint8Array;
  toJson?(passphrase?: string): KeyringPair$Json;
  toJSON?(passphrase?: string): JsonnableEd25519KeyIdentity;
  unlock?(passphrase?: string): void;
  verify?(
    message: string | Uint8Array,
    signature: Uint8Array,
    signerPublic: string | Uint8Array
  ): boolean;
  vrfSign?(
    message: string | Uint8Array,
    context?: string | Uint8Array,
    extra?: string | Uint8Array
  ): Uint8Array;
  vrfVerify?(
    message: string | Uint8Array,
    vrfResult: Uint8Array,
    signerPublic: Uint8Array | string,
    context?: string | Uint8Array,
    extra?: string | Uint8Array
  ): boolean;
}
