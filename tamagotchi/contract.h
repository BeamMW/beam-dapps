#pragma once

#include "../common.h"
#include <string_view>

namespace Tamagotchi {
	// SID: 6953aec94fd3f4b4168fffab7985562452944ea4ebca047a0f26e69d37000c5e
	static const ShaderID s_SID = { 0x69,0x53,0xae,0xc9,0x4f,0xd3,0xf4,0xb4,0x16,0x8f,0xff,0xab,0x79,0x85,0x56,0x24,0x52,0x94,0x4e,0xa4,0xeb,0xca,0x04,0x7a,0x0f,0x26,0xe6,0x9d,0x37,0x00,0x0c,0x5e };

#pragma pack(push, 1)
	struct BaseTamagothiParameters
	{
		static const uint32_t s_iMethod = 2;
		std::string_view tamagotchiName;
		Height numberOfTamagotchiBirthBlock;
		PubKey playerPublicKey;
	};

	struct Attribute
	{
	protected:
		Height lastModificationOfTheAttribute;
		uint32_t percentageOfSatisfactionOfTheAttribute;
		uint64_t attributeChangingByOneTime;

	public:
		Height getLastModificationOfTheAttribute() { return lastModificationOfTheAttribute; }
		uint32_t getPercentageOfSatisfactionOfTheAttribute() { return percentageOfSatisfactionOfTheAttribute; }
		uint64_t getAttributeChangingByOneTime() { return attributeChangingByOneTime; }

		void setLastModificationOfTheAttribute(const Height lastModificationOfTheAttribute)
		{
			this->lastModificationOfTheAttribute = lastModificationOfTheAttribute;
		}
		void setPercentageOfSatisfactionOfTheAttribute(const uint32_t percentageOfSatisfactionOfTheAttribute)
		{
			this->percentageOfSatisfactionOfTheAttribute = percentageOfSatisfactionOfTheAttribute;
		}
		void setAttributeChangingByOneTime(const uint64_t attributeChangingByOneTime)
		{
			this->attributeChangingByOneTime = attributeChangingByOneTime;
		}

		Attribute()
			: percentageOfSatisfactionOfTheAttribute(100),
			lastModificationOfTheAttribute(0),
			attributeChangingByOneTime(1) {}

		friend Attribute operator+(const Attribute& att, uint32_t val);
		friend Attribute operator-(const Attribute& att, uint32_t val);
	};

	Attribute operator+(const Attribute& att, uint32_t val)
	{
		Attribute newAtt(att);
		newAtt.percentageOfSatisfactionOfTheAttribute += val;
		if (newAtt.percentageOfSatisfactionOfTheAttribute > 100) { newAtt.percentageOfSatisfactionOfTheAttribute = 100; }
		newAtt.lastModificationOfTheAttribute = Env::get_Height();
		return newAtt;
	}
	Attribute operator-(const Attribute& att, uint32_t val)
	{
		Attribute newAtt(att);
		if (newAtt.percentageOfSatisfactionOfTheAttribute <= val) { newAtt.percentageOfSatisfactionOfTheAttribute = 0; }
		else { newAtt.percentageOfSatisfactionOfTheAttribute -= val; }
		newAtt.lastModificationOfTheAttribute = Env::get_Height();
		return newAtt;
	}

	struct Satiety : Attribute {};
	struct Mood : Attribute {};
	struct Liveliness : Attribute {};

	struct State
	{
	public:
		enum class States
		{
			Inactivity,
			Sleeping,
			Playing,
			Stroking,
			Eating,
			Died
		};

	public:
		State() {};
		State(States currentState, uint64_t stateDuration) : currentState(currentState), stateDuration(stateDuration) {}

		States getCurrentState() { return currentState; }
		Height getHeightOfTransitionToState() { return heightOfTransitionToState; }
		uint64_t getStateDuration() { return stateDuration; }

		void setHeightOfTransitionToState(const Height heightOfTransitionToState)
		{
			this->heightOfTransitionToState = heightOfTransitionToState;
		}

	protected:
		States currentState;

		Height heightOfTransitionToState;
		uint64_t stateDuration;
	};

	struct Inactivity : State
	{
		Inactivity() : State(State::States::Inactivity, 0) {}
	};
	struct Sleeping : State
	{
		Sleeping() : State(State::States::Sleeping, 10) {}
	};
	struct Playing : State
	{
		Playing() : State(State::States::Playing, 3) {}
	};
	struct Stroking : State
	{
		Stroking() : State(State::States::Stroking, 2) {}
	};
	struct Eating : State
	{
		Eating() : State(State::States::Eating, 10) {}
	};
	struct Die : State
	{
		Die() : State(State::States::Died, 0) {}
	};

