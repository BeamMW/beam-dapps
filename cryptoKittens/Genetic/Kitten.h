#pragma once

#include "Chromosome.h"
#include "ICharacter.h"

#pragma pack (push, 1)
/*
* Kitten - entity with genotype and phenotype
*/
class Kitten : public ICharacter
{
public:
	Kitten() noexcept;

	~Kitten() noexcept = default;
};
#pragma pack (pop)
