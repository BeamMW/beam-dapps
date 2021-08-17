#pragma once

#include "Chromosome.h"
#include "Genotype.h"
#include "Phenotype.h"

struct Kitten
{
	Genotype genotype;
	Phenotype phenotype;

	Kitten() noexcept
	{
		genotype.setOfGenes = {
			Chromosome("body size: ", "big", "medium", "small"),
			Chromosome("type of eyes: ", "big", "medium", "small"),
			Chromosome("availability of fur: ", "yes", "no",
				DependentSignsAndConditionOfExpression
				(GeneState::Recessive,
					std::vector<Chromosome>
					{
						Chromosome("spots: ", "yes", "no"),
						Chromosome("type of fur: ", "straight", "wavy", "curly"),
						Chromosome("availability of color point: ", "yes", "no",
							DependentSignsAndConditionOfExpression
							(GeneState::Dominant,
								std::vector<Chromosome>
								{
									Chromosome("on paws: ", "yes", "no"),
									Chromosome("on ears: ", "yes", "no"),
									Chromosome("on tail: ", "yes", "no")
								}
							)
						)
					}
				)
			),
			Chromosome("tratatata: ", "A", "B")
		};
		genotype.generateGenotype();
		phenotype.getPhenotype(genotype.setOfGenes);
	}

	~Kitten() noexcept = default;
};
