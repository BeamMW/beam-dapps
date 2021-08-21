#pragma once

#include "Chromosome.h"
#include "Genotype.h"
#include "Mask.h"

using signExpressionProbability = std::map<signName, std::map<externalExpression, float>>;

/*
* Class for calculating probabilities of sign expressions for character based on it's phenotype mask
* or for child based on genotypes of parents and phenotype mask
*/
class Statistics
{
private:
	signExpressionProbability generalSignsExpressionProbability; // probability of each sign expression
	signExpressionProbability childSignsExpressionProbability; // probability of each sign expression for child
	
	PhenotypeMask phenotypeMask; // set of general characteristics of each chromosome 

	// method for calculating generic probability of sign expression of a character
	void setGeneralSignExpressionProbability(const ChromosomeMask& chromosomeMask) noexcept
	{
		static float probabilityOfSignPresence = 1.0f;
		static uint16_t recurLevel = 0;
		static uint16_t signPresenceLevel = recurLevel + 1;

		if (chromosomeMask.typeOfDominance == TypeOfDominance::Complete)
		{
			generalSignsExpressionProbability.insert(std::make_pair(chromosomeMask.signName,
				std::map{
					std::make_pair(chromosomeMask.recessiveGeneticExpression, probabilityOfSignPresence * 1 / 4 * 100),
					std::make_pair(chromosomeMask.dominantGeneticExpression, probabilityOfSignPresence * 3 / 4 * 100)
				}
			));
		}
		else
		{
			generalSignsExpressionProbability.insert(std::make_pair(chromosomeMask.signName,
				std::map{
					std::make_pair(chromosomeMask.recessiveGeneticExpression, probabilityOfSignPresence * 1 / 4 * 100),
					std::make_pair(chromosomeMask.interveningGeneticExpression, probabilityOfSignPresence * 2 / 4 * 100),
					std::make_pair(chromosomeMask.dominantGeneticExpression, probabilityOfSignPresence * 1 / 4 * 100)
				}
			));
		}

		if (!chromosomeMask.dependentSigns.signs.empty())
		{
			++recurLevel;
			if (signPresenceLevel != recurLevel)
				probabilityOfSignPresence = 0.0f;
			else
			{
				probabilityOfSignPresence = powf(0.5, recurLevel);
			}

			for (auto it = chromosomeMask.dependentSigns.signs.cbegin(); it != chromosomeMask.dependentSigns.signs.cend(); ++it)
			{
				float probabilityOfSignAbsence = (1.0f - probabilityOfSignPresence) * 100;

				if (probabilityOfSignAbsence != 100.0f)
					signPresenceLevel = recurLevel;

				setGeneralSignExpressionProbability(*it);

				if (probabilityOfSignAbsence != 0.0f)
					generalSignsExpressionProbability[(*it).signName].insert(std::make_pair("Not present", probabilityOfSignAbsence));
			}

			if (signPresenceLevel != --recurLevel)
				probabilityOfSignPresence = powf(0.5, recurLevel);
		}
	}

