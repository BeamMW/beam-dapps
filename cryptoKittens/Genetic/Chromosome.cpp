#include "Chromosome.h"

void Chromosome::setGenes(const GeneState firstGeneValue, const GeneState secondGeneValue) noexcept
{
	firstGene = firstGeneValue;
	secondGene = secondGeneValue;
}
