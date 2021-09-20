#pragma once

#include <vector>
#include <string>

#pragma pack (push, 1)
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
* BaseGene may have 2 states: Presense or Absence
* BaseGene is a gene from presence or absence of which depends the expression of dependent signs
*/
enum class BaseGenePresence : uint16_t
{
	Presence,
	Absence
};

/*
* Chromosome mask contatins general characteristics of one chromosome
* (name of sign an types of its expression, dependent signs and type of dominance)
*/
class ChromosomeMask
{
public:
	std::string signName; // name of sign, that the chromosome is responsible for

	TypeOfDominance typeOfDominance; // type of dominance 

	std::string dominantGeneticExpression; // type of sign expression in dominant trait
	std::string interveningGeneticExpression; // type of sign expression in intervening trait
	std::string recessiveGeneticExpression; // type of sign expression in recessive trait

	/*
	* Set of signs, that may have expression if parent chromosome has the base gene
	*/
	class DependentSignsAndConditionOfExpression {
	public:
		GeneState baseGene; // the gene, the presence of which determines the expression of dependent signs
		BaseGenePresence baseGenePresence; // presence or absence of baseGene
		std::vector<ChromosomeMask> signs; // set of signs, which expression depends on presence of base gene

		DependentSignsAndConditionOfExpression() noexcept;

		DependentSignsAndConditionOfExpression(const GeneState baseGene, const BaseGenePresence baseGenePresence, 
			const std::vector<ChromosomeMask>&& signs) noexcept;

		DependentSignsAndConditionOfExpression(const DependentSignsAndConditionOfExpression& cp);

		~DependentSignsAndConditionOfExpression() noexcept = default;
	};

	// set of signs and gene, on the presence of which in this chromosome the expression of signs depends 
	DependentSignsAndConditionOfExpression dependentSigns;

	ChromosomeMask() noexcept = default;
	~ChromosomeMask() noexcept = default;

	//Ctor of chromosome with complete type of dominance
	ChromosomeMask(const std::string signName,
		const std::string dominantGeneticExpression,
		const std::string recessiveGeneticExpression,
		const DependentSignsAndConditionOfExpression& dependentSigns = {}) noexcept;

	//Ctor of chromosome with incomplete type of dominance
	ChromosomeMask(const std::string signName,
		const std::string dominantGeneticExpression,
		const std::string interveningGeneticExpression,
		const std::string recessiveGeneticExpression,
		const DependentSignsAndConditionOfExpression& dependentSigns = {}) noexcept;

	ChromosomeMask(const ChromosomeMask& cp);

	friend bool operator==(const ChromosomeMask::DependentSignsAndConditionOfExpression& lhs, const ChromosomeMask::DependentSignsAndConditionOfExpression& rhs);

	friend bool operator==(const ChromosomeMask& lhs, const ChromosomeMask& rhs);
};

#pragma pack (pop)
