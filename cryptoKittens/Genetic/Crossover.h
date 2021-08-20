#pragma once

#include "ICharacter.h"
#include "Mutation.h"

// method for crossover kittens
genotype crossover(const genotype& firstParentGenotype, const genotype& secondParentGenotype) noexcept
{
	genotype childGenotype;
	auto childGenotypeIt = childGenotype.begin();
	for (auto firstParentGenotypeIt = firstParentGenotype.cbegin(), 
		secondParentGenotypeIt = secondParentGenotype.cbegin();
		childGenotypeIt != childGenotype.end();
		++firstParentGenotypeIt, ++secondParentGenotypeIt, ++childGenotypeIt)
	{
		(mersenne() % 2) ? (*childGenotypeIt).firstGene = (*firstParentGenotypeIt).firstGene : (*secondParentGenotypeIt).firstGene;
		(mersenne() % 2) ? (*childGenotypeIt).secondGene = (*secondParentGenotypeIt).secondGene : (*firstParentGenotypeIt).secondGene;

		mutate(*childGenotypeIt);
	}
	return childGenotype;
}
