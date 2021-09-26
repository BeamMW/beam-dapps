#pragma once
#include <random>

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
	void generateGenotype(const uint16_t size) noexcept;

private:
	// method for generation of gen value - Recessive or Dominant
	GeneState generateGenValue() noexcept;

	// method for generation of chromosome - setting values for all genes in chromosome
	void generateChromosome(Chromosome& chromosome) noexcept;

};
#pragma pack (pop)
