#pragma once
#include <map>

#include "Chromosome.h"
#include "Genotype.h"

struct Phenotype
{
	Phenotype() noexcept = default;
	~Phenotype() noexcept = default;

	using signName = std::string;
	using externalExpression = std::string;
	using phenotype = std::map<signName, externalExpression>;
	phenotype setOfSigns;

	void getGenMeaning(const Chromosome& Chromosome) noexcept
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
				getGenMeaning(*it);
			}
		}
	}

	void getPhenotype(const Genotype::genotype& genotype) noexcept
	{
		for (auto ChromosomeIt = genotype.cbegin(); ChromosomeIt != genotype.cend(); ++ChromosomeIt)
		{
			getGenMeaning(*ChromosomeIt);
		}
	}
};
