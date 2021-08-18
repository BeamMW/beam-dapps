#pragma once
#include <map>

#include "Chromosome.h"
#include "Genotype.h"

/*
* Phenotype - set of all signs
*/
struct Phenotype
{
	Phenotype() noexcept {};
	~Phenotype() noexcept = default;

	phenotype setOfSigns; // set of all signs

	// method for setting all gene meanings in setOfSigns
	void setGenMeaning(const Chromosome& chromosome) noexcept
	{
		if (chromosome.typeOfDominance == TypeOfDominance::Complete)
		{
			if (chromosome.firstGene == GeneState::Recessive && chromosome.secondGene == GeneState::Recessive)
				setOfSigns.insert(std::make_pair(chromosome.signName, chromosome.recessiveGeneticExpression));
			else
				setOfSigns.insert(std::make_pair(chromosome.signName, chromosome.dominantGeneticExpression));
		}
		else
		{
			if (chromosome.firstGene == GeneState::Dominant && chromosome.secondGene == GeneState::Dominant)
				setOfSigns.insert(std::make_pair(chromosome.signName, chromosome.dominantGeneticExpression));
			else if (chromosome.firstGene == GeneState::Recessive && chromosome.secondGene == GeneState::Recessive)
				setOfSigns.insert(std::make_pair(chromosome.signName, chromosome.recessiveGeneticExpression));
			else
				setOfSigns.insert(std::make_pair(chromosome.signName, chromosome.interveningGeneticExpression));
		}


		if (!chromosome.dependentSigns.signs.empty() &&
			((chromosome.dependentSigns.baseGenePresence == BaseGenePresence::Presence 
				&& (chromosome.dependentSigns.baseGene == chromosome.firstGene 
					|| chromosome.dependentSigns.baseGene == chromosome.secondGene))
			|| (chromosome.dependentSigns.baseGenePresence == BaseGenePresence::Absence
				&& (chromosome.dependentSigns.baseGene != chromosome.firstGene 
					&& chromosome.dependentSigns.baseGene != chromosome.secondGene))))
		{
			for (auto it = chromosome.dependentSigns.signs.cbegin(); it != chromosome.dependentSigns.signs.cend(); ++it)
			{
				setGenMeaning(*it);
			}
		}
	}

	
	// method for setting phenotype from genotype
	void setPhenotype(const genotype& genotype) noexcept
	{
		for (auto ChromosomeIt = genotype.cbegin(); ChromosomeIt != genotype.cend(); ++ChromosomeIt)
		{
			setGenMeaning(*ChromosomeIt);
		}
	}
};
