import { AddressParams, BtcGetBalanceDTO, SochainResponse } from './types';
import { BaseAmount, assetAmount, assetToBase } from '@xchainjs/xchain-util';
import axios from 'axios';
import { Network } from '@xchainjs/xchain-client';
import { BTC_DECIMAL } from '@xchainjs/xchain-bitcoin';

const toSochainNetwork = (network: Network): string => {
  switch (network) {
    case Network.Mainnet:
      return 'BTC';
    case Network.Testnet:
      return 'BTCTEST';
  }
};

/**
 * Get address balance.
 *
 * @see https://sochain.com/api#get-balance
 *
 * @param {string} sochainUrl The sochain node url.
 * @param {string} network
 * @param {string} address
 * @returns {number}
 */
export const getBalance = async ({
  sochainUrl,
  network,
  address,
}: AddressParams): Promise<BaseAmount> => {
  const url = `${sochainUrl}/get_address_balance/${toSochainNetwork(
    network
  )}/${address}`;
  const response = await axios.get(url);
  console.log(response, 'response');
  const balanceResponse: SochainResponse<BtcGetBalanceDTO> = response.data;
  const confirmed = assetAmount(
    balanceResponse.data.confirmed_balance,
    BTC_DECIMAL
  );
  const unconfirmed = assetAmount(
    balanceResponse.data.unconfirmed_balance,
    BTC_DECIMAL
  );
  const netAmt = confirmed.amount().plus(unconfirmed.amount());
  const result = assetToBase(assetAmount(netAmt, BTC_DECIMAL));
  console.log(result);
  return result;
};
