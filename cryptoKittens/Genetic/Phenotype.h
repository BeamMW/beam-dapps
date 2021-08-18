#pragma once
#include <map>

#include "Chromosome.h"
#include "Genotype.h"

/*
* Phenotype - set of all signs
*/
struct Phenotype
{
	Phenotype() noexcept {};
	~Phenotype() noexcept = default;

	using signName = std::string;
	using externalExpression = std::string;
	using phenotype = std::map<signName, externalExpression>;
	using signExpressionProbability = std::map<signName, std::map<externalExpression, float>>;
	phenotype setOfSigns; // set of all signs
	signExpressionProbability signsExpressionProbability; // probability of each sign expression

	// method for setting all gene meanings in setOfSigns
	void setGenMeaning(const Chromosome& chromosome) noexcept
	{
		if (chromosome.typeOfDominance == TypeOfDominance::Complete)
		{
			if (chromosome.firstGene == GeneState::Recessive && chromosome.secondGene == GeneState::Recessive)
				setOfSigns.insert(std::make_pair(chromosome.signName, chromosome.recessiveGeneticExpression));
			else
				setOfSigns.insert(std::make_pair(chromosome.signName, chromosome.dominantGeneticExpression));
		}
		else
		{
			if (chromosome.firstGene == GeneState::Dominant && chromosome.secondGene == GeneState::Dominant)
				setOfSigns.insert(std::make_pair(chromosome.signName, chromosome.dominantGeneticExpression));
			else if (chromosome.firstGene == GeneState::Recessive && chromosome.secondGene == GeneState::Recessive)
				setOfSigns.insert(std::make_pair(chromosome.signName, chromosome.recessiveGeneticExpression));
			else
				setOfSigns.insert(std::make_pair(chromosome.signName, chromosome.interveningGeneticExpression));
		}


		if (!chromosome.dependentSigns.signs.empty() &&
			((chromosome.dependentSigns.baseGenePresence == BaseGenePresence::Presence 
				&& (chromosome.dependentSigns.baseGene == chromosome.firstGene 
					|| chromosome.dependentSigns.baseGene == chromosome.secondGene))
			|| (chromosome.dependentSigns.baseGenePresence == BaseGenePresence::Absence
				&& (chromosome.dependentSigns.baseGene != chromosome.firstGene 
					&& chromosome.dependentSigns.baseGene != chromosome.secondGene))))
		{
			for (auto it = chromosome.dependentSigns.signs.cbegin(); it != chromosome.dependentSigns.signs.cend(); ++it)
			{
				setGenMeaning(*it);
			}
		}
	}

	// method for calculating generic probability of signs expression
	void setSignExpressionProbability(const Chromosome& chromosome) noexcept
	{
		static float probabilityOfSignPresence = 1.0f;

		if (chromosome.typeOfDominance == TypeOfDominance::Complete)
		{
			signsExpressionProbability.insert(std::make_pair(chromosome.signName,
				std::map{
					std::make_pair(chromosome.recessiveGeneticExpression, probabilityOfSignPresence * 1 / 4 * 100),
					std::make_pair(chromosome.dominantGeneticExpression, probabilityOfSignPresence * 3 / 4 * 100)
				}
			));
		}
		else
		{
			signsExpressionProbability.insert(std::make_pair(chromosome.signName,
				std::map{
					std::make_pair(chromosome.recessiveGeneticExpression, probabilityOfSignPresence * 1 / 4 * 100),
					std::make_pair(chromosome.interveningGeneticExpression, probabilityOfSignPresence * 2 / 4 * 100),
					std::make_pair(chromosome.dominantGeneticExpression, probabilityOfSignPresence * 1 / 4 * 100)
				}
			));
		}

		if (!chromosome.dependentSigns.signs.empty() &&
			(chromosome.dependentSigns.baseGene == chromosome.firstGene || chromosome.dependentSigns.baseGene == chromosome.secondGene))
		{
			probabilityOfSignPresence = probabilityOfSignPresence * 0.5f;

			for (auto it = chromosome.dependentSigns.signs.cbegin(); it != chromosome.dependentSigns.signs.cend(); ++it)
			{
				float probabilityOfSignAbsence = (1.0f - probabilityOfSignPresence) * 100;
				setSignExpressionProbability(*it);
				signsExpressionProbability[(*it).signName].insert(std::make_pair("NO", probabilityOfSignAbsence));
			}

			probabilityOfSignPresence = 1.0f;
		}
	}

	// method for setting phenotype from genotype
	void setPhenotype(const Genotype::genotype& genotype) noexcept
	{
		for (auto ChromosomeIt = genotype.cbegin(); ChromosomeIt != genotype.cend(); ++ChromosomeIt)
		{
			setGenMeaning(*ChromosomeIt);
			setSignExpressionProbability(*ChromosomeIt);
		}
	}
};
