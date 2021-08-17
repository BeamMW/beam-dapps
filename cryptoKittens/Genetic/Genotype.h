#pragma once
#include <random>

#include "Chromosome.h"

constexpr static int sid = 4583;
std::mt19937 mersenne(sid);

struct Genotype
{
	Genotype() noexcept = default;
	~Genotype() noexcept = default;

	using genotype = std::vector<Chromosome>;
	genotype setOfGenes;

	GeneState generateGenValue() noexcept
	{
		return (mersenne() % 2) ? GeneState::Recessive : GeneState::Dominant;
	}

	void generateChromosome(Chromosome& Chromosome) noexcept
	{
		Chromosome.setGenes(generateGenValue(), generateGenValue());
		if (!Chromosome.dependentSigns.signs.empty())
		{
			for (auto it = Chromosome.dependentSigns.signs.begin(); it != Chromosome.dependentSigns.signs.end(); ++it)
			{
				generateChromosome(*it);
			}
		}
	}

	void generateGenotype() noexcept
	{
		for (auto it = setOfGenes.begin(); it != setOfGenes.end(); ++it)
		{
			generateChromosome(*it);
		}
	}
};
