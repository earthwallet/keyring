import type { Principal } from '@dfinity/principal';
export interface Property {
  value: string;
  name: string;
}
export interface TokenDesc {
  id: bigint;
  url: string;
  owner: Principal;
  desc: string;
  name: string;
  properties: Array<Property>;
}
export default interface _SERVICE {
  data_of: (arg_0: bigint) => Promise<TokenDesc>;
  mint: (arg_0: Principal) => Promise<bigint>;
  owner_of: (arg_0: bigint) => Promise<Principal>;
  owners: () => Promise<Array<[Principal, Array<bigint>]>>;
  transfer_to: (arg_0: Principal, arg_1: bigint) => Promise<boolean>;
  user_tokens: (arg_0: Principal) => Promise<Array<bigint>>;
}