	struct Tamagotchi
	{
	protected:
		BaseTamagothiParameters baseTamagothiParameters;

		Attribute satiety;
		Attribute mood;
		Attribute liveliness;
		Height heightOfChangingAttributeValues;

		State state;

		std::string_view getCurrentState()
		{
			switch (state.getCurrentState())
			{
			case State::States::Inactivity:
				return "";
			case State::States::Died:
				return "died";
			case State::States::Eating:
				return "eating";
			case State::States::Playing:
				return "playing";
			case State::States::Stroking:
				return "stroking";
			case State::States::Sleeping:
				return "sleeping";
			}
		}
		/*std::string_view*/bool interractWithTamagotchi(const State newState, const std::string_view interraction)
		{
			changeStateAndAttributes();
			std::string_view currentState = getCurrentState();
			if (currentState == "")
			{
				state = newState;
				state.setHeightOfTransitionToState(Env::get_Height());
				//	return("Now tamagotchi is " /*+ interraction*/);
				return true;
			}
			return false;
			//return ("Sorry, but tamagotchi is now unawailable. He cann't " /*+ interraction + " because he is " + currentState*/);
		}
	public:
		BaseTamagothiParameters getBaseTamagothiParameters() { return baseTamagothiParameters; }
		Attribute getSatiety() { return satiety; }
		Attribute getMood() { return mood; }
		Attribute getLiveliness() { return liveliness; }
		State getState() { return state; }
		Height getHeightOfChangingAttributeValues() { return heightOfChangingAttributeValues; }

		Tamagotchi() : state(Inactivity()) {}
		Tamagotchi(const BaseTamagothiParameters& baseTamagothiParameters) :
			baseTamagothiParameters(baseTamagothiParameters), state(Inactivity())
		{
			satiety.setLastModificationOfTheAttribute(this->baseTamagothiParameters.numberOfTamagotchiBirthBlock);
			mood.setLastModificationOfTheAttribute(this->baseTamagothiParameters.numberOfTamagotchiBirthBlock);
			liveliness.setLastModificationOfTheAttribute(this->baseTamagothiParameters.numberOfTamagotchiBirthBlock);
			state.setHeightOfTransitionToState(this->baseTamagothiParameters.numberOfTamagotchiBirthBlock);
			setHeightOfChangingAttributeValues(this->baseTamagothiParameters.numberOfTamagotchiBirthBlock);
		}

		void setHeightOfChangingAttributeValues(const Height heightOfChangingAttributeValues)
		{
			this->heightOfChangingAttributeValues = heightOfChangingAttributeValues;
		}

