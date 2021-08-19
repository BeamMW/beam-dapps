#pragma once

#include "Chromosome.h"
#include "Genotype.h"

class Statistics
{
private:
	signExpressionProbability generalSignsExpressionProbability; // probability of each sign expression
	signExpressionProbability childSignsExpressionProbability; // probability of each sign expression for child

	// method for calculating generic probability of sign expression
	void setGeneralSignExpressionProbability(const Chromosome& chromosome) noexcept
	{
		static float probabilityOfSignPresence = 1.0f;

		if (chromosome.typeOfDominance == TypeOfDominance::Complete)
		{
			generalSignsExpressionProbability.insert(std::make_pair(chromosome.signName,
				std::map{
					std::make_pair(chromosome.recessiveGeneticExpression, probabilityOfSignPresence * 1 / 4 * 100),
					std::make_pair(chromosome.dominantGeneticExpression, probabilityOfSignPresence * 3 / 4 * 100)
				}
			));
		}
		else
		{
			generalSignsExpressionProbability.insert(std::make_pair(chromosome.signName,
				std::map{
					std::make_pair(chromosome.recessiveGeneticExpression, probabilityOfSignPresence * 1 / 4 * 100),
					std::make_pair(chromosome.interveningGeneticExpression, probabilityOfSignPresence * 2 / 4 * 100),
					std::make_pair(chromosome.dominantGeneticExpression, probabilityOfSignPresence * 1 / 4 * 100)
				}
			));
		}

		if (!chromosome.dependentSigns.signs.empty())
		{
			probabilityOfSignPresence = 0.0f;
			if ((chromosome.dependentSigns.baseGenePresence == BaseGenePresence::Presence
				&& (chromosome.dependentSigns.baseGene == chromosome.firstGene
					|| chromosome.dependentSigns.baseGene == chromosome.secondGene))
				|| (chromosome.dependentSigns.baseGenePresence == BaseGenePresence::Absence
					&& (chromosome.dependentSigns.baseGene != chromosome.firstGene
						&& chromosome.dependentSigns.baseGene != chromosome.secondGene)))
			{
				probabilityOfSignPresence = probabilityOfSignPresence * 0.5f;
			}

			for (auto it = chromosome.dependentSigns.signs.cbegin(); it != chromosome.dependentSigns.signs.cend(); ++it)
			{
				float probabilityOfSignAbsence = (1.0f - probabilityOfSignPresence) * 100;
				setGeneralSignExpressionProbability(*it);
				generalSignsExpressionProbability[(*it).signName].insert(std::make_pair("NO", probabilityOfSignAbsence));
			}

			probabilityOfSignPresence = 1.0f;
		}
	}

