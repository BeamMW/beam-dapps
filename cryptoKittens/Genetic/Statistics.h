#pragma once

#include "Chromosome.h"
#include "Genotype.h"
#include "Mask.h"

using signExpressionProbability = std::map<signName, std::map<externalExpression, uint32_t>>;

#pragma pack (push, 1)
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
	uint32_t getProbabilityOfSignPresence(const std::deque<uint32_t> v) const noexcept
	{
		uint32_t probability = 100;
		for (auto it = v.cbegin(); it != v.cend(); ++it)
		{
			probability = probability * (*it) / 100;
		}
		return probability;
	}

	// method for calculating generic probability of sign expression of a character
	void setGeneralSignExpressionProbability(const ChromosomeMask& chromosomeMask) noexcept
	{
		static std::deque<uint32_t> listOfProbabilitiesOfSignPresence = { 10000 };
		static uint32_t probabilityOfSignPresence = getProbabilityOfSignPresence(listOfProbabilitiesOfSignPresence);

		if (chromosomeMask.typeOfDominance == TypeOfDominance::Complete)
		{
			generalSignsExpressionProbability.insert(std::make_pair(chromosomeMask.signName,
				std::map{
					std::make_pair(chromosomeMask.recessiveGeneticExpression, probabilityOfSignPresence * 25),
					std::make_pair(chromosomeMask.dominantGeneticExpression, probabilityOfSignPresence * 75)
				}
			));
		}
		else
		{
			generalSignsExpressionProbability.insert(std::make_pair(chromosomeMask.signName,
				std::map{
					std::make_pair(chromosomeMask.recessiveGeneticExpression, probabilityOfSignPresence * 25),
					std::make_pair(chromosomeMask.interveningGeneticExpression, probabilityOfSignPresence * 50),
					std::make_pair(chromosomeMask.dominantGeneticExpression, probabilityOfSignPresence * 25)
				}
			));
		}

		if (!chromosomeMask.dependentSigns.signs.empty())
		{
			if (chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Presence)
				listOfProbabilitiesOfSignPresence.push_back(75);
			else
				listOfProbabilitiesOfSignPresence.push_back(25);

			probabilityOfSignPresence = getProbabilityOfSignPresence(listOfProbabilitiesOfSignPresence);


			for (auto it = chromosomeMask.dependentSigns.signs.cbegin(); it != chromosomeMask.dependentSigns.signs.cend(); ++it)
			{
				uint32_t probabilityOfSignAbsence = (listOfProbabilitiesOfSignPresence.at(0) - probabilityOfSignPresence) * 100;

				setGeneralSignExpressionProbability(*it);

				if (probabilityOfSignAbsence != 0)
					generalSignsExpressionProbability[(*it).signName].insert(std::make_pair("Not present", probabilityOfSignAbsence));
			}

			listOfProbabilitiesOfSignPresence.resize(listOfProbabilitiesOfSignPresence.size() - 1);
			probabilityOfSignPresence = getProbabilityOfSignPresence(listOfProbabilitiesOfSignPresence);
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

		static std::deque<uint32_t> listOfProbabilitiesOfSignPresence = { 10000 };
		static uint32_t probabilityOfSignPresence = getProbabilityOfSignPresence(listOfProbabilitiesOfSignPresence);

		uint32_t probabilityOfDominantSignPresence = 0;
		uint32_t probabilityOfInterveningSignPresence = 0;
		uint32_t probabilityOfRecessiveSignPresence = 0;

		if (chromosomeMask.typeOfDominance == TypeOfDominance::Complete)
		{
			if (isFirstGeneVariative && isSecondGeneVariative)
			{
				probabilityOfDominantSignPresence = probabilityOfSignPresence * 75;
				probabilityOfRecessiveSignPresence = probabilityOfSignPresence * 25;
			}
			else if (!isFirstGeneVariative && !isSecondGeneVariative)
			{
				if (firstParentChromosome.firstGene == GeneState::Dominant || firstParentChromosome.secondGene == GeneState::Dominant)
				{
					probabilityOfDominantSignPresence = probabilityOfSignPresence * 100;
					probabilityOfRecessiveSignPresence = probabilityOfSignPresence * 0;
				}
				else
				{
					probabilityOfDominantSignPresence = probabilityOfSignPresence * 0;
					probabilityOfRecessiveSignPresence = probabilityOfSignPresence * 100;
				}
			}
			else
			{
				if ((!isFirstGeneVariative && isSecondGeneVariative && firstParentChromosome.firstGene == GeneState::Dominant)
					|| (isFirstGeneVariative && !isSecondGeneVariative && firstParentChromosome.secondGene == GeneState::Dominant))
				{
					probabilityOfDominantSignPresence = probabilityOfSignPresence * 100;
					probabilityOfRecessiveSignPresence = probabilityOfSignPresence * 0;
				}
				else
				{
					probabilityOfDominantSignPresence = probabilityOfSignPresence * 50;
					probabilityOfRecessiveSignPresence = probabilityOfSignPresence * 50;
				}
			}

			childSignsExpressionProbability.insert(std::make_pair(chromosomeMask.signName,
				std::map{
					std::make_pair(chromosomeMask.recessiveGeneticExpression, probabilityOfRecessiveSignPresence),
					std::make_pair(chromosomeMask.dominantGeneticExpression, probabilityOfDominantSignPresence)
				}
			));
		}
		else
		{
			if (isFirstGeneVariative && isSecondGeneVariative)
			{
				probabilityOfDominantSignPresence = probabilityOfSignPresence * 25;
				probabilityOfInterveningSignPresence = probabilityOfSignPresence * 50;
				probabilityOfRecessiveSignPresence = probabilityOfSignPresence * 25;
			}
			else if (!isFirstGeneVariative && !isSecondGeneVariative)
			{
				if (firstParentChromosome.firstGene == GeneState::Dominant && firstParentChromosome.secondGene == GeneState::Dominant)
				{
					probabilityOfDominantSignPresence = probabilityOfSignPresence * 100;
					probabilityOfInterveningSignPresence = probabilityOfSignPresence * 0;
					probabilityOfRecessiveSignPresence = probabilityOfSignPresence * 0;
				}
				else if (firstParentChromosome.firstGene == GeneState::Recessive && firstParentChromosome.secondGene == GeneState::Recessive)
				{
					probabilityOfDominantSignPresence = probabilityOfSignPresence * 0;
					probabilityOfInterveningSignPresence = probabilityOfSignPresence * 0;
					probabilityOfRecessiveSignPresence = probabilityOfSignPresence * 100;
				}
				else
				{
					probabilityOfDominantSignPresence = probabilityOfSignPresence * 0;
					probabilityOfInterveningSignPresence = probabilityOfSignPresence * 100;
					probabilityOfRecessiveSignPresence = probabilityOfSignPresence * 0;
				}
			}
			else
			{
				if ((!isFirstGeneVariative && isSecondGeneVariative && firstParentChromosome.firstGene == GeneState::Dominant)
					|| (isFirstGeneVariative && !isSecondGeneVariative && firstParentChromosome.secondGene == GeneState::Dominant))
				{
					probabilityOfDominantSignPresence = probabilityOfSignPresence * 50;
					probabilityOfInterveningSignPresence = probabilityOfSignPresence * 50;
					probabilityOfRecessiveSignPresence = probabilityOfSignPresence * 0;
				}
				else
				{
					probabilityOfDominantSignPresence = probabilityOfSignPresence * 0;
					probabilityOfInterveningSignPresence = probabilityOfSignPresence * 50;
					probabilityOfRecessiveSignPresence = probabilityOfSignPresence * 50;
				}

			}

			childSignsExpressionProbability.insert(std::make_pair(chromosomeMask.signName,
				std::map{
					std::make_pair(chromosomeMask.recessiveGeneticExpression, probabilityOfRecessiveSignPresence),
					std::make_pair(chromosomeMask.interveningGeneticExpression,probabilityOfInterveningSignPresence),
					std::make_pair(chromosomeMask.dominantGeneticExpression, probabilityOfDominantSignPresence)
				}
			));
		}

		if (!chromosomeMask.dependentSigns.signs.empty())
		{
			if (isFirstGeneVariative && isSecondGeneVariative)
			{
				if (chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Presence)
					listOfProbabilitiesOfSignPresence.push_back(75);
				else
					listOfProbabilitiesOfSignPresence.push_back(25);
			}
			else if (!isFirstGeneVariative && !isSecondGeneVariative)
			{
				if (firstParentChromosome.firstGene == GeneState::Dominant
					|| firstParentChromosome.secondGene == GeneState::Dominant)
				{
					if (chromosomeMask.dependentSigns.baseGene == GeneState::Dominant
						&& chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Presence)
						listOfProbabilitiesOfSignPresence.push_back(100);
					else
						listOfProbabilitiesOfSignPresence.push_back(0);
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
							listOfProbabilitiesOfSignPresence.push_back(100);
						else
							listOfProbabilitiesOfSignPresence.push_back(0);
					}
					else
					{
						if (chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Presence)
							listOfProbabilitiesOfSignPresence.push_back(100);
						else
							listOfProbabilitiesOfSignPresence.push_back(0);
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
						listOfProbabilitiesOfSignPresence.push_back(100);
					}
					else if (chromosomeMask.dependentSigns.baseGene == GeneState::Recessive)
					{
						if (chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Presence)
							listOfProbabilitiesOfSignPresence.push_back(75);
						else
							listOfProbabilitiesOfSignPresence.push_back(25);
					}
					else
					{
						listOfProbabilitiesOfSignPresence.push_back(0);
					}
				}
				else
				{
					if (chromosomeMask.dependentSigns.baseGene == GeneState::Recessive
						&& chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Presence)
					{
						listOfProbabilitiesOfSignPresence.push_back(100);
					}
					else if (chromosomeMask.dependentSigns.baseGene == GeneState::Dominant)
					{
						if (chromosomeMask.dependentSigns.baseGenePresence == BaseGenePresence::Presence)
							listOfProbabilitiesOfSignPresence.push_back(75);
						else
							listOfProbabilitiesOfSignPresence.push_back(25);
					}
					else
					{
						listOfProbabilitiesOfSignPresence.push_back(0);
					}
				}
			}
			probabilityOfSignPresence = getProbabilityOfSignPresence(listOfProbabilitiesOfSignPresence);


			uint32_t probabilityOfSignAbsence = 0;
			for (auto it = chromosomeMask.dependentSigns.signs.cbegin(); it != chromosomeMask.dependentSigns.signs.cend(); ++it)
			{
				probabilityOfSignAbsence = (listOfProbabilitiesOfSignPresence.at(0) - probabilityOfSignPresence) * 100;

				setChildSignExpressionProbability(++firstParentChromosomeIt, ++secondParentChromosomeIt, *it);

				if (probabilityOfSignAbsence != 0)
					childSignsExpressionProbability[it->signName].insert(std::make_pair("Not present", probabilityOfSignAbsence));
			}

			listOfProbabilitiesOfSignPresence.resize(listOfProbabilitiesOfSignPresence.size() - 1);
			probabilityOfSignPresence = getProbabilityOfSignPresence(listOfProbabilitiesOfSignPresence);
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
#pragma pack (pop)
