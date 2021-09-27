#pragma once

#include "Genotype.h"
#include "Phenotype.h"

using CharacterId = uint32_t;

#pragma pack (push, 1)
class ICharacter
{
public:
	CharacterId id;
	Genotype genotype; // genotype of the character is the same for all kittens (different are only gene values)
	Phenotype phenotype; // phenotype of the character

	ICharacter() noexcept = default;
	virtual ~ICharacter() noexcept = default;
};
#pragma pack (pop)
