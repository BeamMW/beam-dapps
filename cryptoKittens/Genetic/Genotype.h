#pragma once
//#include <random>

#include "Chromosome.h"

using genotype = std::deque<Chromosome>;

#pragma pack (push, 1)
/*
* Genotype - set of all genes 
*/
class Genotype
{
public:
	Genotype() noexcept = default;
	~Genotype() noexcept = default;

	genotype setOfGenes; // set of all genes

	// method for generation of genotype - setting values for chromosomes
	void generateGenotype(const uint16_t size) noexcept
	{
		//setOfGenes.resize(size);
		for (auto chromosomeIt = setOfGenes.begin(); chromosomeIt != setOfGenes.end(); ++chromosomeIt)
		{
			generateChromosome(*chromosomeIt);
		}
	}

private:
	// method for generation of gen value - Recessive or Dominant
	GeneState generateGenValue() noexcept
	{
		//constexpr static int sid = 4583;
		//std::mt19937 mersenne(sid);
		return /*(mersenne() % 2) ? GeneState::Recessive : */ GeneState::Dominant;
	}


	// method for generation of chromosome - setting values for all genes in chromosome
	void generateChromosome(Chromosome& chromosome) noexcept
	{
		chromosome.setGenes(generateGenValue(), generateGenValue());
	}

};
#pragma pack (pop)
