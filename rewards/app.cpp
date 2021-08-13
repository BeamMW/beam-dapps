#include "Shaders/common.h"
#include "Shaders/app_common_impl.h"
#include "contract.h"

#include <algorithm>
#include <utility>
#include <vector>

#define ACTION_SIZE	32

using Action_func_t = void (*)(const ContractID&);

void OnError(const char* msg)
{
	Env::DocAddText("error", msg);
}

void DeriveMyPk(PubKey& pubKey, const ContractID& cid)
{
	Env::DerivePk(pubKey, &cid, sizeof(cid));
}

void On_action_create_contract(const ContractID& unused)
{
	Rewards::Params pars;
	Env::DocGet("free_tokens_period", pars.free_tokens_period);
	Env::DocGet("free_tokens_amount", pars.free_tokens_amount);
	Env::DocGet("max_reward", pars.max_reward);

	FundsChange fc;
	fc.m_Aid = 0;
	fc.m_Amount = 3000 * 100000000ll;
	fc.m_Consume = 1;
	Env::GenerateKernel(nullptr, pars.METHOD, &pars, sizeof(pars), &fc, 1, nullptr, 0, "Create Rewards contract", 0);
}

void On_action_destroy_contract(const ContractID& cid)
{
	FundsChange fc;
	fc.m_Aid = 0;
	fc.m_Amount = 3000 * 100000000ll;
	fc.m_Consume = 0;

	Env::GenerateKernel(&cid, 1, nullptr, 0, &fc, 1, nullptr, 0, "Destroy Rewards contract", 0);
}

void On_action_view_contracts(const ContractID& unused)
{
	EnumAndDumpContracts(Rewards::s_SID);
}

void On_action_view_params(const ContractID& cid)
{
	Env::Key_T<int> k;
	k.m_Prefix.m_Cid = cid;
	k.m_KeyInContract = 0;

	Rewards::Params pars;
	if (!Env::VarReader::Read_T(k, pars))
		return OnError("Failed to read contract's initial params");

	Env::DocGroup gr("params");
	Env::DocAddNum("free_tokens_period", pars.free_tokens_period);
	Env::DocAddNum("free_tokens_amount", pars.free_tokens_amount);
	Env::DocAddNum("max_reward", pars.max_reward);
	Env::DocAddNum("aid", pars.aid);
}

void On_action_take_free_tokens(const ContractID& cid)
{
	Env::Key_T<int> k;
	k.m_Prefix.m_Cid = cid;
	k.m_KeyInContract = 0;

	Rewards::Params initial_params;
	if (!Env::VarReader::Read_T(k, initial_params))
		return OnError("Failed to read contract's initial params");

	Rewards::TakeFreeTokensParams params;
	DeriveMyPk(params.receiver, cid);

	SigRequest sig;
	sig.m_pID = &cid;
	sig.m_nID = sizeof(cid);

	FundsChange fc;
	fc.m_Amount = initial_params.free_tokens_amount;
	fc.m_Aid = initial_params.aid;
	fc.m_Consume = 0;

	Env::GenerateKernel(&cid, Rewards::TakeFreeTokensParams::METHOD, &params, sizeof(params), &fc, 1, &sig, 1, "Take free tokens from rewards contract", 0);
}

void On_action_show_rewards(const ContractID& cid)
{
	PubKey pubKey;
	DeriveMyPk(pubKey, cid);

	Env::Key_T<int> k;
	k.m_Prefix.m_Cid = cid;
	k.m_KeyInContract = 0;

	Rewards::Params initial_params;
	if (!Env::VarReader::Read_T(k, initial_params))
		return OnError("Failed to read contract's initial params");

	Env::KeyPrefix k0, k1;
	k0.m_Cid = cid;
	k1.m_Cid = cid;
	k1.m_Tag = KeyTag::Internal + 1;

	Env::VarReader r(k0, k1);
	Env::DocArray gr("accounts");

	while (true) {
		Env::Key_T<PubKey> key;
		Rewards::AccountData d;

		if (!r.MoveNext_T(key, d))
			break;

		Env::DocGroup gr("");

		Env::DocAddBlob_T("account", key.m_KeyInContract);
		Env::DocAddNum("rewards", d.rewards);
		Env::DocAddNum("balance", d.balance);
		Env::DocAddNum("pending_rewards", d.pending_rewards);
		Env::DocAddNum("last_time_received", d.last_time_received);
	}
}

