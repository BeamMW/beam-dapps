#pragma once

#include "Chromosome.h"
#include "Genotype.h"
#include "Mask.h"

class Statistics
{
private:
	signExpressionProbability generalSignsExpressionProbability; // probability of each sign expression
	signExpressionProbability childSignsExpressionProbability; // probability of each sign expression for child
	
	PhenotypeMask phenotypeMask; // set of general characteristics of each chromosome 

	// method for calculating generic probability of sign expression
	void setGeneralSignExpressionProbability(const ChromosomeMask& chromosomeMask, genotype::const_iterator& chromosomeIt) noexcept
	{
		const Chromosome chromosome = *chromosomeIt;
		static float probabilityOfSignPresence = 1.0f;

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
			probabilityOfSignPresence = 0.0f;

			if (!chromosomeMask.dependentSigns.signs.empty() &&
				((chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Presence
					&& (chromosomeMask.dependentSigns.baseGene == chromosome.firstGene
						|| chromosomeMask.dependentSigns.baseGene == chromosome.secondGene))
					|| (chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Absence
						&& (chromosomeMask.dependentSigns.baseGene != chromosome.firstGene
							&& chromosomeMask.dependentSigns.baseGene != chromosome.secondGene))))
			{
				probabilityOfSignPresence = probabilityOfSignPresence * 0.5f;
			}

			for (auto it = chromosomeMask.dependentSigns.signs.cbegin(); it != chromosomeMask.dependentSigns.signs.cend(); ++it)
			{
				float probabilityOfSignAbsence = (1.0f - probabilityOfSignPresence) * 100;
				setGeneralSignExpressionProbability(*it, ++chromosomeIt);
				generalSignsExpressionProbability[(*it).signName].insert(std::make_pair("NO", probabilityOfSignAbsence));
			}

			probabilityOfSignPresence = 1.0f;
		}
	}

	// method for calculating probability of sign expression for child
	void setChildSignExpressionProbability(genotype::const_iterator& firstParentChromosomeIt, 
		genotype::const_iterator& secondParentChromosomeIt, const ChromosomeMask& chromosomeMask) noexcept
	{
		const Chromosome firstParentChromosome = *firstParentChromosomeIt;
		const Chromosome secondParentChromosome = *secondParentChromosomeIt;

		bool isFirstGeneVariative = true;
		bool isSecondGeneVariative = true;
		
		if (firstParentChromosome.firstGene == secondParentChromosome.firstGene)
			isFirstGeneVariative = false;
		if (firstParentChromosome.secondGene == secondParentChromosome.secondGene)
			isSecondGeneVariative = false;

		static float probabilityOfSignPresence = 1.0f;

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
				probabilityOfSignPresence = probabilityOfSignPresence * 0.5f;
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
						probabilityOfSignPresence = probabilityOfSignPresence * 0.5f;
					else
						probabilityOfSignPresence = probabilityOfSignPresence * 0.0f;
				}
				else
				{
					if (chromosomeMask.dependentSigns.baseGene == GeneState::Recessive
						&& chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Presence)
						probabilityOfSignPresence = probabilityOfSignPresence * 1.0f;
					if (chromosomeMask.dependentSigns.baseGene == GeneState::Dominant)
						probabilityOfSignPresence = probabilityOfSignPresence * 0.5f;
					else
						probabilityOfSignPresence = probabilityOfSignPresence * 0.0f;
				}

			}

			for (auto it = chromosomeMask.dependentSigns.signs.cbegin(); it != chromosomeMask.dependentSigns.signs.cend(); ++it)
			{
				float probabilityOfSignAbsence = (1.0f - probabilityOfSignPresence) * 100;
				setChildSignExpressionProbability(++firstParentChromosomeIt, ++secondParentChromosomeIt, *it);
				childSignsExpressionProbability[it->signName].insert(std::make_pair("NO", probabilityOfSignAbsence));
			}

			probabilityOfSignPresence = 1.0f;
		}
	}

public:
	Statistics(const PhenotypeMask& phenotypeMask) noexcept : phenotypeMask(phenotypeMask) {}

	// method for getting probability of signs expression
	signExpressionProbability getGeneralSignsExpressionProbability(const genotype& genotype) noexcept
	{
		auto genotypeIt = genotype.cbegin();
		for (auto maskIt = phenotypeMask.cbegin(); maskIt != phenotypeMask.cend(); ++maskIt, ++genotypeIt)
		{
			setGeneralSignExpressionProbability(*maskIt, genotypeIt);
		}
		return generalSignsExpressionProbability;
	}

	// method for getting probability of signs expression for child
	signExpressionProbability getChildSignsExpressionProbability(const genotype& firstParentGenotype, 
		const genotype& secondParentGenotype) noexcept
	{
		auto firstParentChromosomeIt = firstParentGenotype.cbegin();
		auto secondParentChromosomeIt = secondParentGenotype.cbegin();

		for (auto maskIt = phenotypeMask.cbegin(); maskIt != phenotypeMask.cend(); ++maskIt, ++firstParentChromosomeIt, ++secondParentChromosomeIt)
		{
			setChildSignExpressionProbability(firstParentChromosomeIt, secondParentChromosomeIt, *maskIt);
		}
		return childSignsExpressionProbability;
	}
};
