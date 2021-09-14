import test from 'ava';

import { createWallet } from './wallet';

test('create wallet for ICP', async (t) => {
  try {
    const walletObj = await createWallet(
      'illness estate carpet dog social garment fan maximum mansion goose panda public',
      'ICP'
    );

    t.like(walletObj, {
      publicKey:
        '04963ac190a31d91a06d575e33ac9bacb6540112fe1b95118032bcb9c2353bfa98c2053b7d363a67fede789ddff86745ff32534aabec285e63e7ec22e8fd4eb7d6',
      address:
        'c24ea8ecf529a22c7a84754ecd0666b5e8d0bc5dc49fca1392c5874836e38265',
      type: 'ecdsa',
    });
  } catch (error) {
    console.log(error);
  }
});

test('create wallet for ICP-Ed25519', async (t) => {
  try {
    const walletObj = await createWallet(
      'illness estate carpet dog social garment fan maximum mansion goose panda public',
      'ICP',
      0,
      { type: 'Ed25519' }
    );

    t.like(walletObj, {
      publicKey:
        '302a300506032b65700321009984152489282b29e7ef8c1ac706f7928da681f20c52118f817f1ec25810c795',
      address:
        'ab487baf0ddeb3a80ec5dbd3108f155c00a6ef55d91f6090c9400bbdb5585d23',
      type: 'ed25519',
    });
  } catch (error) {
    console.log(error);
  }
});

test('create wallet for ICP Index 1', async (t) => {
  try {
    const walletObj = await createWallet(
      'illness estate carpet dog social garment fan maximum mansion goose panda public',
      'ICP',
      1
    );
    t.like(walletObj, {
      publicKey:
        '04e46376b7a4bdddd93f8491b90cf34a83314f70f0fbde3bd0c398b98bd9c81cf691f4d5d8f1b6dbe50d2dd286df6ff9456245c83e062da3b958decda8346267b3',
      address:
        '9db6d5d5b76f7239582ad14be2b6ded88bc3afc3f9df524ab49ac6a8367ca5f6',
      type: 'ecdsa',
    });
  } catch (error) {
    console.log(error);
  }
});

/* test('transactions for ICP address', async (t) => {
  try {
    const balance = await getTransactions(
      '07b1b5f1f023eaa457a6d63fe00cea8cae5c943461350de455cb2d1f3dec8992'
    );
    t.like(balance, {
      transactions: [
        {
          block_identifier: {
            index: 140946,
            hash: 'f462f2fd58ddfd957def7991fab2a1404875f99c67389d67d48ff4f7bd49026c',
          },
          transaction: {
            transaction_identifier: {
              hash: 'd11b7b678638c34e67dfa35026ab35208860ef62da68ddaf5fc23e57d68b30e7',
            },
            operations: [
              {
                operation_identifier: {
                  index: 0,
                },
                type: 'TRANSACTION',
                status: 'COMPLETED',
                account: {
                  address:
                    'd3e13d4777e22367532053190b6c6ccf57444a61337e996242b1abfb52cf92c8',
                },
                amount: {
                  value: '-10951000',
                  currency: {
                    symbol: 'ICP',
                    decimals: 8,
                  },
                },
              },
              {
                operation_identifier: {
                  index: 1,
                },
                type: 'TRANSACTION',
                status: 'COMPLETED',
                account: {
                  address:
                    '07b1b5f1f023eaa457a6d63fe00cea8cae5c943461350de455cb2d1f3dec8992',
                },
                amount: {
                  value: '10951000',
                  currency: {
                    symbol: 'ICP',
                    decimals: 8,
                  },
                },
              },
              {
                operation_identifier: {
                  index: 2,
                },
                type: 'FEE',
                status: 'COMPLETED',
                account: {
                  address:
                    'd3e13d4777e22367532053190b6c6ccf57444a61337e996242b1abfb52cf92c8',
                },
                amount: {
                  value: '-10000',
                  currency: {
                    symbol: 'ICP',
                    decimals: 8,
                  },
                },
              },
            ],
            metadata: {
              block_height: 140946,
              memo: 8313622071006371696,
              timestamp: 1623151038000816251,
            },
          },
        },
      ],
      total_count: 7,
    });
  } catch (error) {
    console.log(error);
  }
}); */

test('create wallet for ETH', async (t) => {
  try {
    const walletObj = await createWallet(
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
      'ETH'
    );
    t.like(walletObj, {
      address: '0x29bc7f4bfc7301b3ddb5c9c4348360fc0ad52ca8',
      type: 'ecdsa',
    });
  } catch (error) {
    console.log(error);
  }
});

