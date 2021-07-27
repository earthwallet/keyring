import test from 'ava';

import { getBalance } from './';

test('balance for ICP address', async (t) => {
  try {
    const balance = await getBalance(
      '07b1b5f1f023eaa457a6d63fe00cea8cae5c943461350de455cb2d1f3dec8992',
      'ICP'
    );
    t.like(balance, {
      balances: [
        {
          value: '134891000',
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

/* test('balance for BNB address', async (t) => {
  try {
    const balance = await getBalance(
      'bnb1jgve64hudeacmtknk0fnx3fye35zgj7zjtv637',
      'BNB'
    );
    t.like(balance, []);
  } catch (error) {
    console.log(error);
  }
}); */

/* test('balance for DOT address', async (t) => {
  try {
    const balance = await getBalance(
      'bnb1jgve64hudeacmtknk0fnx3fye35zgj7zjtv637',
      'DOT'
    );
    t.like(balance, []);
  } catch (error) {
    console.log(error);
  }
});
test('balance for KSM address', async (t) => {
  try {
    const balance = await getBalance(
      'bnb1jgve64hudeacmtknk0fnx3fye35zgj7zjtv637',
      'KSM'
    );
    t.like(balance, []);
  } catch (error) {
    console.log(error);
  }
}); */
test('balance for BTC address', async (t) => {
  try {
    const balance = await getBalance(
      'bc1q84z04sm2a5kjav003t4k0334a2ld6ldvtngmj3',
      'BTC'
    );
    t.is(balance.value, 1597531);
  } catch (error) {
    console.log(error);
  }
}); /* 
test('balance for BCH address', async (t) => {
  try {
    const balance = await getBalance(
      'bnb1jgve64hudeacmtknk0fnx3fye35zgj7zjtv637',
      'KSM'
    );
    t.like(balance, []);
  } catch (error) {
    console.log(error);
  }
});
test('balance for ATOM address', async (t) => {
  try {
    const balance = await getBalance(
      'bnb1jgve64hudeacmtknk0fnx3fye35zgj7zjtv637',
      'ATOM'
    );
    t.like(balance, []);
  } catch (error) {
    console.log(error);
  }
});
test('balance for RUNE address', async (t) => {
  try {
    const balance = await getBalance(
      'bnb1jgve64hudeacmtknk0fnx3fye35zgj7zjtv637',
      'RUNE'
    );
    t.like(balance, []);
  } catch (error) {
    console.log(error);
  }
});
test('balance for ETH address', async (t) => {
  try {
    const balance = await getBalance(
      'bnb1jgve64hudeacmtknk0fnx3fye35zgj7zjtv637',
      'ETH'
    );
    t.like(balance, []);
  } catch (error) {
    console.log(error);
  }
});

test('balance for LTC address', async (t) => {
  try {
    const balance = await getBalance(
      'bnb1jgve64hudeacmtknk0fnx3fye35zgj7zjtv637',
      'LTC'
    );
    t.like(balance, []);
  } catch (error) {
    console.log(error);
  }
}); */