void On_action_give_rewards(const ContractID& cid)
{
	Env::Key_T<int> k;
	k.m_Prefix.m_Cid = cid;
	k.m_KeyInContract = 0;
	Rewards::Params initial_params;
	if (!Env::VarReader::Read_T(k, initial_params))
		return OnError("Failed to read contract's initial params");

	Rewards::GiveRewardsParams pars;
	Env::DocGetBlob("receiver", &pars.receiver, sizeof(pars.receiver));
	DeriveMyPk(pars.sender, cid);
	Env::DocGetNum64("amount", &pars.amount);

	if (!Env::Memcmp(&pars.receiver, &pars.sender, sizeof(pars.receiver)))
		return OnError("Unable to send rewards to yourself!");

	if (pars.amount > initial_params.max_reward)
		return OnError("Amount must be less than max_reward param");

	FundsChange fc;
	fc.m_Amount = pars.amount;
	fc.m_Aid = initial_params.aid;
	fc.m_Consume = 1;

	SigRequest sig;
	sig.m_pID = &cid;
	sig.m_nID = sizeof(cid);

	Env::GenerateKernel(&cid, Rewards::GiveRewardsParams::METHOD, &pars, sizeof(pars), &fc, 1, &sig, 1, "Give rewards tokens", 0);
}

void On_action_get_my_pkey(const ContractID& cid)
{
	PubKey my_key;
	DeriveMyPk(my_key, cid);
	Env::DocAddBlob_T("My public key", my_key);
}

void On_action_take_pending_rewards(const ContractID& cid)
{
	Env::Key_T<int> k;
	k.m_Prefix.m_Cid = cid;
	k.m_KeyInContract = 0;
	Rewards::Params initial_params;
	if (!Env::VarReader::Read_T(k, initial_params))
		return OnError("Failed to read contract's initial params");

	Rewards::TakePendingRewards pars;
	DeriveMyPk(pars.account, cid);

	Env::Key_T<PubKey> pkey;
	pkey.m_Prefix.m_Cid = cid;
	pkey.m_KeyInContract = pars.account;

	Rewards::AccountData ac{};
	Env::VarReader::Read_T(pkey, ac);

	pars.amount = ac.pending_rewards;

	if (pars.amount <= 0) {
		return OnError("No pending rewards");
	}

	Env::GenerateKernel(&cid, Rewards::TakePendingRewards::METHOD, &pars, sizeof(pars), nullptr, 0, nullptr, 0, "Take pending rewards", 0);
}

export void Method_0()
{
	Env::DocGroup root("");
	{
		Env::DocGroup method("create_contract");
		Env::DocAddText("free_tokens_period", "Height");
		Env::DocAddText("free_tokens_amount", "Amount");
		Env::DocAddText("max_reward", "Amount");
	}
	{
		Env::DocGroup method("destroy_contract");
		Env::DocAddText("cid", "ContractID");
	}
	{
		Env::DocGroup method("view_contracts");
	}
	{
		Env::DocGroup method("view_params");
		Env::DocAddText("cid", "ContractID");
	}
	{
		Env::DocGroup method("take_free_tokens");
		Env::DocAddText("cid", "ContractID");
	}
	{
		Env::DocGroup method("give_rewards");
		Env::DocAddText("receiver", "PubKey");
		Env::DocAddText("cid", "ContractID");
	}
	{
		Env::DocGroup method("show_rewards");
		Env::DocAddText("cid", "ContractID");
	}
	{
		Env::DocGroup method("get_my_pkey");
		Env::DocAddText("cid", "ContractID");
	}
	{
		Env::DocGroup method("take_pending_rewards");
		Env::DocAddText("cid", "ContractID");
	}
}

export void Method_1()
{
	const std::vector<std::pair<const char *, Action_func_t>> VALID_ACTIONS = {
		{"create_contract", On_action_create_contract},
		{"destroy_contract", On_action_destroy_contract},
		{"view_contracts", On_action_view_contracts},
		{"view_params", On_action_view_params},
		{"take_free_tokens", On_action_take_free_tokens},
		{"give_rewards", On_action_give_rewards},
		{"show_rewards", On_action_show_rewards},
		{"get_my_pkey", On_action_get_my_pkey},
		{"take_pending_rewards", On_action_take_pending_rewards},
	};

	char action[ACTION_SIZE];

	if (!Env::DocGetText("action", action, sizeof(action)))
		return OnError("Action not specified");

	auto it = std::find_if(VALID_ACTIONS.begin(), VALID_ACTIONS.end(), [&action](const auto& p) {
		return !strcmp(action, p.first);
	});

	if (it != VALID_ACTIONS.end()) {
		ContractID cid;
		Env::DocGet("cid", cid); 
		it->second(cid);
	} else {
		OnError("Invalid action");
	}
}
