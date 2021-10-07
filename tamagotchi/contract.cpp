#include "../common.h"
#include "../app_common_impl.h"
#include "contract.h"
#include <string>

BEAM_EXPORT void Ctor(void*) {}

BEAM_EXPORT void Dtor(void*) {}

//new_game
BEAM_EXPORT void Method_2(const Tamagotchi::BaseTamagothiParameters& params)
{
	Tamagotchi::Tamagotchi tamagotchi(params);

	Env::SaveVar_T(params.playerPublicKey, tamagotchi);
}

//feed_tamagotchi
BEAM_EXPORT void Method_3(const Tamagotchi::FeedTamagotchiParameters& params)
{
	Tamagotchi::Tamagotchi tamagotchi;
	Env::LoadVar_T(params.playerPublicKey, tamagotchi);

	Env::Halt_if(!tamagotchi.eat());

	Env::SaveVar_T(params.playerPublicKey, tamagotchi);
}

//stroke_tamagotchi
BEAM_EXPORT void Method_4(const Tamagotchi::StrokeTamagotchiParameters& params)
{
	Tamagotchi::Tamagotchi tamagotchi;
	Env::LoadVar_T(params.playerPublicKey, tamagotchi);

	Env::Halt_if(!tamagotchi.stroke());

	Env::SaveVar_T(params.playerPublicKey, tamagotchi);
}

//play_with_tamagotchi
BEAM_EXPORT void Method_5(const Tamagotchi::PlayWithPutTamagotchiToBedParameters& params)
{
	Tamagotchi::Tamagotchi tamagotchi;
	Env::LoadVar_T(params.playerPublicKey, tamagotchi);

	tamagotchi.play();
	Env::Halt_if(!tamagotchi.play());

	Env::SaveVar_T(params.playerPublicKey, tamagotchi);
}

//put_tamagotchi_to_bed
BEAM_EXPORT void Method_6(const Tamagotchi::PutTamagotchiToBedParameters& params)
{
	Tamagotchi::Tamagotchi tamagotchi;
	Env::LoadVar_T(params.playerPublicKey, tamagotchi);

	Env::Halt_if(!tamagotchi.sleep());
	
	Env::SaveVar_T(params.playerPublicKey, tamagotchi);
}

//wake_up_tamagotchi
BEAM_EXPORT void Method_7(const Tamagotchi::WakeUpTamagotchiParameters& params)
{
	Tamagotchi::Tamagotchi tamagotchi;
	Env::LoadVar_T(params.playerPublicKey, tamagotchi);

	//если тамагочи не спит, его нельзя разбудить
	Env::Halt_if(tamagotchi.getState().getCurrentState() != Tamagotchi::State::States::Sleeping);
	//если тамагочи не выспался нельзя его разбудить
	Env::Halt_if(!tamagotchi.wakeUp());

	Env::SaveVar_T(params.playerPublicKey, tamagotchi);
}

//get_current_tamagotchi_state
BEAM_EXPORT void Method_8(const Tamagotchi::GetCurrentTamagotchiStateParameters& params)
{
	Tamagotchi::Tamagotchi tamagotchi;
	Env::LoadVar_T(params.playerPublicKey, tamagotchi);
	
	tamagotchi.changeStateAndAttributes();

	Env::SaveVar_T(params.playerPublicKey, tamagotchi);
}
