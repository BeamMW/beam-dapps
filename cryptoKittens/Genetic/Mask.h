#pragma once
#pragma once
#include <vector>
#include <map>
#include <string>

struct Chromosome;
using signName = std::string;
using externalExpression = std::string;
using phenotype = std::map<signName, externalExpression>;
using genotype = std::vector<Chromosome>;
using signExpressionProbability = std::map<signName, std::map<externalExpression, float>>;

/*
* Gene may have 2 states: Recessive or Dominant.
*/
enum class GeneState : uint16_t
{
	Recessive,
	Dominant
};

/*
* Chromosome may have 2 types of dominance: Complete and Incomplete.
* If the condition is Complete, the sets of genes {Dominant, Dominant}, {Dominant, Recessive} in the chromosome
* will exhibit the dominant trait in phenotype. And the set of genes {Recessive, Recessive} - recessive trait.
* If the condition is Incomplete, the set of genes {Dominant, Dominant in the chromosome
* will exhibit the dominant trait in phenotype. And the set of genes  {Dominant, Recessive} - intervening trait,
* the set of genes {Recessive, Recessive} - recessive trait.
*/
enum class TypeOfDominance : uint16_t
{
	Complete,
	Incomplete
};

/*
* BaseGene is a gene from presence or absence depends dependent signs expression
*/
enum class BaseGenePresence : uint16_t
{
	Presence,
	Absence
};

struct ChromosomeMask;
/*
* Set of signs, that may have expression if parent chromosome has the base gene.
*/
struct DependentSignsAndConditionOfExpression {
	GeneState baseGene; // the gene, the presence of which determines the expression of signs
	BaseGenePresence baseGenePresence;
	std::vector<ChromosomeMask> signs; // set of signs, which expression depends on presence of base gene

	DependentSignsAndConditionOfExpression() noexcept
		: baseGene(GeneState::Dominant), baseGenePresence(BaseGenePresence::Presence), signs({}) {}

	DependentSignsAndConditionOfExpression(const GeneState baseGene, const BaseGenePresence baseGenePresence, const std::vector<ChromosomeMask>&& signs) noexcept
		: baseGene(baseGene), baseGenePresence(baseGenePresence), signs(signs)
	{}

	~DependentSignsAndConditionOfExpression() noexcept = default;
};

/*
* Chromosome mask contatins general characteristics of one chromosome 
* (name of sign an types of its expression, dependent signs and type of dominance)
*/
struct ChromosomeMask
{
	std::string signName; // name of sign, that the chromosome is responsible for

	TypeOfDominance typeOfDominance; // type of dominance 

	std::string dominantGeneticExpression; // type of sign expression in dominant trait
	std::string interveningGeneticExpression; // type of sign expression in intervening trait
	std::string recessiveGeneticExpression; // type of sign expression in recessive trait

	// set of signs and gene, on the presence of which in this chromosome the expression of signs depends 
	DependentSignsAndConditionOfExpression dependentSigns;

	//Ctor of chromosome with complete type of dominance
	ChromosomeMask(const std::string signName,
		const std::string dominantGeneticExpression,
		const std::string recessiveGeneticExpression,
		const DependentSignsAndConditionOfExpression& dependentSigns = {}) noexcept
		: signName(signName),
		dominantGeneticExpression(dominantGeneticExpression),
		interveningGeneticExpression(""),
		recessiveGeneticExpression(recessiveGeneticExpression),
		typeOfDominance(TypeOfDominance::Complete),
		dependentSigns(dependentSigns)
	{}

	//Ctor of chromosome with incomplete type of dominance
	ChromosomeMask(const std::string signName,
		const std::string dominantGeneticExpression,
		const std::string interveningGeneticExpression,
		const std::string recessiveGeneticExpression,
		const DependentSignsAndConditionOfExpression& dependentSigns = {}) noexcept
		: signName(signName),
		dominantGeneticExpression(dominantGeneticExpression),
		interveningGeneticExpression(interveningGeneticExpression),
		recessiveGeneticExpression(recessiveGeneticExpression),
		typeOfDominance(TypeOfDominance::Incomplete),
		dependentSigns(dependentSigns)
	{}

	ChromosomeMask() noexcept = default;
	~ChromosomeMask() noexcept = default;
};

/*
* Mask contatins set of general characteristics of one class of characters
*/
using PhenotypeMask = std::vector<ChromosomeMask>;
struct Mask
{
	PhenotypeMask phenotypeMask; // set of general characteristics of each chromosome 
	uint16_t size; // size of phenotypeMask = number of all chromosomes

	Mask() noexcept : size(0) {}
	~Mask() noexcept = default;

	uint16_t getSize() noexcept
	{
		setSize(phenotypeMask);
		return size;
	}

	void setSize(const PhenotypeMask& mask) noexcept
	{
		for (auto maskIt = mask.cbegin(); maskIt != mask.cend(); ++maskIt)
		{
			++size;
			if (!(maskIt->dependentSigns.signs.empty()))
				setSize(maskIt->dependentSigns.signs);
		}
	}

};
