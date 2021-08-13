#pragma once
#include <map>

#include "Chromosome.h"
#include "Genotype.h"

struct Phenotype
{
	Phenotype() noexcept = default;
	~Phenotype() noexcept = default;

	using phenotype = std::map<std::string, std::string>;
	phenotype setOfSigns;

	void getGenMeaning(const Chromosome& Chromosome) noexcept
	{
		if (Chromosome.typeOfDominance == TypeOfDominance::Complete)
		{
			if (Chromosome.firstGen == Gene::Recessive && Chromosome.secondGen == Gene::Recessive)
				setOfSigns.insert(std::make_pair(Chromosome.signName, Chromosome.recessiveGeneticExpression));
			else
				setOfSigns.insert(std::make_pair(Chromosome.signName, Chromosome.dominantGeneticExpression));
		}
		else
		{
			if (Chromosome.firstGen == Gene::Dominant && Chromosome.secondGen == Gene::Dominant)
				setOfSigns.insert(std::make_pair(Chromosome.signName, Chromosome.dominantGeneticExpression));
			else if (Chromosome.firstGen == Gene::Recessive && Chromosome.secondGen == Gene::Recessive)
				setOfSigns.insert(std::make_pair(Chromosome.signName, Chromosome.recessiveGeneticExpression));
			else
				setOfSigns.insert(std::make_pair(Chromosome.signName, Chromosome.interveningGeneticExpression));
		}


		if (!Chromosome.dependentSigns.signs.empty() &&
			((Chromosome.dependentSigns.firstGen == Chromosome.firstGen && Chromosome.dependentSigns.secondGen == Chromosome.secondGen)
				|| (Chromosome.dependentSigns.firstGen == Chromosome.secondGen && Chromosome.dependentSigns.secondGen == Chromosome.firstGen)))
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