	// method for calculating probability of sign expression for child
	void setChildSignExpressionProbability(const Chromosome& firstParentChromosome, const Chromosome& secondParentChromosome) noexcept
	{
		bool isFirstGeneVariative = true;
		bool isSecondGeneVariative = true;
		
		if (firstParentChromosome.firstGene == secondParentChromosome.firstGene)
			isFirstGeneVariative = false;
		if (firstParentChromosome.secondGene == secondParentChromosome.secondGene)
			isSecondGeneVariative = false;

		static float probabilityOfSignPresence = 1.0f;

		if (firstParentChromosome.typeOfDominance == TypeOfDominance::Complete)
		{
			if (isFirstGeneVariative && isSecondGeneVariative)
			{
				childSignsExpressionProbability.insert(std::make_pair(firstParentChromosome.signName,
					std::map{
						std::make_pair(firstParentChromosome.recessiveGeneticExpression, probabilityOfSignPresence * 1 / 4 * 100),
						std::make_pair(firstParentChromosome.dominantGeneticExpression, probabilityOfSignPresence * 3 / 4 * 100)
					}
				));
			}
			else if (!isFirstGeneVariative && !isSecondGeneVariative)
			{
				if (firstParentChromosome.firstGene == GeneState::Dominant || firstParentChromosome.secondGene == GeneState::Dominant)
				{
					childSignsExpressionProbability.insert(std::make_pair(firstParentChromosome.signName,
						std::map{
							std::make_pair(firstParentChromosome.recessiveGeneticExpression, 0.0f),
							std::make_pair(firstParentChromosome.dominantGeneticExpression, probabilityOfSignPresence * 100)
						}
					));
				}
				else
				{
					childSignsExpressionProbability.insert(std::make_pair(firstParentChromosome.signName,
						std::map{
							std::make_pair(firstParentChromosome.recessiveGeneticExpression, probabilityOfSignPresence * 100),
							std::make_pair(firstParentChromosome.dominantGeneticExpression, 0.0f)
						}
					));
				}
			}
			else
			{
				if ((!isFirstGeneVariative && isSecondGeneVariative && firstParentChromosome.firstGene == GeneState::Dominant)
					|| (isFirstGeneVariative && !isSecondGeneVariative && firstParentChromosome.secondGene == GeneState::Dominant))
				{
					childSignsExpressionProbability.insert(std::make_pair(firstParentChromosome.signName,
						std::map{
							std::make_pair(firstParentChromosome.recessiveGeneticExpression, 0.0f),
							std::make_pair(firstParentChromosome.dominantGeneticExpression, probabilityOfSignPresence * 100)
						}
					));
				}
				else
				{
					childSignsExpressionProbability.insert(std::make_pair(firstParentChromosome.signName,
						std::map{
							std::make_pair(firstParentChromosome.recessiveGeneticExpression, probabilityOfSignPresence * 1 / 2 * 100),
							std::make_pair(firstParentChromosome.dominantGeneticExpression, probabilityOfSignPresence * 1 / 2 * 100)
						}
					));
				}

			}
		}
		else
		{
			if (isFirstGeneVariative && isSecondGeneVariative)
			{
				childSignsExpressionProbability.insert(std::make_pair(firstParentChromosome.signName,
					std::map{
						std::make_pair(firstParentChromosome.recessiveGeneticExpression, probabilityOfSignPresence * 1 / 4 * 100),
						std::make_pair(firstParentChromosome.interveningGeneticExpression, probabilityOfSignPresence * 2 / 4 * 100),
						std::make_pair(firstParentChromosome.dominantGeneticExpression, probabilityOfSignPresence * 1 / 4 * 100)
					}
				));
			}
			else if (!isFirstGeneVariative && !isSecondGeneVariative)
			{
				if (firstParentChromosome.firstGene == GeneState::Dominant && firstParentChromosome.secondGene == GeneState::Dominant)
				{
					childSignsExpressionProbability.insert(std::make_pair(firstParentChromosome.signName,
						std::map{
							std::make_pair(firstParentChromosome.recessiveGeneticExpression, probabilityOfSignPresence * 0.0f),
							std::make_pair(firstParentChromosome.interveningGeneticExpression, probabilityOfSignPresence * 0.0f),
							std::make_pair(firstParentChromosome.dominantGeneticExpression, probabilityOfSignPresence * 100)
						}
					));
				}
				else if (firstParentChromosome.firstGene == GeneState::Recessive && firstParentChromosome.secondGene == GeneState::Recessive)
				{
					childSignsExpressionProbability.insert(std::make_pair(firstParentChromosome.signName,
						std::map{
							std::make_pair(firstParentChromosome.recessiveGeneticExpression, probabilityOfSignPresence * 100),
							std::make_pair(firstParentChromosome.interveningGeneticExpression, probabilityOfSignPresence * 0.0f),
							std::make_pair(firstParentChromosome.dominantGeneticExpression, probabilityOfSignPresence * 0.0f)
						}
					));
				}
				else
				{
					childSignsExpressionProbability.insert(std::make_pair(firstParentChromosome.signName,
						std::map{
							std::make_pair(firstParentChromosome.recessiveGeneticExpression, probabilityOfSignPresence * 0.0f),
							std::make_pair(firstParentChromosome.interveningGeneticExpression, probabilityOfSignPresence * 100),
							std::make_pair(firstParentChromosome.dominantGeneticExpression, probabilityOfSignPresence * 0.0f)
						}
					));
				}
			}
			else
			{
				if ((!isFirstGeneVariative && isSecondGeneVariative && firstParentChromosome.firstGene == GeneState::Dominant)
					|| (isFirstGeneVariative && !isSecondGeneVariative && firstParentChromosome.secondGene == GeneState::Dominant))
				{
					childSignsExpressionProbability.insert(std::make_pair(firstParentChromosome.signName,
						std::map{
							std::make_pair(firstParentChromosome.recessiveGeneticExpression, probabilityOfSignPresence * 0.0f),
							std::make_pair(firstParentChromosome.interveningGeneticExpression, probabilityOfSignPresence * 1 / 2 * 100),
							std::make_pair(firstParentChromosome.dominantGeneticExpression, probabilityOfSignPresence * 1 / 2 * 100)
						}
					));
				}
				else
				{
					childSignsExpressionProbability.insert(std::make_pair(firstParentChromosome.signName,
						std::map{
							std::make_pair(firstParentChromosome.recessiveGeneticExpression, probabilityOfSignPresence * 1 / 2 * 100),
							std::make_pair(firstParentChromosome.interveningGeneticExpression, probabilityOfSignPresence * 1 / 2 * 100),
							std::make_pair(firstParentChromosome.dominantGeneticExpression, probabilityOfSignPresence * 0.0f)
						}
					));
				}

			}
		}

		if (!firstParentChromosome.dependentSigns.signs.empty())
		{
			probabilityOfSignPresence = 0.0f;
			if ((firstParentChromosome.dependentSigns.baseGenePresence == BaseGenePresence::Presence
				&& (firstParentChromosome.dependentSigns.baseGene == firstParentChromosome.firstGene
					|| firstParentChromosome.dependentSigns.baseGene == firstParentChromosome.secondGene))
				|| (firstParentChromosome.dependentSigns.baseGenePresence == BaseGenePresence::Absence
					&& (firstParentChromosome.dependentSigns.baseGene != firstParentChromosome.firstGene
						&& firstParentChromosome.dependentSigns.baseGene != firstParentChromosome.secondGene)))
			{
				probabilityOfSignPresence = probabilityOfSignPresence * 0.5f;
			}

			for (auto firstParentChromosomeIt = firstParentChromosome.dependentSigns.signs.cbegin(),
				secondParentChromosomeIt = secondParentChromosome.dependentSigns.signs.cbegin();
				firstParentChromosomeIt != firstParentChromosome.dependentSigns.signs.cend(); 
				++firstParentChromosomeIt, ++secondParentChromosomeIt)
			{
				float probabilityOfSignAbsence = (1.0f - probabilityOfSignPresence) * 100;
				setChildSignExpressionProbability(*firstParentChromosomeIt, *secondParentChromosomeIt);
				childSignsExpressionProbability[(*firstParentChromosomeIt).signName].insert(std::make_pair("NO", probabilityOfSignAbsence));
			}

			probabilityOfSignPresence = 1.0f;
		}
	}

public:
	// method for getting probability of signs expression
	signExpressionProbability getGeneralSignsExpressionProbability(const genotype& genotype) noexcept
	{
		for (auto chromosomeIt = genotype.cbegin(); chromosomeIt != genotype.cend(); ++chromosomeIt)
		{
			setGeneralSignExpressionProbability(*chromosomeIt);
		}
		return generalSignsExpressionProbability;
	}

	// method for getting probability of signs expression for child
	signExpressionProbability getChildSignsExpressionProbability(const genotype& firstParentGenotype, 
		const genotype& secondParentGenotype) noexcept
	{
		for (auto firstParentChromosomeIt = firstParentGenotype.cbegin(), secondParentChromosomeIt = secondParentGenotype.cbegin();
			firstParentChromosomeIt != firstParentGenotype.cend(); 
			++firstParentChromosomeIt, ++secondParentChromosomeIt)
		{
			setChildSignExpressionProbability(*firstParentChromosomeIt, *secondParentChromosomeIt);
		}
		return childSignsExpressionProbability;
	}
};