	// method for calculating probability of sign expression for child
	void setChildSignExpressionProbability(genotype::const_iterator& firstParentChromosomeIt, 
		genotype::const_iterator& secondParentChromosomeIt, const ChromosomeMask& chromosomeMask) noexcept
	{
		const Chromosome firstParentChromosome = *firstParentChromosomeIt;
		const Chromosome secondParentChromosome = *secondParentChromosomeIt;

		// variative means, that in the same position firstParentChromosome and secondParentChromosome has different values
		bool isFirstGeneVariative = true; 
		bool isSecondGeneVariative = true;
		
		if (firstParentChromosome.firstGene == secondParentChromosome.firstGene)
			isFirstGeneVariative = false;
		if (firstParentChromosome.secondGene == secondParentChromosome.secondGene)
			isSecondGeneVariative = false;

		static float probabilityOfSignPresence = 1.0f;
		static uint16_t recurLevel = 0;
		static uint16_t signPresenceLevel = recurLevel + 1;

		if (chromosomeMask.typeOfDominance == TypeOfDominance::Complete)
		{
			if (isFirstGeneVariative && isSecondGeneVariative)
			{
				childSignsExpressionProbability.insert(std::make_pair(chromosomeMask.signName,
					std::map{
						std::make_pair(chromosomeMask.recessiveGeneticExpression, probabilityOfSignPresence * 1 / 4 * 100),
						std::make_pair(chromosomeMask.dominantGeneticExpression, probabilityOfSignPresence * 3 / 4 * 100)
					}
				));
			}
			else if (!isFirstGeneVariative && !isSecondGeneVariative)
			{
				if (firstParentChromosome.firstGene == GeneState::Dominant || firstParentChromosome.secondGene == GeneState::Dominant)
				{
					childSignsExpressionProbability.insert(std::make_pair(chromosomeMask.signName,
						std::map{
							std::make_pair(chromosomeMask.recessiveGeneticExpression, 0.0f),
							std::make_pair(chromosomeMask.dominantGeneticExpression, probabilityOfSignPresence * 100)
						}
					));
				}
				else
				{
					childSignsExpressionProbability.insert(std::make_pair(chromosomeMask.signName,
						std::map{
							std::make_pair(chromosomeMask.recessiveGeneticExpression, probabilityOfSignPresence * 100),
							std::make_pair(chromosomeMask.dominantGeneticExpression, 0.0f)
						}
					));
				}
			}
			else
			{
				if ((!isFirstGeneVariative && isSecondGeneVariative && firstParentChromosome.firstGene == GeneState::Dominant)
					|| (isFirstGeneVariative && !isSecondGeneVariative && firstParentChromosome.secondGene == GeneState::Dominant))
				{
					childSignsExpressionProbability.insert(std::make_pair(chromosomeMask.signName,
						std::map{
							std::make_pair(chromosomeMask.recessiveGeneticExpression, 0.0f),
							std::make_pair(chromosomeMask.dominantGeneticExpression, probabilityOfSignPresence * 100)
						}
					));
				}
				else
				{
					childSignsExpressionProbability.insert(std::make_pair(chromosomeMask.signName,
						std::map{
							std::make_pair(chromosomeMask.recessiveGeneticExpression, probabilityOfSignPresence * 1 / 2 * 100),
							std::make_pair(chromosomeMask.dominantGeneticExpression, probabilityOfSignPresence * 1 / 2 * 100)
						}
					));
				}
			}
		}
		else
		{
			if (isFirstGeneVariative && isSecondGeneVariative)
			{
				childSignsExpressionProbability.insert(std::make_pair(chromosomeMask.signName,
					std::map{
						std::make_pair(chromosomeMask.recessiveGeneticExpression, probabilityOfSignPresence * 1 / 4 * 100),
						std::make_pair(chromosomeMask.interveningGeneticExpression, probabilityOfSignPresence * 2 / 4 * 100),
						std::make_pair(chromosomeMask.dominantGeneticExpression, probabilityOfSignPresence * 1 / 4 * 100)
					}
				));
			}
			else if (!isFirstGeneVariative && !isSecondGeneVariative)
			{
				if (firstParentChromosome.firstGene == GeneState::Dominant && firstParentChromosome.secondGene == GeneState::Dominant)
				{
					childSignsExpressionProbability.insert(std::make_pair(chromosomeMask.signName,
						std::map{
							std::make_pair(chromosomeMask.recessiveGeneticExpression, probabilityOfSignPresence * 0.0f),
							std::make_pair(chromosomeMask.interveningGeneticExpression, probabilityOfSignPresence * 0.0f),
							std::make_pair(chromosomeMask.dominantGeneticExpression, probabilityOfSignPresence * 100)
						}
					));
				}
				else if (firstParentChromosome.firstGene == GeneState::Recessive && firstParentChromosome.secondGene == GeneState::Recessive)
				{
					childSignsExpressionProbability.insert(std::make_pair(chromosomeMask.signName,
						std::map{
							std::make_pair(chromosomeMask.recessiveGeneticExpression, probabilityOfSignPresence * 100),
							std::make_pair(chromosomeMask.interveningGeneticExpression, probabilityOfSignPresence * 0.0f),
							std::make_pair(chromosomeMask.dominantGeneticExpression, probabilityOfSignPresence * 0.0f)
						}
					));
				}
				else
				{
					childSignsExpressionProbability.insert(std::make_pair(chromosomeMask.signName,
						std::map{
							std::make_pair(chromosomeMask.recessiveGeneticExpression, probabilityOfSignPresence * 0.0f),
							std::make_pair(chromosomeMask.interveningGeneticExpression, probabilityOfSignPresence * 100),
							std::make_pair(chromosomeMask.dominantGeneticExpression, probabilityOfSignPresence * 0.0f)
						}
					));
				}
			}
			else
			{
				if ((!isFirstGeneVariative && isSecondGeneVariative && firstParentChromosome.firstGene == GeneState::Dominant)
					|| (isFirstGeneVariative && !isSecondGeneVariative && firstParentChromosome.secondGene == GeneState::Dominant))
				{
					childSignsExpressionProbability.insert(std::make_pair(chromosomeMask.signName,
						std::map{
							std::make_pair(chromosomeMask.recessiveGeneticExpression, probabilityOfSignPresence * 0.0f),
							std::make_pair(chromosomeMask.interveningGeneticExpression, probabilityOfSignPresence * 1 / 2 * 100),
							std::make_pair(chromosomeMask.dominantGeneticExpression, probabilityOfSignPresence * 1 / 2 * 100)
						}
					));
				}
				else
				{
					childSignsExpressionProbability.insert(std::make_pair(chromosomeMask.signName,
						std::map{
							std::make_pair(chromosomeMask.recessiveGeneticExpression, probabilityOfSignPresence * 1 / 2 * 100),
							std::make_pair(chromosomeMask.interveningGeneticExpression, probabilityOfSignPresence * 1 / 2 * 100),
							std::make_pair(chromosomeMask.dominantGeneticExpression, probabilityOfSignPresence * 0.0f)
						}
					));
				}

			}
		}

		if (!chromosomeMask.dependentSigns.signs.empty())
		{
			++recurLevel;
			if (signPresenceLevel != recurLevel)
			{
				probabilityOfSignPresence = 0.0f;
			}
			else
			{
				if (isFirstGeneVariative && isSecondGeneVariative)
				{
					probabilityOfSignPresence = powf(0.5, recurLevel);
				}
				else if (!isFirstGeneVariative && !isSecondGeneVariative)
				{
					if (firstParentChromosome.firstGene == GeneState::Dominant
						|| firstParentChromosome.secondGene == GeneState::Dominant)
					{
						if (chromosomeMask.dependentSigns.baseGene == GeneState::Dominant
							&& chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Presence)
							probabilityOfSignPresence = probabilityOfSignPresence * 1.0f;
						else
							probabilityOfSignPresence = probabilityOfSignPresence * 0.0f;
					}
					else
					{
						if (chromosomeMask.typeOfDominance == TypeOfDominance::Complete
							|| (chromosomeMask.typeOfDominance == TypeOfDominance::Incomplete
								&& (firstParentChromosome.firstGene == GeneState::Recessive
									&& firstParentChromosome.secondGene == GeneState::Recessive)))
						{
							if (chromosomeMask.dependentSigns.baseGene == GeneState::Recessive
								&& chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Presence)
								probabilityOfSignPresence = probabilityOfSignPresence * 1.0f;
							else
								probabilityOfSignPresence = probabilityOfSignPresence * 0.0f;
						}
						else
						{
							if (chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Presence)
								probabilityOfSignPresence = probabilityOfSignPresence * 1.0f;
							else
								probabilityOfSignPresence = probabilityOfSignPresence * 0.0f;
						}
					}
				}
				else
				{
					if ((!isFirstGeneVariative && isSecondGeneVariative
						&& firstParentChromosome.firstGene == GeneState::Dominant)
						|| (isFirstGeneVariative && !isSecondGeneVariative
							&& firstParentChromosome.secondGene == GeneState::Dominant))
					{
						if (chromosomeMask.dependentSigns.baseGene == GeneState::Dominant
							&& chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Presence)
							probabilityOfSignPresence = probabilityOfSignPresence * 1.0f;
						if (chromosomeMask.dependentSigns.baseGene == GeneState::Recessive)
							probabilityOfSignPresence = powf(0.5, recurLevel);
						else
							probabilityOfSignPresence = probabilityOfSignPresence * 0.0f;
					}
					else
					{
						if (chromosomeMask.dependentSigns.baseGene == GeneState::Recessive
							&& chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Presence)
							probabilityOfSignPresence = probabilityOfSignPresence * 1.0f;
						if (chromosomeMask.dependentSigns.baseGene == GeneState::Dominant)
							probabilityOfSignPresence = powf(0.5, recurLevel);
						else
							probabilityOfSignPresence = probabilityOfSignPresence * 0.0f;
					}
				}
			}

			float probabilityOfSignAbsence = 0.0f;
			for (auto it = chromosomeMask.dependentSigns.signs.cbegin(); it != chromosomeMask.dependentSigns.signs.cend(); ++it)
			{
				probabilityOfSignAbsence = (1.0f - probabilityOfSignPresence) * 100;

				if (probabilityOfSignAbsence != 100.0f) 
					signPresenceLevel = recurLevel;

				setChildSignExpressionProbability(++firstParentChromosomeIt, ++secondParentChromosomeIt, *it);

				if (probabilityOfSignAbsence != 0.0f)
					childSignsExpressionProbability[it->signName].insert(std::make_pair("Not present", probabilityOfSignAbsence));
			}
			if(signPresenceLevel != --recurLevel)
				probabilityOfSignPresence = powf(0.5, recurLevel);
		}
	}

public:
	Statistics(const PhenotypeMask& phenotypeMask) noexcept 
		: generalSignsExpressionProbability({}),
		childSignsExpressionProbability({}),
		phenotypeMask(phenotypeMask) {}

	// method for getting probability of signs expression
	signExpressionProbability getGeneralSignsExpressionProbability() noexcept
	{
		for (auto maskIt = phenotypeMask.cbegin(); maskIt != phenotypeMask.cend(); ++maskIt)
		{
			setGeneralSignExpressionProbability(*maskIt);
		}
		return generalSignsExpressionProbability;
	}

	// method for getting probability of signs expression for child
	signExpressionProbability getChildSignsExpressionProbability(const ICharacter& firstParent, 
		const ICharacter& secondParent) noexcept
	{
		if (firstParent.phenotype.mask.phenotypeMask == secondParent.phenotype.mask.phenotypeMask) 
		{
			auto firstParentChromosomeIt = firstParent.genotype.setOfGenes.cbegin();
			auto secondParentChromosomeIt = secondParent.genotype.setOfGenes.cbegin();

			for (auto maskIt = phenotypeMask.cbegin(); maskIt != phenotypeMask.cend(); ++maskIt, ++firstParentChromosomeIt, ++secondParentChromosomeIt)
			{
				setChildSignExpressionProbability(firstParentChromosomeIt, secondParentChromosomeIt, *maskIt);
			}
		}
		return childSignsExpressionProbability;
	}
};
