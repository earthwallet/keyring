import type { Principal } from '@dfinity/principal';
export type AccountIdentifier = AccountIdentifier_2;
export type AccountIdentifier_2 = string;
export type AccountIdentifier_3 = AccountIdentifier;
export type Balance = bigint;
export type BalanceRequest = BalanceRequest_2;
export interface BalanceRequest_2 {
  token: TokenIdentifier;
  user: User;
}
export type BalanceResponse = BalanceResponse_2;
export type BalanceResponse_2 = Result_10;
export type Balance_2 = Balance;
export interface BreedData {
  fee: [] | [Balance_2];
  canBreed: boolean;
  cost: Balance_2;
  generation: Generation;
  breedTime: [] | [Time];
}
export type BreedId = number;
export type CommonError = CommonError_2;
export type CommonError_2 =
  | { InvalidToken: TokenIdentifier }
  | { Other: string };
export type Extension = Extension_2;
export type Extension_2 = string;
export type Generation = number;
export type HeaderField = [string, string];
export interface HttpRequest {
  url: string;
  method: string;
  body: Array<number>;
  headers: Array<HeaderField>;
}
export interface HttpResponse {
  body: Array<number>;
  headers: Array<HeaderField>;
  status_code: number;
}
export interface ListRequest {
  token: TokenIdentifier_2;
  from_subaccount: [] | [SubAccount_3];
  price: [] | [bigint];
}
export interface Listing {
  locked: [] | [Time];
  seller: Principal;
  price: bigint;
}
export type Memo = Array<number>;
export type Memo_2 = Memo;
export type Metadata = Metadata_2;
export type Metadata_2 =
  | {
      fungible: {
        decimals: number;
        metadata: [] | [Array<number>];
        name: string;
        symbol: string;
      };
    }
  | { nonfungible: { metadata: [] | [Array<number>] } };
export type MintRequest = MintRequest_2;
export interface MintRequest_2 {
  to: User;
  metadata: [] | [Array<number>];
}
export interface NotifyLog {
  tokenid: TokenIdentifier_2;
  memo: Memo_2;
  user: User_2;
  amount: Balance_2;
}
export type Result =
  | { ok: Balance }
  | {
      err:
        | { CannotNotify: AccountIdentifier }
        | { InsufficientBalance: null }
        | { InvalidToken: TokenIdentifier }
        | { Rejected: null }
        | { Unauthorized: AccountIdentifier }
        | { Other: string };
    };
export type Result_10 = { ok: Balance } | { err: CommonError_2 };
export type Result_2 =
  | {
      ok: Array<
        [TokenIndex, [] | [Listing], [] | [Array<number>], [] | [BreedData]]
      >;
    }
  | { err: CommonError };
export type Result_3 = { ok: Array<TokenIndex> } | { err: CommonError };
export type Result_4 = { ok: Balance_2 } | { err: CommonError };
export type Result_5 = { ok: null } | { err: CommonError };
export type Result_6 = { ok: Metadata } | { err: CommonError };
export type Result_7 = { ok: AccountIdentifier_3 } | { err: CommonError };
export type Result_8 = { ok: TokenIndex } | { err: CommonError };
export type Result_9 =
  | { ok: [AccountIdentifier_3, [] | [Listing]] }
  | { err: CommonError };
