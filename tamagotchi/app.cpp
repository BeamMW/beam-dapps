#include "../common.h"
#include "../app_common_impl.h"
#include "contract.h"
#include <vector>

void On_error(const char* msg)
{
	Env::DocGroup root("");
	{
		Env::DocAddText("error", msg);
		Env::DocAddText("error", msg);
	}
}

// MANAGER actions
void On_action_create_contract(const ContractID& unused)
{
	constexpr uint16_t ctorMethodNumber = 0;
	Env::GenerateKernel(nullptr, ctorMethodNumber, nullptr, 0, nullptr, 0, nullptr, 0, "Create Tamagotchi contract", 0);
}

void On_action_destroy_contract(const ContractID& cid)
{
	constexpr uint16_t dtorMethodNumber = 1;
	Env::GenerateKernel(&cid, dtorMethodNumber, nullptr, 0, nullptr, 0, nullptr, 0, "Destroy Tamagotchi contract", 0);
}

void On_action_view_contracts(const ContractID& unused)
{
	EnumAndDumpContracts(Tamagotchi::s_SID);
}

//PLAYER actions
void On_action_new_game(const ContractID& cid)
{
	char tamagotchiName[0x20];
	uint32_t nNameSize = 0; 
	nNameSize = Env::DocGetText("tamagotchi_name", tamagotchiName, sizeof(tamagotchiName));
	if (nNameSize < 2)
	{
		On_error("tamagotchi_name should be non-empty");
	}

	Tamagotchi::BaseTamagothiParameters params;
	params.tamagotchiName = tamagotchiName;
	params.numberOfTamagotchiBirthBlock = Env::get_Height();
	Env::DerivePk(params.playerPublicKey, &cid, sizeof(cid));
	

	Tamagotchi::Tamagotchi tamagotchi(params);
	Env::DocAddText("name", tamagotchi.getBaseTamagothiParameters().tamagotchiName.data());


	Env::GenerateKernel(&cid, Tamagotchi::BaseTamagothiParameters::s_iMethod, &params, sizeof(params), nullptr, 0, nullptr, 0, "Create new game and new Tamagotchi", 0);
}

void On_action_feed_tamagotchi(const ContractID& cid)
{
	Tamagotchi::FeedTamagotchiParameters params;
	Env::DerivePk(params.playerPublicKey, &cid, sizeof(cid));

	Env::GenerateKernel(&cid, Tamagotchi::FeedTamagotchiParameters::s_iMethod, &params, sizeof(params), nullptr, 0, nullptr, 0, "Feed tamagotchi", 0);
}

void On_action_stroke_tamagotchi(const ContractID& cid)
{
	Tamagotchi::StrokeTamagotchiParameters params;
	Env::DerivePk(params.playerPublicKey, &cid, sizeof(cid));

	Env::GenerateKernel(&cid, Tamagotchi::StrokeTamagotchiParameters::s_iMethod, &params, sizeof(params), nullptr, 0, nullptr, 0, "Stroke tamagotchi", 0);
}

void On_action_play_with_tamagotchi(const ContractID& cid)
{
	Tamagotchi::PlayWithPutTamagotchiToBedParameters params;
	Env::DerivePk(params.playerPublicKey, &cid, sizeof(cid));

	Env::GenerateKernel(&cid, Tamagotchi::PlayWithPutTamagotchiToBedParameters::s_iMethod, &params, sizeof(params), nullptr, 0, nullptr, 0, "Play with tamagotchi", 0);
}

void On_action_put_tamagotchi_to_bed(const ContractID& cid)
{
	Tamagotchi::PutTamagotchiToBedParameters params;
	Env::DerivePk(params.playerPublicKey, &cid, sizeof(cid));

	Env::GenerateKernel(&cid, Tamagotchi::PutTamagotchiToBedParameters::s_iMethod, &params, sizeof(params), nullptr, 0, nullptr, 0, "Put tamagotchi to bed", 0);
}

void On_action_wake_up_tamagotchi(const ContractID& cid)
{
	Tamagotchi::WakeUpTamagotchiParameters params;
	Env::DerivePk(params.playerPublicKey, &cid, sizeof(cid));

	Env::GenerateKernel(&cid, Tamagotchi::WakeUpTamagotchiParameters::s_iMethod, &params, sizeof(params), nullptr, 0, nullptr, 0, "Wake up tamagotchi", 0);
}

