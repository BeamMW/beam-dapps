#pragma once
#include <map>

#include "Chromosome.h"
#include "Genotype.h"
#include "Mask.h"

using signName = std::string;
using externalExpression = std::string;
using phenotype = std::map<signName, externalExpression>;

#pragma pack (push, 1)
/*
* Phenotype - set of all signs
*/
class Phenotype
{
public:
	Phenotype() noexcept = default;
	~Phenotype() noexcept = default;

	phenotype setOfSigns; // set of all signs
	Mask mask; // set of general characteristics of each chromosome 

	// method for setting phenotype from genotype
	void setPhenotype(const genotype& genotype) noexcept;

private:
	// method for setting all gene meanings in setOfSigns
	void setGenMeaning(const ChromosomeMask& chromosomeMask, genotype::const_iterator& chromosomeIt) noexcept;
};
#pragma pack (pop)
