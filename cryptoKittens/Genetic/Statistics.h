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

	// method for calculating the probability of ane sign presence
	float getProbabilityOfSignPresence(const std::vector<float> v) const noexcept
	{
		float probability = 1.0;
		for (auto it = v.cbegin(); it != v.cend(); ++it)
		{
			probability *= *it;
		}
		return probability;
	}

	// method for calculating generic probability of sign expression of a character
	void setGeneralSignExpressionProbability(const ChromosomeMask& chromosomeMask) noexcept
	{
		static std::vector vectorOfProbabilitiesOfSignPresence = { 1.0f };
		static float probabilityOfSignPresence = getProbabilityOfSignPresence(vectorOfProbabilitiesOfSignPresence);

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
			if (chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Presence)
				vectorOfProbabilitiesOfSignPresence.push_back(0.75);
			else
				vectorOfProbabilitiesOfSignPresence.push_back(0.25);

			probabilityOfSignPresence = getProbabilityOfSignPresence(vectorOfProbabilitiesOfSignPresence);


			for (auto it = chromosomeMask.dependentSigns.signs.cbegin(); it != chromosomeMask.dependentSigns.signs.cend(); ++it)
			{
				float probabilityOfSignAbsence = (1.0f - probabilityOfSignPresence) * 100;

				setGeneralSignExpressionProbability(*it);

				if (probabilityOfSignAbsence != 0.0f)
					generalSignsExpressionProbability[(*it).signName].insert(std::make_pair("Not present", probabilityOfSignAbsence));
			}

			vectorOfProbabilitiesOfSignPresence.resize(vectorOfProbabilitiesOfSignPresence.size() - 1);
			probabilityOfSignPresence = getProbabilityOfSignPresence(vectorOfProbabilitiesOfSignPresence);
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

		static std::vector vectorOfProbabilitiesOfSignPresence = { 1.0f };
		static float probabilityOfSignPresence = getProbabilityOfSignPresence(vectorOfProbabilitiesOfSignPresence);

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
			if (isFirstGeneVariative && isSecondGeneVariative)
			{
				if (chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Presence)
					vectorOfProbabilitiesOfSignPresence.push_back(0.75);
				else
					vectorOfProbabilitiesOfSignPresence.push_back(0.25);
			}
			else if (!isFirstGeneVariative && !isSecondGeneVariative)
			{
				if (firstParentChromosome.firstGene == GeneState::Dominant
					|| firstParentChromosome.secondGene == GeneState::Dominant)
				{
					if (chromosomeMask.dependentSigns.baseGene == GeneState::Dominant
						&& chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Presence)
						vectorOfProbabilitiesOfSignPresence.push_back(1.0);
					else
						vectorOfProbabilitiesOfSignPresence.push_back(0.0);
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
							vectorOfProbabilitiesOfSignPresence.push_back(1.0);
						else
							vectorOfProbabilitiesOfSignPresence.push_back(0.0);
					}
					else
					{
						if (chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Presence)
							vectorOfProbabilitiesOfSignPresence.push_back(1.0);
						else
							vectorOfProbabilitiesOfSignPresence.push_back(0.0);
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
					{
						vectorOfProbabilitiesOfSignPresence.push_back(1.0);
					}
					else if (chromosomeMask.dependentSigns.baseGene == GeneState::Recessive)
					{
						if (chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Presence)
							vectorOfProbabilitiesOfSignPresence.push_back(0.75);
						else
							vectorOfProbabilitiesOfSignPresence.push_back(0.25);
					}
					else
					{
						vectorOfProbabilitiesOfSignPresence.push_back(0.0);
					}
				}
				else
				{
					if (chromosomeMask.dependentSigns.baseGene == GeneState::Recessive
						&& chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Presence)
					{
						vectorOfProbabilitiesOfSignPresence.push_back(1.0);
					}
					else if (chromosomeMask.dependentSigns.baseGene == GeneState::Dominant)
					{
						if (chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Presence)
							vectorOfProbabilitiesOfSignPresence.push_back(0.75);
						else
							vectorOfProbabilitiesOfSignPresence.push_back(0.25);
					}
					else
					{
						vectorOfProbabilitiesOfSignPresence.push_back(0.0);
					}
				}
			}
			probabilityOfSignPresence = getProbabilityOfSignPresence(vectorOfProbabilitiesOfSignPresence);


			float probabilityOfSignAbsence = 0.0f;
			for (auto it = chromosomeMask.dependentSigns.signs.cbegin(); it != chromosomeMask.dependentSigns.signs.cend(); ++it)
			{
				probabilityOfSignAbsence = (1.0f - probabilityOfSignPresence) * 100;

				setChildSignExpressionProbability(++firstParentChromosomeIt, ++secondParentChromosomeIt, *it);

				if (probabilityOfSignAbsence != 0.0f)
					childSignsExpressionProbability[it->signName].insert(std::make_pair("Not present", probabilityOfSignAbsence));
			}

			vectorOfProbabilitiesOfSignPresence.resize(vectorOfProbabilitiesOfSignPresence.size() - 1);
			probabilityOfSignPresence = getProbabilityOfSignPresence(vectorOfProbabilitiesOfSignPresence);

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

			for (auto maskIt = phenotypeMask.cbegin(); 
				maskIt != phenotypeMask.cend(); 
				++maskIt, ++firstParentChromosomeIt, ++secondParentChromosomeIt)
			{
				setChildSignExpressionProbability(firstParentChromosomeIt, secondParentChromosomeIt, *maskIt);
			}
		}
		return childSignsExpressionProbability;
	}
};
