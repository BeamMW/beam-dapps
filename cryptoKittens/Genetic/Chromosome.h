#pragma once
#include <vector>
#include <string>

enum class Gene : uint16_t
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
	// TODO: variadic set of genes on which the availability of the sign depends (not only one set)
	Gene firstGen;
	Gene secondGen;
	std::vector<Chromosome> signs;

	DependentSignsAndConditionOfExpression() noexcept : firstGen(Gene::Dominant), secondGen(Gene::Dominant), signs({}) {}
	DependentSignsAndConditionOfExpression(Gene firstGen, Gene secondGen, std::vector<Chromosome> signs) noexcept
		: firstGen(firstGen), secondGen(secondGen), signs(signs) {}
	~DependentSignsAndConditionOfExpression() noexcept = default;
};

struct Chromosome
{
	std::string signName;

	Gene firstGen;
	Gene secondGen;
	TypeOfDominance typeOfDominance;

	std::string dominantGeneticExpression;
	std::string interveningGeneticExpression;
	std::string recessiveGeneticExpression;

	DependentSignsAndConditionOfExpression dependentSigns;

	// TODO: make this more accurately
	Chromosome(std::string signName,
		std::string dominantGeneticExpression,
		std::string recessiveGeneticExpression,
		DependentSignsAndConditionOfExpression dependentSigns = {}) noexcept
		: signName(signName),
		firstGen(Gene::Dominant),
		secondGen(Gene::Dominant),
		dominantGeneticExpression(dominantGeneticExpression),
		recessiveGeneticExpression(recessiveGeneticExpression),
		interveningGeneticExpression(""),
		typeOfDominance(TypeOfDominance::Complete),
		dependentSigns(dependentSigns)
	{}

	Chromosome(std::string signName,
		std::string dominantGeneticExpression,
		std::string interveningGeneticExpression,
		std::string recessiveGeneticExpression,
		DependentSignsAndConditionOfExpression dependentSigns = {}) noexcept
		: signName(signName),
		firstGen(Gene::Dominant),
		secondGen(Gene::Dominant),
		dominantGeneticExpression(dominantGeneticExpression),
		interveningGeneticExpression(interveningGeneticExpression),
		recessiveGeneticExpression(recessiveGeneticExpression),
		typeOfDominance(TypeOfDominance::Incomplete),
		dependentSigns(dependentSigns)
	{}
	
	~Chromosome() noexcept = default;

	void setGenes(Gene firstGenValue, Gene secondGenValue) noexcept
	{
		firstGen = firstGenValue;
		secondGen = secondGenValue;
	}
};
