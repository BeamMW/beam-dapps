#pragma once

#include "Kitten.h"

// method for crossover kittens
Kitten crossover(const Kitten& firstParent, const Kitten& secondParent) noexcept
{
	Kitten child;

	auto childIt = child.genotype.setOfGenes.begin();
	for (auto firstParentIt = firstParent.genotype.setOfGenes.cbegin(),
		secondParentIt = secondParent.genotype.setOfGenes.cbegin();
		childIt != child.genotype.setOfGenes.end();
		++firstParentIt, ++secondParentIt, ++childIt)
	{
		(mersenne() % 2) ? (*childIt).firstGene = (*firstParentIt).firstGene : (*secondParentIt).firstGene;
		(mersenne() % 2) ? (*childIt).secondGene = (*secondParentIt).secondGene : (*firstParentIt).secondGene;
	}

	return child;
}
