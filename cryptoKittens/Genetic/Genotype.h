#pragma once
#include <random>

#include "Chromosome.h"

constexpr static int sid = 4583;
std::mt19937 mersenne(sid);

/*
* Genotype - set of all genes 
*/
struct Genotype
{
	Genotype() noexcept = default;
	~Genotype() noexcept = default;

	genotype setOfGenes; // set of all genes

	// method for generation of gen value - Recessive or Dominant
	GeneState generateGenValue() noexcept
	{
		return (mersenne() % 2) ? GeneState::Recessive : GeneState::Dominant;
	}

	// method for generation of chromosome - setting values for all genes in chromosome
	void generateChromosome(Chromosome& chromosome) noexcept
	{
		chromosome.setGenes(generateGenValue(), generateGenValue());
	}
	
	// method for generation of genotype - setting values for chromosomes
	void generateGenotype() noexcept
	{
		for (auto chromosomeIt = setOfGenes.begin(); chromosomeIt != setOfGenes.end(); ++chromosomeIt)
		{
			generateChromosome(*chromosomeIt);
			if (!(*chromosomeIt).dependentSigns.signs.empty())
			{
				for (auto dependentChromosomeIt = (*chromosomeIt).dependentSigns.signs.begin();
					dependentChromosomeIt != (*chromosomeIt).dependentSigns.signs.end();
					++dependentChromosomeIt)
				{
					generateChromosome(*dependentChromosomeIt);
				}
			}
		}
	}
};
