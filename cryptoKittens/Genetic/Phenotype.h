#pragma once
#include <map>

#include "Chromosome.h"
#include "Genotype.h"
#include "Mask.h"

using signName = std::string_view;
using externalExpression = std::string_view;
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
	void setPhenotype(const genotype& genotype) noexcept
	{
		auto genotypeIt = genotype.cbegin();
		for (auto maskIt = mask.phenotypeMask.cbegin(); maskIt != mask.phenotypeMask.cend(); ++maskIt, ++genotypeIt)
		{
			setGenMeaning(*maskIt, genotypeIt);
		}
	}

private:
	// method for setting all gene meanings in setOfSigns
	void setGenMeaning(const ChromosomeMask& chromosomeMask, genotype::const_iterator& chromosomeIt) noexcept
	{
		const Chromosome chromosome = *chromosomeIt;
		if (chromosomeMask.typeOfDominance == TypeOfDominance::Complete)
		{
			if (chromosome.firstGene == GeneState::Recessive && chromosome.secondGene == GeneState::Recessive)
				setOfSigns.insert(std::make_pair(chromosomeMask.signName, chromosomeMask.recessiveGeneticExpression));
			else
				setOfSigns.insert(std::make_pair(chromosomeMask.signName, chromosomeMask.dominantGeneticExpression));
		}
		else
		{
			if (chromosome.firstGene == GeneState::Dominant && chromosome.secondGene == GeneState::Dominant)
				setOfSigns.insert(std::make_pair(chromosomeMask.signName, chromosomeMask.dominantGeneticExpression));
			else if (chromosome.firstGene == GeneState::Recessive && chromosome.secondGene == GeneState::Recessive)
				setOfSigns.insert(std::make_pair(chromosomeMask.signName, chromosomeMask.recessiveGeneticExpression));
			else
				setOfSigns.insert(std::make_pair(chromosomeMask.signName, chromosomeMask.interveningGeneticExpression));
		}


		if (!chromosomeMask.dependentSigns.signs.empty() &&
			((chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Presence
				&& (chromosomeMask.dependentSigns.baseGene == chromosome.firstGene
					|| chromosomeMask.dependentSigns.baseGene == chromosome.secondGene))
				|| (chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Absence
					&& (chromosomeMask.dependentSigns.baseGene != chromosome.firstGene
						&& chromosomeMask.dependentSigns.baseGene != chromosome.secondGene))))
		{
			for (auto it = chromosomeMask.dependentSigns.signs.cbegin(); it != chromosomeMask.dependentSigns.signs.cend(); ++it)
			{
				setGenMeaning(*it, ++chromosomeIt);
			}
		}
	}

};
#pragma pack (pop)
