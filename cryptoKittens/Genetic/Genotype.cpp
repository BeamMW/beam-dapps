#include "Genotype.h"

void Genotype::generateGenotype(const uint16_t size) noexcept
{
	setOfGenes.resize(size);
	for (auto chromosomeIt = setOfGenes.begin(); chromosomeIt != setOfGenes.end(); ++chromosomeIt)
	{
		generateChromosome(*chromosomeIt);
	}
}
	
GeneState Genotype::generateGenValue() noexcept
{
	constexpr static int sid = 4583;
	std::mt19937 mersenne(sid);
	return (mersenne() % 2) ? GeneState::Recessive : GeneState::Dominant;
}

void Genotype::generateChromosome(Chromosome& chromosome) noexcept
{
	chromosome.setGenes(generateGenValue(), generateGenValue());
}