export interface Settlement {
  subaccount: SubAccount_3;
  seller: Principal;
  buyer: AccountIdentifier_3;
  price: bigint;
}
export interface Sire {
  metadata: [] | [Array<number>];
  index: TokenIndex;
  breedData: BreedData;
}
export interface SireRequest {
  token: TokenIdentifier_2;
  from_subaccount: [] | [SubAccount_3];
  price: [] | [Balance_2];
}
export type SubAccount = SubAccount_2;
export type SubAccount_2 = Array<number>;
export type SubAccount_3 = SubAccount;
export type Time = Time_2;
export type Time_2 = bigint;
export type TokenIdentifier = string;
export type TokenIdentifier_2 = TokenIdentifier;
export type TokenIndex = TokenIndex_2;
export type TokenIndex_2 = number;
export interface Transaction2 {
  token: TokenIdentifier_2;
  time: Time;
  seller: Principal;
  buyer: AccountIdentifier_3;
  price: bigint;
}
export type TransferRequest = TransferRequest_2;
export interface TransferRequest_2 {
  to: User;
  token: TokenIdentifier;
  notify: boolean;
  from: User;
  memo: Memo;
  subaccount: [] | [SubAccount];
  amount: Balance;
}
export type TransferResponse = TransferResponse_2;
export type TransferResponse_2 = Result;
export type User = { principal: Principal } | { address: AccountIdentifier };
export type User_2 = User;
export type Wearable = Wearable_2;
export interface Wearable_2 {
  hat: [] | [[number, number]];
  pet: [] | [[number, number]];
  accessory: [] | [[number, number]];
  eyewear: [] | [[number, number]];
}
export default interface _SERVICE {
  TEMPaddPayment: (
    arg_0: string,
    arg_1: Principal,
    arg_2: SubAccount_3
  ) => Promise<undefined>;
  TEMPusedAddresses: (
    arg_0: string
  ) => Promise<Array<[AccountIdentifier_3, Principal, SubAccount_3]>>;
  acceptCycles: () => Promise<undefined>;
  allPayments: () => Promise<Array<[Principal, Array<SubAccount_3>]>>;
  allSettlements: () => Promise<Array<[TokenIndex, Settlement]>>;
  availableCycles: () => Promise<bigint>;
  backup: () => Promise<
    [
      Array<[TokenIndex, AccountIdentifier_3]>,
      Array<[AccountIdentifier_3, Array<TokenIndex>]>,
      Array<[TokenIndex, Metadata]>
    ]
  >;
  balance: (arg_0: BalanceRequest) => Promise<BalanceResponse>;
  bearer: (arg_0: TokenIdentifier_2) => Promise<Result_7>;
  clearPayments: (
    arg_0: Principal,
    arg_1: Array<SubAccount_3>
  ) => Promise<undefined>;
  crnDetails: () => Promise<
    [Balance_2, bigint, Array<[AccountIdentifier_3, Balance_2]>]
  >;
  details: (arg_0: TokenIdentifier_2) => Promise<Result_9>;
  extensions: () => Promise<Array<Extension>>;
  generations: () => Promise<Array<[TokenIndex, [Generation, BreedId]]>>;
  getAllPayments: () => Promise<Array<[Principal, Array<SubAccount_3>]>>;
  getAllWearables: () => Promise<Array<[TokenIndex, Wearable]>>;
  getBuyers: () => Promise<Array<[AccountIdentifier_3, Array<TokenIndex>]>>;
  getMinted: () => Promise<TokenIndex>;
  getMinter: () => Promise<Principal>;
  getRegistry: () => Promise<Array<[TokenIndex, AccountIdentifier_3]>>;
  getSold: () => Promise<TokenIndex>;
  getTokens: () => Promise<Array<[TokenIndex, Metadata]>>;
  getTransactions: (arg_0: [] | [bigint]) => Promise<Array<Transaction2>>;
  http_request: (arg_0: HttpRequest) => Promise<HttpResponse>;
  index: (arg_0: TokenIdentifier_2) => Promise<Result_8>;
  list: (arg_0: ListRequest) => Promise<Result_5>;
  listings: () => Promise<Array<[TokenIndex, Listing, Metadata]>>;
  lock: (
    arg_0: TokenIdentifier_2,
    arg_1: bigint,
    arg_2: AccountIdentifier_3,
    arg_3: SubAccount_3
  ) => Promise<Result_7>;
  metadata: (arg_0: TokenIdentifier_2) => Promise<Result_6>;
  mintNFT: (arg_0: MintRequest) => Promise<TokenIndex>;
  notifications: () => Promise<Array<NotifyLog>>;
  payments: () => Promise<[] | [Array<SubAccount_3>]>;
  receiveWearable: (
    arg_0: TokenIndex,
    arg_1: TokenIndex,
    arg_2: Array<number>,
    arg_3: AccountIdentifier_3
  ) => Promise<{ replaced: TokenIndex } | { success: null } | { failed: null }>;
  refunds: () => Promise<[] | [Array<SubAccount_3>]>;
  removePayments: (arg_0: Array<SubAccount_3>) => Promise<undefined>;
  removeRefunds: (arg_0: Array<SubAccount_3>) => Promise<undefined>;
  retreiveSnapshot: (arg_0: string) => Promise<Array<AccountIdentifier_3>>;
  setMinter: (arg_0: Principal) => Promise<undefined>;
  settings: () => Promise<
    [boolean, Array<number>, Time, Time, Time, Array<Balance_2>, Principal]
  >;
  settle: (arg_0: TokenIdentifier_2) => Promise<Result_5>;
  settlements: () => Promise<Array<[TokenIndex, AccountIdentifier_3, bigint]>>;
  sire: (arg_0: SireRequest) => Promise<Result_5>;
  sires: () => Promise<Array<Sire>>;
  supply: (arg_0: TokenIdentifier_2) => Promise<Result_4>;
  takeSnapshot: (arg_0: string) => Promise<bigint>;
  tokenTransferNotification: (
    arg_0: TokenIdentifier_2,
    arg_1: User_2,
    arg_2: Balance_2,
    arg_3: Memo_2
  ) => Promise<[] | [Balance_2]>;
  tokens: (arg_0: AccountIdentifier_3) => Promise<Result_3>;
  tokens_ext: (arg_0: AccountIdentifier_3) => Promise<Result_2>;
  transactions: () => Promise<Array<Transaction2>>;
  transfer: (arg_0: TransferRequest) => Promise<TransferResponse>;
}
