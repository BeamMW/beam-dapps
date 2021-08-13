#include "../common.h"
#include "../Math.h"
#include "contract.h"

export void Ctor(Rewards::Params& params)
{
	const char* meta = "reward token";
	params.aid = Env::AssetCreate(meta, sizeof(meta) - 1);
	Env::Halt_if(!params.aid);
	Env::SaveVar_T(0, params);
}

export void Dtor(void *)
{
	Rewards::Params init_params;
	Env::LoadVar_T(0, init_params);
	Env::Halt_if(Env::AssetDestroy(init_params.aid));
	Env::DelVar_T(0);
}

export void Method_2(const Rewards::TakeFreeTokensParams& params)
{
	Rewards::Params init_params;
	Env::LoadVar_T(0, init_params);

	Rewards::AccountData ac{};
	bool is_loaded = Env::LoadVar_T(params.receiver, ac);

	Height cur_height = Env::get_Height();
	
	if (!is_loaded || cur_height - ac.last_time_received > init_params.free_tokens_period) {
		Env::AssetEmit(init_params.aid, init_params.free_tokens_amount, true);
		Strict::Add(ac.balance, init_params.free_tokens_amount);
		ac.last_time_received = cur_height;
		Env::SaveVar_T(params.receiver, ac);
		Env::FundsUnlock(init_params.aid, init_params.free_tokens_amount);
	}
	Env::AddSig(params.receiver);
}

export void Method_3(const Rewards::GiveRewardsParams& params)
{
	Rewards::Params init_params;
	Env::LoadVar_T(0, init_params);

	Rewards::AccountData receiver_ac{};
	Rewards::AccountData sender_ac{};
	Env::LoadVar_T(params.receiver, receiver_ac);
	Env::LoadVar_T(params.sender, sender_ac);

	if (sender_ac.balance >= params.amount) {
		Strict::Sub(sender_ac.balance, params.amount);
		Strict::Add(receiver_ac.pending_rewards, params.amount);
		Env::FundsLock(init_params.aid, params.amount);
		Env::SaveVar_T(params.sender, sender_ac);
		Env::SaveVar_T(params.receiver, receiver_ac);
		Env::AddSig(params.sender);
	} else {
		// need it?
		Env::Halt();
	}
}

export void Method_4(const Rewards::TakePendingRewards& params)
{
	Rewards::Params init_params;
	Env::LoadVar_T(0, init_params);

	Rewards::AccountData ac{};
	Env::LoadVar_T(params.account, ac);

	Strict::Sub(ac.pending_rewards, params.amount);
	Strict::Add(ac.rewards, params.amount);
	Env::AssetEmit(init_params.aid, params.amount, false);
	Env::SaveVar_T(params.account, ac);
}
