#pragma once
#include <iostream>

#include "Chromosome.h"
#include "Genotype.h"
#include "Phenotype.h"
#include "Statistics.h"

void printChromosome(const Chromosome& chromosome) noexcept
{
	static unsigned int countOfSpaces = 0;

	std::cout << static_cast<uint16_t>(chromosome.firstGene)
		<< static_cast<uint16_t>(chromosome.secondGene) << " "
		<< static_cast<uint16_t>(chromosome.typeOfDominance) << '\n';

	if (!chromosome.dependentSigns.signs.empty())
	{
		++countOfSpaces;
		for (auto it = chromosome.dependentSigns.signs.cbegin(); it != chromosome.dependentSigns.signs.cend(); ++it)
		{
			for (unsigned int i = 0; i < countOfSpaces; ++i)
			{
				std::cout << " ";
			}

			printChromosome(*it);
		}
	}
}

void printGenotype(Genotype& genotype) noexcept
{
	for (auto it = genotype.setOfGenes.cbegin(); it != genotype.setOfGenes.cend(); ++it)
	{
		printChromosome(*it);
	}
}

void printPhenotype(const Phenotype& phenotype) noexcept
{
	for (auto it = phenotype.setOfSigns.cbegin(); it != phenotype.setOfSigns.cend(); ++it)
	{
		std::cout << (*it).first << (*it).second << '\n';
	}
}

void printProbability(const genotype& genotype) noexcept
{
	Statistics st;
	auto signsExpressionProbability = st.getGeneralSignsExpressionProbability(genotype);
	for (auto it = signsExpressionProbability.cbegin(); it != signsExpressionProbability.cend(); ++it)
	{
		std::cout << (*it).first << "\n";
		for (auto it2 = (*it).second.cbegin(); it2 != (*it).second.cend(); ++it2)
		{
			std::cout << (*it2).first << " - " << (*it2).second << '\n';
		}
		std::cout << "\n";
	}
}