		void changeStateAndAttributes()
		{
			// если тамагочи мерт то все
			if (this->state.getCurrentState() == State::States::Died)
			{
				return;
			}

			//если все на нуле - смерть
			if (this->satiety.getPercentageOfSatisfactionOfTheAttribute() == 0 &&
				this->mood.getPercentageOfSatisfactionOfTheAttribute() == 0 &&
				this->liveliness.getPercentageOfSatisfactionOfTheAttribute() == 0)
			{
				this->state = Die();
				return;
			}

			//текущая высота блока
			Height currentHeight = Env::get_Height();

			// если полседний раз изменялось состояние сейчас то ничего не делаем
			if (heightOfChangingAttributeValues == currentHeight) return;

			uint32_t numberOfBlocksInInactivityState = 0;
			uint32_t numberOfBlocksInActiveState = 0;

			//если состояние было изменено в тот же блок - ничего
			if (currentHeight == state.getHeightOfTransitionToState()) return;
			//если аттрубты было изменено в тот же блок - ничего
			if (currentHeight == heightOfChangingAttributeValues) return;

			if (state.getCurrentState() != State::States::Inactivity) {
				// если с момента измения состояния прошло столько блоков сколько оно должно было длится
				// то колво блоков в активном состоянии = колво оставшихся блоков на которых не было изменено состояние
				if (state.getHeightOfTransitionToState() + state.getStateDuration() == currentHeight)
				{
					numberOfBlocksInActiveState = currentHeight - heightOfChangingAttributeValues;
				}
				// иначе если еще не закончено дейтсвие
				else if (state.getHeightOfTransitionToState() + state.getStateDuration() > currentHeight)
				{
					numberOfBlocksInActiveState = currentHeight - heightOfChangingAttributeValues;
				}
				// иначе за промежуток между вызовами блоков прошло столько блокв, что тамагочи успел закончить заниматься делами и перейтив  сотояние ничегонеделанья
				else
				{
					numberOfBlocksInInactivityState = currentHeight - state.getHeightOfTransitionToState() - state.getStateDuration();
					numberOfBlocksInActiveState = currentHeight - heightOfChangingAttributeValues - numberOfBlocksInInactivityState;
				}
			}
			else
			{
				numberOfBlocksInInactivityState = currentHeight - heightOfChangingAttributeValues;
			}

			//изменяем параметры жизни по правилу нахождения в активной состоянии
			switch (this->state.getCurrentState())
			{
			case State::States::Eating:
			{
				satiety = satiety + satiety.getAttributeChangingByOneTime() * numberOfBlocksInActiveState;
				mood = mood + 2 * mood.getAttributeChangingByOneTime() * numberOfBlocksInActiveState;
				liveliness = liveliness - 2 * liveliness.getAttributeChangingByOneTime() * numberOfBlocksInActiveState;
				break;
			}
			case State::States::Playing:
			{
				satiety = satiety - 2 * satiety.getAttributeChangingByOneTime() * numberOfBlocksInActiveState;
				mood = mood + mood.getAttributeChangingByOneTime() * numberOfBlocksInActiveState;
				liveliness = liveliness - 2 * liveliness.getAttributeChangingByOneTime() * numberOfBlocksInActiveState;
				break;
			}
			case State::States::Stroking:
			{
				satiety = satiety - 2 * satiety.getAttributeChangingByOneTime() * numberOfBlocksInActiveState;
				mood = mood + mood.getAttributeChangingByOneTime() * numberOfBlocksInActiveState;
				liveliness = liveliness - 2 * liveliness.getAttributeChangingByOneTime() * numberOfBlocksInActiveState;
				break;
			}
			case State::States::Sleeping:
			{
				mood = mood + 2 * mood.getAttributeChangingByOneTime() * numberOfBlocksInActiveState;
				liveliness = liveliness + liveliness.getAttributeChangingByOneTime() * numberOfBlocksInActiveState;
				break;
			}
			default:
				break;
			}

			// изменяем параметры жизни по правилу нахождения в бездействии
			satiety = satiety - numberOfBlocksInInactivityState * satiety.getAttributeChangingByOneTime();
			mood = mood - numberOfBlocksInInactivityState * mood.getAttributeChangingByOneTime();
			liveliness = liveliness - numberOfBlocksInInactivityState * liveliness.getAttributeChangingByOneTime();

			// утсанавливаем выосту изменения аттрибутов
			heightOfChangingAttributeValues = currentHeight;

			// если тамагочи закончил свои дела в инаактивити его
			if (state.getHeightOfTransitionToState() + state.getStateDuration() == currentHeight)
			{
				state = Inactivity();
				state.setHeightOfTransitionToState(currentHeight);
			}
			else if (state.getHeightOfTransitionToState() + state.getStateDuration() < currentHeight)
			{
				state = Inactivity();
				state.setHeightOfTransitionToState(state.getHeightOfTransitionToState() + state.getStateDuration());
			}
		}

		bool play()
		{
			return interractWithTamagotchi(Playing(), "play");
		}
		bool stroke()
		{
			return interractWithTamagotchi(Stroking(), "stroke");
		}
		bool sleep()
		{
			return interractWithTamagotchi(Sleeping(), "sleep");
		}
		bool wakeUp()
		{
			return interractWithTamagotchi(Inactivity(), "wake up");
		}
		bool eat()
		{
			return interractWithTamagotchi(Eating(), "eat");
		}
	};

	struct FeedTamagotchiParameters
	{
		static const uint32_t s_iMethod = 3;
		PubKey playerPublicKey;
	};

	struct StrokeTamagotchiParameters
	{
		static const uint32_t s_iMethod = 4;
		PubKey playerPublicKey;
	};

	struct PlayWithPutTamagotchiToBedParameters
	{
		static const uint32_t s_iMethod = 5;
		PubKey playerPublicKey;
	};

	struct PutTamagotchiToBedParameters
	{
		static const uint32_t s_iMethod = 6;
		PubKey playerPublicKey;
	};

	struct WakeUpTamagotchiParameters
	{
		static const uint32_t s_iMethod = 7;
		PubKey playerPublicKey;
	};

	struct GetCurrentTamagotchiStateParameters
	{
		static const uint32_t s_iMethod = 8;
		PubKey playerPublicKey;
	};

#pragma pack(pop)
}