void On_action_get_current_tamagotchi_state(const ContractID& cid)
{
	Tamagotchi::Tamagotchi tamagotchi;
	PubKey player;
	Env::DerivePk(player, &cid, sizeof(cid));

	Env::Key_T<PubKey> k;
	k.m_Prefix.m_Cid = cid;
	k.m_KeyInContract = player;

	if (Env::VarReader::Read_T(k, tamagotchi))
	{
		tamagotchi.changeStateAndAttributes();

		Env::DocGroup root("");
		{
			Env::DocAddText("name", tamagotchi.getBaseTamagothiParameters().tamagotchiName.data());
			Env::DocAddNum32("currentBlock", Env::get_Height());
			Env::DocAddNum32("numberOfTamagotchiBirthBlock", tamagotchi.getBaseTamagothiParameters().numberOfTamagotchiBirthBlock);
			Env::DocAddNum32("satiety", tamagotchi.getSatiety().getPercentageOfSatisfactionOfTheAttribute());
			Env::DocAddNum32("liveliness", tamagotchi.getLiveliness().getPercentageOfSatisfactionOfTheAttribute());
			Env::DocAddNum32("mood", tamagotchi.getMood().getPercentageOfSatisfactionOfTheAttribute());
			switch (tamagotchi.getState().getCurrentState()) {
			case Tamagotchi::State::States::Inactivity:
				Env::DocAddText("state", "inactivity");
				break;
			case Tamagotchi::State::States::Died:
				Env::DocAddText("state", "died");
				break;
			case Tamagotchi::State::States::Eating:
				Env::DocAddText("state", "eating");
				break;
			case Tamagotchi::State::States::Playing:
				Env::DocAddText("state", "playing");
				break;
			case Tamagotchi::State::States::Stroking:
				Env::DocAddText("state", "stroking");
				break;
			case Tamagotchi::State::States::Sleeping:
				Env::DocAddText("state", "sleeping");
				break;
			}
		}
	}
	else
	{
		On_error("cann't get state");
	}

	Tamagotchi::GetCurrentTamagotchiStateParameters params;
	Env::DerivePk(params.playerPublicKey, &cid, sizeof(cid));
	params.tamagotchi = tamagotchi;

	Env::GenerateKernel(&cid, Tamagotchi::GetCurrentTamagotchiStateParameters::s_iMethod, &params, sizeof(params), nullptr, 0, nullptr, 0, "Get current tamagotchi state", 0);
}

template <typename T>
auto find_if_contains(const char* str, const std::vector<std::pair<const char *, T>>& v) {
	return std::find_if(v.begin(), v.end(), [&str](const auto& p) {
		return !strcmp(str, p.first);
	});
}

BEAM_EXPORT void Method_0()
{
    Env::DocGroup root("");
    {
		Env::DocGroup gr("roles");
		{
			Env::DocGroup grRole("manager");
			{
				Env::DocGroup grMethod("create_contract");
			}
			{
				Env::DocGroup grMethod("destroy_contract");
				Env::DocAddText("cid", "ContractID");
			}
			{
				Env::DocGroup grMethod("view_contracts");
			}
		}
		{
			Env::DocGroup grRole("player");
			{
				Env::DocGroup grMethod("new_game");
				Env::DocAddText("cid", "ContractID");
				Env::DocAddText("tamagotchi_name", "string");
			}
			{
				Env::DocGroup grMethod("feed_tamagotchi");
				Env::DocAddText("cid", "ContractID");
			}
			{
				Env::DocGroup grMethod("stroke_tamagotchi");
				Env::DocAddText("cid", "ContractID");
			}
			{
				Env::DocGroup grMethod("play_with_tamagotchi");
				Env::DocAddText("cid", "ContractID");
			}
			{
				Env::DocGroup grMethod("put_tamagotchi_to_bed");
				Env::DocAddText("cid", "ContractID");
			}
			{
				Env::DocGroup grMethod("wake_up_tamagotchi");
				Env::DocAddText("cid", "ContractID");
			}
			{
				Env::DocGroup grMethod("get_current_tamagotchi_state");
				Env::DocAddText("cid", "ContractID");
			}
		}
	}
}

BEAM_EXPORT void Method_1()
{
	constexpr size_t ACTION_BUF_SIZE = 32;
	constexpr size_t ROLE_BUF_SIZE = 16;
	using Action_func_t = void (*)(const ContractID&);

	const std::vector<std::pair<const char *, Action_func_t>> VALID_MANAGER_ACTIONS = 
	{
		{"create_contract", On_action_create_contract},
		{"destroy_contract", On_action_destroy_contract},
		{"view_contracts", On_action_view_contracts}
	};

	const std::vector<std::pair<const char*, Action_func_t>> VALID_PLAYER_ACTIONS = 
	{
		{"new_game", On_action_new_game},
		{"feed_tamagotchi", On_action_feed_tamagotchi},
		{"stroke_tamagotchi", On_action_stroke_tamagotchi},
		{"play_with_tamagotchi", On_action_play_with_tamagotchi},
		{"put_tamagotchi_to_bed", On_action_put_tamagotchi_to_bed},
		{"wake_up_tamagotchi", On_action_wake_up_tamagotchi},
		{"get_current_tamagotchi_state", On_action_get_current_tamagotchi_state}
	};


	const std::vector<std::pair<const char *, const std::vector<std::pair<const char *, Action_func_t>>&>> 
		VALID_ROLES = 
	{
		{"manager", VALID_MANAGER_ACTIONS},
		{"player", VALID_PLAYER_ACTIONS}
	};

	char action[ACTION_BUF_SIZE], role[ROLE_BUF_SIZE];

	if (!Env::DocGetText("role", role, sizeof(role))) 
	{
		return On_error("Role not specified");
	}
	
	auto it_role = find_if_contains(role, VALID_ROLES);
	if (it_role == VALID_ROLES.end()) 
	{
		return On_error("Invalid role");
	}

	if (!Env::DocGetText("action", action, sizeof(action))) 
	{
		return On_error("Action not specified");
	}

	auto it_action = find_if_contains(action, it_role->second); 
	if (it_action != it_role->second.end()) {
		ContractID cid;
		Env::DocGet("cid", cid); 
		it_action->second(cid);
	} 
	else 
	{
		On_error("Invalid action");
	}
}