test('create wallet for AVAC', async (t) => {
  try {
    const walletObj = await createWallet(
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
      'AVAC'
    );
    t.like(walletObj, {
      address: '0x29bc7f4bfc7301b3ddb5c9c4348360fc0ad52ca8',
      type: 'ecdsa',
    });
  } catch (error) {
    console.log(error);
  }
});

test('create wallet for MATIC', async (t) => {
  try {
    const walletObj = await createWallet(
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
      'MATIC'
    );
    t.like(walletObj, {
      address: '0x29bc7f4bfc7301b3ddb5c9c4348360fc0ad52ca8',
      type: 'ecdsa',
    });
  } catch (error) {
    console.log(error);
  }
});

test('create wallet for BSC', async (t) => {
  try {
    const walletObj = await createWallet(
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
      'BSC'
    );
    t.like(walletObj, {
      address: '0x29bc7f4bfc7301b3ddb5c9c4348360fc0ad52ca8',
      type: 'ecdsa',
    });
  } catch (error) {
    console.log(error);
  }
});

test('create wallet for AVAX', async (t) => {
  try {
    const walletObj = await createWallet(
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
      'AVAX'
    );
    t.like(walletObj, {
      address: 'X-avax1l5v3mtezh34tf4txg393fuh4va6kghvwczrr0c',
      type: 'ecdsa',
    });
  } catch (error) {
    console.log(error);
  }
});

test('create wallet for AVAP', async (t) => {
  try {
    const walletObj = await createWallet(
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
      'AVAP'
    );
    t.like(walletObj, {
      address: 'P-avax1l5v3mtezh34tf4txg393fuh4va6kghvwczrr0c',
      type: 'ecdsa',
    });
  } catch (error) {
    console.log(error);
  }
});

// can be tested manually from  https://chrome.google.com/webstore/detail/binance-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp/related

test('create wallet for BNB', async (t) => {
  try {
    const walletObj = await createWallet(
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
      'BNB'
    );
    t.like(walletObj, {
      address: 'bnb17vszy3374ucgylh9utt0n53a020wsqn885nz36',
      desc: 'Binance chain network address',
      type: 'ecdsa',
    });
  } catch (error) {
    console.log(error);
  }
});

test('create wallet for BTC', async (t) => {
  try {
    const walletObj = await createWallet(
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
      'BTC'
    );

    //legacy address - 1d9d48c1f990365165508fa93e16a295fc7699d6
    t.like(walletObj, {
      address: 'bc1qrkw53s0ejqm9ze2s375nu94zjh78dxwkuuas35',
      type: 'ecdsa',
      desc: 'bech32 address',
    });
  } catch (error) {
    console.log(error);
  }
});
test('create wallet for DOGE', async (t) => {
  try {
    const walletObj = await createWallet(
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
      'DOGE'
    );

    t.like(walletObj, {
      address: 'DDiV3gzT8uereLM1VscymdoSAWiRE6LANy',
      type: 'ecdsa',
      desc: 'bech32 address',
    });
  } catch (error) {
    console.log(error);
  }
});

test('create wallet for BTG', async (t) => {
  try {
    const walletObj = await createWallet(
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
      'BTG'
    );

    t.like(walletObj, {
      address: 'GYxq4bsS9ze6rBpzHgDyy2Bx66zX45QCjN',
      type: 'ecdsa',
      desc: 'bech32 address',
    });
  } catch (error) {
    console.log(error);
  }
});
test('create wallet for LTC', async (t) => {
  try {
    const walletObj = await createWallet(
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
      'LTC'
    );
    t.like(walletObj, {
      address: 'ltc1ql8lzfwvetxc4f8auaymrw2px43n4qx8c7wrr98',
      desc: 'bech32 address',
      type: 'ecdsa',
    });
  } catch (error) {
    console.log(error);
  }
});

test('create wallet for BCH', async (t) => {
  try {
    const walletObj = await createWallet(
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
      'BCH'
    );

    //can be validated from https://iancoleman.io/bip39/
    t.like(walletObj, {
      address: 'qqp5y90849ttaty408kmzzl5qgf3e7plfv4prx08ls',
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
    t.like(walletObj, {
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
    t.like(walletObj, {
      publicKey:
        '0x7806e3f1de6b8690b8eb57fded933c66f059993ba1d675f49ba3f94fac1f8425',
      address: '13iNnzoLf6XGTwAjjcswpNNJ4YuDXNus6TiKZjZfgXnJu1xD',
      type: 'sr25519',
    });
  } catch (error) {
    console.log(error);
  }
});
