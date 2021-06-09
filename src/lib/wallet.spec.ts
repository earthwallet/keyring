import { u8aToHex } from '@polkadot/util';
import test from 'ava';

import { getBalance, getTransactions } from '../util/icp';

import { createWallet } from './wallet';

test('create wallet for ICP', async (t) => {
  try {
    const walletObj = await createWallet(
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
      'ICP'
    );

    t.like(walletObj, {
      publicKey:
        '04931f4d17682b3dedbbd87d29d86040ee5f361a182045c3475ff2fc05af7e30a79f1040784655b226520dbb71aac3edc951cd50a64c138596ef746265e4cf122f',
      address:
        '02f2326544f2040d3985e31db5e7021402c541d3cde911cd20e951852ee4da47',
      type: 'ecdsa',
    });
    const signature = walletObj.sign('signthis');
    t.is(
      u8aToHex(signature),
      '0x47ae27c5a2ed5eabecd52d06def8009180fe1db952bc05eb78e7e18dd37465aa03e8abe1f393f4164be4989b805173b7e43e91b06bb2b2dd57b71289ef96340e'
    );
  } catch (error) {
    console.log(error);
  }
});

test('balance for ICP address', async (t) => {
  try {
    const balance = await getBalance(
      '07b1b5f1f023eaa457a6d63fe00cea8cae5c943461350de455cb2d1f3dec8992'
    );
    t.like(balance, {
      balances: [
        {
          value: '10951000',
          currency: {
            symbol: 'ICP',
            decimals: 8,
          },
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }
});

test('transactions for ICP address', async (t) => {
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
      total_count: 1,
    });
  } catch (error) {
    console.log(error);
  }
});

test('create wallet for ICP Index 1', async (t) => {
  try {
    const walletObj = await createWallet(
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
      'ICP',
      1
    );
    t.like(walletObj, {
      publicKey:
        '042c51d9b734532368428567d139bf536fb4520a1bb7f8dd859a5baf621aebc1b7ff1b6c5fe5c5411f0ca6c117c2c34482bc96019e5131bf53662d8c1c477a22fe',
      address:
        '8a8861c41810197542313a309449e33d35915305ab9d3036c803ed235f7cd5b3',
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
    t.like(walletObj, {
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
      address: '5En5efYGoKFo2QADmypwgDY9CvuZq5Mj1xyqQSaK8SkniiDe',
      type: 'sr25519',
    });
  } catch (error) {
    console.log(error);
  }
});
