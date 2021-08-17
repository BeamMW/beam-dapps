#pragma once
#include <map>

#include "Chromosome.h"
#include "Genotype.h"

/*
* Phenotype - set of all signs
*/
struct Phenotype
{
	Phenotype() noexcept = default;
	~Phenotype() noexcept = default;

	using signName = std::string;
	using externalExpression = std::string;
	using phenotype = std::map<signName, externalExpression>;
	phenotype setOfSigns; // set of all signs

	// method for setting all gene meanings in setOfSigns
	void setGenMeaning(const Chromosome& Chromosome) noexcept
	{
		if (Chromosome.typeOfDominance == TypeOfDominance::Complete)
		{
			if (Chromosome.firstGene == GeneState::Recessive && Chromosome.secondGene == GeneState::Recessive)
				setOfSigns.insert(std::make_pair(Chromosome.signName, Chromosome.recessiveGeneticExpression));
			else
				setOfSigns.insert(std::make_pair(Chromosome.signName, Chromosome.dominantGeneticExpression));
		}
		else
		{
			if (Chromosome.firstGene == GeneState::Dominant && Chromosome.secondGene == GeneState::Dominant)
				setOfSigns.insert(std::make_pair(Chromosome.signName, Chromosome.dominantGeneticExpression));
			else if (Chromosome.firstGene == GeneState::Recessive && Chromosome.secondGene == GeneState::Recessive)
				setOfSigns.insert(std::make_pair(Chromosome.signName, Chromosome.recessiveGeneticExpression));
			else
				setOfSigns.insert(std::make_pair(Chromosome.signName, Chromosome.interveningGeneticExpression));
		}


		if (!Chromosome.dependentSigns.signs.empty() &&
			(Chromosome.dependentSigns.baseGene == Chromosome.firstGene || Chromosome.dependentSigns.baseGene == Chromosome.secondGene))
		{
			for (auto it = Chromosome.dependentSigns.signs.cbegin(); it != Chromosome.dependentSigns.signs.cend(); ++it)
			{
				setGenMeaning(*it);
			}
		}
	}

	// method for getting phenotype from genotype
	void getPhenotype(const Genotype::genotype& genotype) noexcept
	{
		for (auto ChromosomeIt = genotype.cbegin(); ChromosomeIt != genotype.cend(); ++ChromosomeIt)
		{
			setGenMeaning(*ChromosomeIt);
		}
	}
};
