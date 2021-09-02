import test from 'ava';

import { getBalance, transfer, getTransactions, getTransactionData } from './';

test('transfer from empty ETH address throws error', async (t) => {
  try {
    const hash = await transfer(
      '0x5E557586308Df0b695Add73ECA8282331DE1833C',
      '1',
      'sweet unaware acoustic ability armor scheme often notice index artefact trap blouse',
      'ETH',
      {}
    );

    console.log(hash);
  } catch (error) {
    t.truthy(error.code === 'INSUFFICIENT_FUNDS');
  }
});
test('transfer from empty BTC address throws error', async (t) => {
  try {
    const hash = await transfer(
      'bc1qa6v268z24gsx587zwe66f7ucev4ne0sffe9ksk',
      '0.0001',
      'sweet unaware acoustic ability armor scheme often notice index artefact trap blouse',
      'BTC',
      {}
    );

    console.log(hash);
  } catch (error) {
    t.truthy(typeof error === 'object');
  }
});
/* 
test('balance for ICP address', async (t) => {
  try {
    const balance = await getBalance(
      '07b1b5f1f023eaa457a6d63fe00cea8cae5c943461350de455cb2d1f3dec8992',
      'ICP'
    );
    t.like(balance, {
      balances: [
        {
          value: '128271000',
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
 */
/* 
test('balance for DOT address', async (t) => {
  try {
    const balance = await getBalance(
      '16WyaXVX8qkYjcmCZK7Bz8KKqwMxNeQStX8SGkE3coArGLBB',
      'DOT'
    );
    t.is(balance.value, 196556676072680220);
  } catch (error) {
    console.log(error);
  }
});
test('balance for KSM address', async (t) => {
  try {
    const balance = await getBalance(
      'J6J6WaKuRW13ja8NNsEjvrB8ueYV1fVGQEhW7WeYWMpq9KF',
      'KSM'
    );
    t.is(balance.value, 0);
  } catch (error) {
    console.log(error);
  }
});
 */
test('balance for BTC address', async (t) => {
  try {
    const balance = await getBalance(
      'bc1q96wk25mvsj6rxgvhwcl27rykwx7c30xgze2ee0',
      'BTC'
    );
    t.is(balance.value, 0);
  } catch (error) {
    console.log(error);
  }
});

test('balance for ETH address', async (t) => {
  try {
    const balance = await getBalance(
      '0x9d39Bd670D7Ef1880E5B733d08C5b42942884F05',
      'ETH'
    );
    t.is(balance.value, 196556676072680220);
  } catch (error) {
    console.log(error);
  }
});

test('balance for BCH address', async (t) => {
  try {
    const balance = await getBalance(
      'qp794xu9ns88n3vy4yfk5ffcyqxukcvewcwevf6wez',
      'BCH'
    );
    t.is(balance.value, 49849616);
  } catch (error) {
    console.log(error);
  }
});
/* test('balance for ATOM address', async (t) => {
  try {
    const balance = await getBalance(
      'cosmos1mcz38nkcua6w3ghkzuxzg5d8jwzsffwurz7xay',
      'ATOM'
    );
    t.is(balance.value, 196556676072680220);
  } catch (error) {
    console.log(error);
  }
}); */

test('balance for BNB address', async (t) => {
  try {
    const balance = await getBalance(
      'bnb1p5lnh7czee2c73zu882lsaacuyj6xn30llzdh2',
      'BNB'
    );
    t.is(balance.value, 48942500);
  } catch (error) {
    console.log(error);
  }
});

test('balance for LTC address', async (t) => {
  try {
    const balance = await getBalance(
      'ltc1qq8um23n4yp6n250a2ylgwjuzxdufhwgmt58j4s',
      'LTC'
    );
    t.is(balance.value, 99799450);
  } catch (error) {
    console.log(error);
  }
});

test('transactions for BTC address', async (t) => {
  try {
    const txns = await getTransactions(
      'bc1q96wk25mvsj6rxgvhwcl27rykwx7c30xgze2ee0',
      'BTC'
    );
    t.is(txns?.total, 2);
  } catch (error) {
    console.log(error);
  }
});

test('transaction data for BTC txn', async (t) => {
  try {
    const txn = await getTransactionData(
      'fd1ec977c647199979f3b0706c39b361b6072311367c8f76fd09e297cb7a85f9',
      'BTC'
    );
    t.is(txn?.from[0].from, 'bc1q96wk25mvsj6rxgvhwcl27rykwx7c30xgze2ee0');
    t.is(txn?.to[0].to, 'bc1qa6v268z24gsx587zwe66f7ucev4ne0sffe9ksk');
  } catch (error) {
    console.log(error);
  }
});
