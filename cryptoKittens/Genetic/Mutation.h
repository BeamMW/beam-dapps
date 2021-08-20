#pragma once

#include "Chromosome.h"

// method for mutations of genes
void mutate(Chromosome& chromosome) noexcept
{
	static constexpr int mutationProbability = 1; // 1 per sent

	if (mersenne() <= mersenne.max() * mutationProbability / 100)
		(chromosome.firstGene == GeneState::Dominant) ? chromosome.firstGene = GeneState::Recessive : chromosome.firstGene = GeneState::Dominant;
	if (mersenne() <= mersenne.max() * mutationProbability / 100) 
		(chromosome.secondGene == GeneState::Dominant) ? chromosome.secondGene = GeneState::Recessive : chromosome.secondGene = GeneState::Dominant;
}
