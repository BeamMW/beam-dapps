#pragma once

#include "Kitten.h"

Kitten crossover(const Kitten& firstParent, const Kitten& secondParent) noexcept
{
	Kitten child;

	auto childIt = child.genotype.setOfGenes.begin();
	for (auto firstParentIt = firstParent.genotype.setOfGenes.cbegin(),
		secondParentIt = secondParent.genotype.setOfGenes.cbegin();
		childIt != child.genotype.setOfGenes.end();
		++firstParentIt, ++secondParentIt, ++childIt)
	{
		(mersenne() % 2) ? (*childIt).firstGen = (*firstParentIt).firstGen : (*secondParentIt).firstGen;
		(mersenne() % 2) ? (*childIt).secondGen = (*secondParentIt).secondGen : (*firstParentIt).secondGen;
	}

	return child;
}
