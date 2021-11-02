#pragma once

#include <deque>
#include <list>
#include <string_view>

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
	std::string_view signName; // name of sign, that the chromosome is responsible for

	TypeOfDominance typeOfDominance; // type of dominance 

	std::string_view dominantGeneticExpression; // type of sign expression in dominant trait
	std::string_view interveningGeneticExpression; // type of sign expression in intervening trait
	std::string_view recessiveGeneticExpression; // type of sign expression in recessive trait

	/*
	* Set of signs, that may have expression if parent chromosome has the base gene
	*/
	class DependentSignsAndConditionOfExpression {
	public:
		GeneState baseGene; // the gene, the presence of which determines the expression of dependent signs
		BaseGenePresence baseGenePresence; // presence or absence of baseGene
		std::list<ChromosomeMask> signs; // set of signs, which expression depends on presence of base gene

		DependentSignsAndConditionOfExpression() noexcept
			: baseGene(GeneState::Dominant), baseGenePresence(BaseGenePresence::Presence)
		{}

		DependentSignsAndConditionOfExpression(const GeneState baseGene, const BaseGenePresence baseGenePresence,
			const std::list<ChromosomeMask>&& signs) noexcept
			: baseGene(baseGene), baseGenePresence(baseGenePresence), signs(signs)
		{}

		DependentSignsAndConditionOfExpression(const DependentSignsAndConditionOfExpression& cp) noexcept
			: baseGene(cp.baseGene), baseGenePresence(cp.baseGenePresence), signs(cp.signs)
		{}

		~DependentSignsAndConditionOfExpression() noexcept = default;
	};

	// set of signs and gene, on the presence of which in this chromosome the expression of signs depends 
	DependentSignsAndConditionOfExpression dependentSigns;

	ChromosomeMask() noexcept = default;

	//Ctor of chromosome with complete type of dominance
	ChromosomeMask(const std::string_view signName,
		const std::string_view dominantGeneticExpression,
		const std::string_view recessiveGeneticExpression,
		const DependentSignsAndConditionOfExpression& dependentSigns) noexcept
		: signName(signName),
		dominantGeneticExpression(dominantGeneticExpression),
		interveningGeneticExpression(""),
		recessiveGeneticExpression(recessiveGeneticExpression),
		typeOfDominance(TypeOfDominance::Complete),
		dependentSigns(dependentSigns)
	{}

	//Ctor of chromosome with incomplete type of dominance
	ChromosomeMask(const std::string_view signName,
		const std::string_view dominantGeneticExpression,
		const std::string_view interveningGeneticExpression,
		const std::string_view recessiveGeneticExpression,
		const DependentSignsAndConditionOfExpression& dependentSigns) noexcept
		: signName(signName),
		dominantGeneticExpression(dominantGeneticExpression),
		interveningGeneticExpression(interveningGeneticExpression),
		recessiveGeneticExpression(recessiveGeneticExpression),
		typeOfDominance(TypeOfDominance::Incomplete),
		dependentSigns(dependentSigns)
	{}

	//Ctor of chromosome with complete type of dominance
	ChromosomeMask(const std::string_view signName,
		const std::string_view dominantGeneticExpression,
		const std::string_view recessiveGeneticExpression) noexcept
		: signName(signName),
		dominantGeneticExpression(dominantGeneticExpression),
		interveningGeneticExpression(""),
		recessiveGeneticExpression(recessiveGeneticExpression),
		typeOfDominance(TypeOfDominance::Complete)
	{}


	//Ctor of chromosome with incomplete type of dominance
	ChromosomeMask(const std::string_view signName,
		const std::string_view dominantGeneticExpression,
		const std::string_view interveningGeneticExpression,
		const std::string_view recessiveGeneticExpression) noexcept
		: signName(signName),
		dominantGeneticExpression(dominantGeneticExpression),
		interveningGeneticExpression(interveningGeneticExpression),
		recessiveGeneticExpression(recessiveGeneticExpression),
		typeOfDominance(TypeOfDominance::Incomplete)
	{}

	ChromosomeMask(const ChromosomeMask& cp) noexcept
		: signName(cp.signName),
		dominantGeneticExpression(cp.dominantGeneticExpression),
		interveningGeneticExpression(cp.interveningGeneticExpression),
		recessiveGeneticExpression(cp.recessiveGeneticExpression),
		typeOfDominance(cp.typeOfDominance),
		dependentSigns(cp.dependentSigns)
	{}

	friend bool operator==(const ChromosomeMask::DependentSignsAndConditionOfExpression& lhs, const ChromosomeMask::DependentSignsAndConditionOfExpression& rhs)
	{
		return lhs.baseGene == rhs.baseGene &&
			lhs.baseGenePresence == rhs.baseGenePresence &&
			lhs.signs == rhs.signs;
	}

	friend bool operator==(const ChromosomeMask& lhs, const ChromosomeMask& rhs)
	{
		return lhs.signName == rhs.signName &&
			lhs.typeOfDominance == rhs.typeOfDominance &&
			lhs.dominantGeneticExpression == rhs.dominantGeneticExpression &&
			lhs.interveningGeneticExpression == rhs.interveningGeneticExpression &&
			lhs.recessiveGeneticExpression == rhs.recessiveGeneticExpression &&
			lhs.dependentSigns == rhs.dependentSigns;
	}

};

#pragma pack (pop)
