#pragma once
#include <vector>
#include <string>

enum class GeneState : uint16_t
{
	Recessive,
	Dominant
};

enum class TypeOfDominance : uint16_t
{
	Complete,
	Incomplete
};

struct Chromosome;
struct DependentSignsAndConditionOfExpression {
	GeneState baseGene;
	std::vector<Chromosome> signs;

	DependentSignsAndConditionOfExpression() noexcept 
		: baseGene(GeneState::Dominant), signs({}) {}

	DependentSignsAndConditionOfExpression(GeneState baseGene, std::vector<Chromosome> signs) noexcept
		: baseGene(baseGene), signs(signs)
	{}

	~DependentSignsAndConditionOfExpression() noexcept = default;
};

struct Chromosome
{
	std::string signName;

	GeneState firstGene;
	GeneState secondGene;
	TypeOfDominance typeOfDominance;

	std::string dominantGeneticExpression;
	std::string interveningGeneticExpression;
	std::string recessiveGeneticExpression;

	DependentSignsAndConditionOfExpression dependentSigns;

	Chromosome(std::string signName,
		std::string dominantGeneticExpression,
		std::string recessiveGeneticExpression,
		DependentSignsAndConditionOfExpression dependentSigns = {}) noexcept
		: signName(signName), 
		firstGene(GeneState::Dominant),
		secondGene(GeneState::Dominant),
		dominantGeneticExpression(dominantGeneticExpression),
		interveningGeneticExpression(""),
		recessiveGeneticExpression(recessiveGeneticExpression),
		typeOfDominance(TypeOfDominance::Complete),
		dependentSigns(dependentSigns)
	{}

	Chromosome(std::string signName,
		std::string dominantGeneticExpression,
		std::string interveningGeneticExpression,
		std::string recessiveGeneticExpression,
		DependentSignsAndConditionOfExpression dependentSigns = {}) noexcept
		: signName(signName),
		firstGene(GeneState::Dominant),
		secondGene(GeneState::Dominant),
		dominantGeneticExpression(dominantGeneticExpression),
		interveningGeneticExpression(interveningGeneticExpression),
		recessiveGeneticExpression(recessiveGeneticExpression),
		typeOfDominance(TypeOfDominance::Incomplete),
		dependentSigns(dependentSigns)
	{}
	
	~Chromosome() noexcept = default;

	void setGenes(GeneState firstGeneValue, GeneState secondGeneValue) noexcept
	{
		firstGene = firstGeneValue;
		secondGene = secondGeneValue;
	}
};
