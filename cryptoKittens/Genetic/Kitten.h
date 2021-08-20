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
			ChromosomeMask("first fur color (red)", "dark", "medium", "light"),
			ChromosomeMask("first fur color (green)", "dark", "medium", "light"),
			ChromosomeMask("first fur color (blue)", "dark", "medium", "light"),

			ChromosomeMask("solid fur color", "yes", "no",
			ChromosomeMask::DependentSignsAndConditionOfExpression
				(GeneState::Dominant, BaseGenePresence::Absence,
					{
						ChromosomeMask("second fur color (red)", "dark", "medium", "light"),
						ChromosomeMask("second fur color (green)", "dark", "medium", "light"),
						ChromosomeMask("second fur color (blue)", "dark", "medium", "light"),

						ChromosomeMask("number of colors", "2", "3",
							ChromosomeMask::DependentSignsAndConditionOfExpression
								(GeneState::Dominant, BaseGenePresence::Absence,
									{
										ChromosomeMask("third fur color (red)", "dark", "medium", "light"),
										ChromosomeMask("third fur color (green)", "dark", "medium", "light"),
										ChromosomeMask("third fur color (blue)", "dark", "medium", "light")
									}
								)
						),

						ChromosomeMask("size of color pattern", "large", "medium", "small"),

						ChromosomeMask("availability of stains and streaks", "yes", "no",
							ChromosomeMask::DependentSignsAndConditionOfExpression
								(GeneState::Dominant, BaseGenePresence::Presence,
									{
										ChromosomeMask("stains or streaks", "streaks", "discontinuous streaks", "spots")
									}
								)
						),

						ChromosomeMask("availability of color point", "yes", "no",
							ChromosomeMask::DependentSignsAndConditionOfExpression
								(GeneState::Dominant, BaseGenePresence::Presence,
									{
										ChromosomeMask("availability of color point on front right paw:", "yes", "no"),
										ChromosomeMask("availability of color point on back right paw:", "yes", "no"),
										ChromosomeMask("availability of color point on front left paw:", "yes", "no"),
										ChromosomeMask("availability of color point on back left paw:", "yes", "no"),

										ChromosomeMask("availability of color point on right ear:", "yes", "no"),
										ChromosomeMask("availability of color point on left ear:", "yes", "no"),

										ChromosomeMask("availability of color point on tail:", "yes", "no"),

										ChromosomeMask("availability of color point on body:", "yes", "no")
									}
								)
						)
					}
				)
			),

			ChromosomeMask("availability of fur", "yes", "no",
				ChromosomeMask::DependentSignsAndConditionOfExpression
				(GeneState::Dominant, BaseGenePresence::Presence,
					{
						ChromosomeMask("fur length", "long", "medium", "short"),
						ChromosomeMask("fur type", "normal", "curly")
					}
				)
			),

			ChromosomeMask("availability of tassels on ears", "no", "yes"),
			ChromosomeMask("size of ears", "big", "medium", "small"),
			ChromosomeMask("availability of ear twist", "no", "yes",
				ChromosomeMask::DependentSignsAndConditionOfExpression
				(GeneState::Dominant, BaseGenePresence::Presence,
					{
						ChromosomeMask("availability of lop-sided", "no", "yes")
					}
				)
			),

			ChromosomeMask("size of paws",  "big", "medium", "small"),
			
			ChromosomeMask("size of tail",  "long", "medium", "short"),
			
			ChromosomeMask("size of body",  "big", "medium", "small"),
			
			ChromosomeMask("length of whiskers",  "long", "medium", "short"),
			ChromosomeMask("availability of whiskers twist",  "streight", "streight", "wavy"),
			
			ChromosomeMask("size of eyes",  "big", "medium", "small"),
			ChromosomeMask("shape of eyes",  "wide", "medium", "narrow"),

			ChromosomeMask("first eye color (red)", "dark", "medium", "light"),
			ChromosomeMask("first eye color (green)", "dark", "medium", "light"),
			ChromosomeMask("first eye color (blue)", "dark", "medium", "light"),

			ChromosomeMask("availability of dichroism", "no", "yes",
				ChromosomeMask::DependentSignsAndConditionOfExpression
				(GeneState::Dominant, BaseGenePresence::Absence,
					{
						ChromosomeMask("second eye color (red)", "dark", "medium", "light"),
						ChromosomeMask("second eye color (green)", "dark", "medium", "light"),
						ChromosomeMask("second eye color (blue)", "dark", "medium", "light")
					}
				)
			)
		};
		// setting individual genes values in genotype
		genotype.generateGenotype(phenotype.mask.getSize());
		// creating phenotype of the kitten from its genotype
		phenotype.setPhenotype(genotype.setOfGenes);
	}

	~Kitten() noexcept = default;
};
