import test from 'ava';

import { createWallet } from './wallet';

test('create wallet for ICP', async (t) => {
  try {
    const walletObj = await createWallet(
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
      'ICP'
    );
    t.deepEqual(walletObj, {
      publicKey:
        '04931f4d17682b3dedbbd87d29d86040ee5f361a182045c3475ff2fc05af7e30a79f1040784655b226520dbb71aac3edc951cd50a64c138596ef746265e4cf122f',
      address: '01ec886a057ec4cb17e0e7ecaefff89e6a170ffd',
      type: 'ecdsa',
    });
  } catch (error) {
    console.log(error);
  }
});

test('create wallet for ETH', async (t) => {
  try {
    const walletObj = await createWallet(
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
      'ETH'
    );
    t.deepEqual(walletObj, {
      publicKey:
        '0475aa060fdb2433f3b04d0a208e745463792047684608959cf6f47a08daba9de08a1f06ee6b3d747eb37210e0d4309284cc7f528025414929d7c90d6607b95314',
      address: '0x29bc7f4bfc7301b3ddb5c9c4348360fc0ad52ca8',
      type: 'ecdsa',
    });
  } catch (error) {
    console.log(error);
  }
});

test('create wallet for KSM', async (t) => {
  try {
    const walletObj = await createWallet(
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
      'KSM'
    );
    t.deepEqual(walletObj, {
      publicKey:
        '0x7806e3f1de6b8690b8eb57fded933c66f059993ba1d675f49ba3f94fac1f8425',
      address: 'FHhJyt9RgGin3yfYgdzaAu9MXBodkAuULpao6rGcEyHTscN',
      type: 'sr25519',
    });
  } catch (error) {
    console.log(error);
  }
});
test('create wallet for DOT', async (t) => {
  try {
    const walletObj = await createWallet(
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
      'DOT'
    );
    t.deepEqual(walletObj, {
      publicKey:
        '0x7806e3f1de6b8690b8eb57fded933c66f059993ba1d675f49ba3f94fac1f8425',
      address: '5En5efYGoKFo2QADmypwgDY9CvuZq5Mj1xyqQSaK8SkniiDe',
      type: 'sr25519',
    });
  } catch (error) {
    console.log(error);
  }
});
