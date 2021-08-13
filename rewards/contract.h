#pragma once

namespace Rewards {
	// SID: 4ea61398097fc601e6faac6513048de3df0da4812f40e0b4be744a1efc5cda82
static const ShaderID s_SID = {0x4e, 0xa6, 0x13, 0x98, 0x9, 0x7f, 0xc6, 0x1, 0xe6, 0xfa, 0xac, 0x65, 0x13, 0x4, 0x8d, 0xe3, 0xdf, 0xd, 0xa4, 0x81, 0x2f, 0x40, 0xe0, 0xb4, 0xbe, 0x74, 0x4a, 0x1e, 0xfc, 0x5c, 0xda, 0x82};
#pragma pack(push, 1)

	struct Params {
		static const uint32_t METHOD = 0;
		Height free_tokens_period;
		Amount free_tokens_amount;
		Amount max_reward;
		AssetID aid;
	};

	struct TakeFreeTokensParams {
		static const uint32_t METHOD = 2;
		PubKey receiver;
	};

	struct GiveRewardsParams {
		static const uint32_t METHOD = 3;
		PubKey receiver;
		PubKey sender;
		Amount amount;
	};

	struct TakePendingRewards {
		static const uint32_t METHOD = 4;
		PubKey account;
		Amount amount;
	};

	struct AccountData {
		Amount balance;
		Amount rewards;
		Amount pending_rewards;
		Height last_time_received;
	};

#pragma pack(pop)
}
