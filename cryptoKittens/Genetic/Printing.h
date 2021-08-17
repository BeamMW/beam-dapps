#pragma once
#include <iostream>

#include "Chromosome.h"
#include "Genotype.h"
#include "Phenotype.h"

void printChromosome(const Chromosome& lok) noexcept
{
	static unsigned int countOfSpaces = 0;

	std::cout << static_cast<uint16_t>(lok.firstGene)
		<< static_cast<uint16_t>(lok.secondGene) << " "
		<< static_cast<uint16_t>(lok.typeOfDominance) << '\n';

	if (!lok.dependentSigns.signs.empty())
	{
		++countOfSpaces;
		for (auto it = lok.dependentSigns.signs.cbegin(); it != lok.dependentSigns.signs.cend(); ++it)
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
