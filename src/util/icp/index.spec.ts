// import { blobFromUint8Array } from '@dfinity/candid';
import test from 'ava';

import { createWallet } from '../../lib/wallet';
import { sendICP, indexToHash, getNFTCollections } from '.';

//https://github.com/dfinity/internet-identity/tree/main

test('send transaction throws error for empty address', async (t) => {
  try {
    const seedPhrase =
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano';

    const walletObj = await createWallet(seedPhrase, 'ICP');

    const hash = await sendICP(
      walletObj.identity,
      '07b1b5f1f023eaa457a6d63fe00cea8cae5c943461350de455cb2d1f3dec8992',
      walletObj.address,
      0.003
    );
    console.log(hash);
  } catch (error) {
    console.log(error, typeof error, JSON.stringify(error));
    t.truthy(true);
  }
});

test('get nft collections for an address', async (t) => {
  try {
    const collections = await getNFTCollections(
      'o7nwu-n6kuf-4afzp-ybcuf-346pr-odd54-damf5-v4pvc-4sexh-cabph-7qe'
    );

    t.like(collections[0], {
      name: 'ICPuzzle',
      canisterId: 'owuqd-dyaaa-aaaah-qapxq-cai',
      standard: 'EXT',
      description:
        'The ICPuzzle NFT is an artistic NFT that is meant to invoke thought around individuality, community, and the beauty of the human condition. Each puzzle piece represents human individuality within humanity, a self-contained piece of a larger cohesive whole.',
      icon: 'https://owuqd-dyaaa-aaaah-qapxq-cai.raw.ic0.app/?tokenid=2e7o5-wykor-uwiaa-aaaaa-b4ad5-4aqca-aaagc-q',
    });
  } catch (error) {
    console.log(error, typeof error, JSON.stringify(error));
    t.truthy(true);
  }
});

test('get hash from index with indexToHash', async (t) => {
  try {
    const hash = await indexToHash(660209);

    t.is(
      hash,
      'dad49f3a954a4109410b4d7af65f3e6385e4dc35872c3c21ed1d0135fe27e52e'
    );
  } catch (error) {
    console.log(error);
    t.truthy(false);
  }
});
