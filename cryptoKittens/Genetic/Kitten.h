#pragma once

#include "Chromosome.h"
#include "ICharacter.h"

/*
* Kitten - entity with genotype and phenotype
*/
class Kitten : public ICharacter
{
public:
	Kitten() noexcept
	{
		// creating general scheme for kittens genotype
		phenotype.mask.phenotypeMask = {
			ChromosomeMask("body size: ", "big", "medium", "small"),
			ChromosomeMask("type of eyes: ", "big", "medium", "small"),
			ChromosomeMask("availability of fur: ", "yes", "no",
				ChromosomeMask::DependentSignsAndConditionOfExpression
				(GeneState::Recessive, BaseGenePresence::Presence,
					{
						ChromosomeMask("spots: ", "yes", "no"),
						ChromosomeMask("type of fur: ", "straight", "wavy", "curly"),
						ChromosomeMask("availability of color point: ", "yes", "no",
							ChromosomeMask::DependentSignsAndConditionOfExpression
							(GeneState::Dominant, BaseGenePresence::Presence,
								{
									ChromosomeMask("on paws: ", "yes", "no"),
									ChromosomeMask("on ears: ", "yes", "no"),
									ChromosomeMask("on tail: ", "yes", "no")
								}
							)
						)
					}
				)
			),
			ChromosomeMask("tratatata: ", "A", "B")
		};
		// setting individual genes values in genotype
		genotype.generateGenotype(phenotype.mask.getSize());
		// creating phenotype of the kitten from its genotype
		phenotype.setPhenotype(genotype.setOfGenes);
	}

	~Kitten() noexcept = default;
};
