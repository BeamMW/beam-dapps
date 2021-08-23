#pragma once
#include <random>

#include "Chromosome.h"

constexpr static int sid = 4583;
std::mt19937 mersenne(sid);

using genotype = std::vector<Chromosome>;

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
		setOfGenes.resize(size);
		for (auto chromosomeIt = setOfGenes.begin(); chromosomeIt != setOfGenes.end(); ++chromosomeIt)
		{
			generateChromosome(*chromosomeIt);
		}
	}

private:
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

};