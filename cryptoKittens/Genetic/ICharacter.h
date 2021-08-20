#pragma once

#include "Genotype.h"
#include "Phenotype.h"


struct ICharacter
{
	Genotype genotype; // genotype of the character is the same for all kittens (different are only gene values)
	Phenotype phenotype; // phenotype of the character

	ICharacter() noexcept = default;
	virtual ~ICharacter() noexcept = default;
};