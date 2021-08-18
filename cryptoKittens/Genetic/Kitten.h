#pragma once

#include "Chromosome.h"
#include "Genotype.h"
#include "Phenotype.h"

/*
* Kitten - entity with genotype and phenotype
*/
struct Kitten
{
	Genotype genotype; // genotype of the kitten is the same for all kittens (different are only gene values)
	Phenotype phenotype; // phenotype of the kitten

	Kitten() noexcept
	{
		// creating general scheme for kittens genotype
		genotype.setOfGenes = {
			Chromosome("body size: ", "big", "medium", "small"),
			Chromosome("type of eyes: ", "big", "medium", "small"),
			Chromosome("availability of fur: ", "yes", "no",
				DependentSignsAndConditionOfExpression
				(GeneState::Recessive, BaseGenePresence::Absence,
					{
						Chromosome("spots: ", "yes", "no"),
						Chromosome("type of fur: ", "straight", "wavy", "curly"),
						Chromosome("availability of color point: ", "yes", "no",
							DependentSignsAndConditionOfExpression
							(GeneState::Dominant, BaseGenePresence::Presence,
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
		// setting individual genes values in genotype
		genotype.generateGenotype();
		// creating phenotype of the kitten from its genotype
		phenotype.setPhenotype(genotype.setOfGenes);
	}

	~Kitten() noexcept = default;
};
