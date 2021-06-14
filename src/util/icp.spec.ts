import { Ed25519KeyIdentity } from '@dfinity/identity';
import {
  address_to_hex,
  principal_id_to_address,
} from '@dfinity/rosetta-client';
import test from 'ava';
import { mnemonicToSeedSync } from 'bip39';
import { derivePath } from 'ed25519-hd-key';

import { fromMnemonicWithoutValidation } from './icp';

//https://github.com/dfinity/internet-identity/tree/main
test('private key', async (t) => {
  const seedPhrase =
    'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano';
  const seed = mnemonicToSeedSync(seedPhrase, '');

  const IC_DERIVATION_PATH = [44, 223, 0, 0, 0];
  const identity = await fromMnemonicWithoutValidation(
    seedPhrase,
    IC_DERIVATION_PATH
  );

  const SLIP_PATH = `m/44'/223'/0'/0'/${0}'`;
  const { key: privateKey } = derivePath(`${SLIP_PATH}`, seed as any);
  const uintSeed = Uint8Array.from(privateKey);
  const ultimate_icp = Ed25519KeyIdentity.generate(uintSeed);

  t.is(
    address_to_hex(principal_id_to_address(ultimate_icp.getPrincipal())),
    address_to_hex(principal_id_to_address(identity.getPrincipal()))
  );
});

/* test('send transaction ', async (t) => {
  try {
    const hash = await sendTransaction(
      'ce9df7dfbf72d825d2696f3ac782d63bb6475e6e19d35cfe6a71f0451daa36db',
      '07b1b5f1f023eaa457a6d63fe00cea8cae5c943461350de455cb2d1f3dec8992',
      0.001
    );
    console.log(hash);
    t.is(1, 1);
  } catch (error) {
    console.log(error);
  }
});
 */
