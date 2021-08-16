#ifndef BEAM_MY_VAULT_CONTRACT_H
#define BEAM_MY_VAULT_CONTRACT_H

#include "../common.h"

namespace LimitedVault {

    static const ShaderID s_SID = { 0x01,0x31,0xf3,0x51,0x7a,0x69,0x42,0x9f,0x18,0xed,0xb3,0x88,0xda,0x88,0x99,0x02,0x16,0xb5,0x0e,0x10,0x45,0x99,0xf2,0x57,0x9b,0x66,0x3e,0x49,0x81,0x82,0x2d,0x45 };

    // Hash of ShaderID + initialization parameters. Since vault does not have constructor parameters, this will always be Vault contract id
    static const ContractID s_CID = { 0xd0,0x85,0x51,0xe7,0x99,0x2f,0x6d,0xff,0xce,0x75,0xc0,0x2b,0x92,0x3c,0xa9,0x56,0x45,0xd5,0xe3,0xef,0x8b,0x8d,0x18,0xfb,0xc8,0x72,0x19,0x0c,0x6a,0xc5,0xc9,0xe1 };


#pragma pack(push, 1)

    struct ComplexKey {
        PubKey key;
        AssetID asset_id;
    };

    enum LimitType {
        Low = 0,
        High = 1,
        Internal = 2 // Used only as past-the-end value
    };

    struct LimitsKey {
        ComplexKey key;
        LimitType type;
    };

    struct Request {
      ComplexKey key;
    };

    struct MoneyRequest : public Request {
      Amount amount;
    };

    struct DepositRequest : public MoneyRequest {
      static constexpr uint32_t kMethodNumber = 2;
    };

    struct WithdrawRequest : public MoneyRequest {
      static constexpr uint32_t kMethodNumber = 3;
    };

    struct SetLimitsRequest : public Request {
      static constexpr uint32_t kMethodNumber = 4;
      Amount low_limit;
      Amount high_limit;
    };

#pragma pack(pop)

} // LimitedVault

#endif //BEAM_MY_VAULT_CONTRACT_H
