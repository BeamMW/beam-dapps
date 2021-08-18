#pragma once
#include <vector>
#include <string>

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

enum class BaseGenePresence : uint16_t
{
	Presence,
	Absence
};

/*
* Set of signs, that may have expression if parent chromosome has the base gene. 
*/
struct Chromosome;
struct DependentSignsAndConditionOfExpression {
	GeneState baseGene; // the gene, the presence of which determines the expression of signs
	BaseGenePresence baseGenePresence;
	std::vector<Chromosome> signs; // set of signs, which expression depends on presence of base gene

	DependentSignsAndConditionOfExpression() noexcept 
		: baseGene(GeneState::Dominant), baseGenePresence(BaseGenePresence::Presence), signs({}) {}

	DependentSignsAndConditionOfExpression(const GeneState baseGene, const BaseGenePresence baseGenePresence, const std::vector<Chromosome>&& signs) noexcept
		: baseGene(baseGene), baseGenePresence(baseGenePresence), signs(signs)
	{}

	~DependentSignsAndConditionOfExpression() noexcept = default;
};

/*
* Chromosome, that consists of 2 alleles of gene, name of sign an types of its expression, 
* dependent signs and type of dominance
*/
struct Chromosome
{
	std::string signName; // name of sign, that the chromosome is responsible for

	GeneState firstGene; // state of first gene
	GeneState secondGene;  // state of second gene
	TypeOfDominance typeOfDominance; // type of dominance 

	std::string dominantGeneticExpression; // type of sign expression in dominant trait
	std::string interveningGeneticExpression; // type of sign expression in intervening trait
	std::string recessiveGeneticExpression; // type of sign expression in recessive trait

	// set of signs and gene, on the presence of which in this chromosome the expression of signs depends 
	DependentSignsAndConditionOfExpression dependentSigns; 

	//Ctror of chromosome with complete type of dominance
	Chromosome(const std::string signName,
		const std::string dominantGeneticExpression,
		const std::string recessiveGeneticExpression,
		const DependentSignsAndConditionOfExpression& dependentSigns = {}) noexcept
		: signName(signName), 
		firstGene(GeneState::Dominant),
		secondGene(GeneState::Dominant),
		dominantGeneticExpression(dominantGeneticExpression),
		interveningGeneticExpression(""),
		recessiveGeneticExpression(recessiveGeneticExpression),
		typeOfDominance(TypeOfDominance::Complete),
		dependentSigns(dependentSigns)
	{}

	//Ctror of chromosome with incomplete type of dominance
	Chromosome(const std::string signName,
		const std::string dominantGeneticExpression,
		const std::string interveningGeneticExpression,
		const std::string recessiveGeneticExpression,
		const DependentSignsAndConditionOfExpression& dependentSigns = {}) noexcept
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

	// method for setting gene states in chromosome
	void setGenes(const GeneState firstGeneValue, const GeneState secondGeneValue) noexcept
	{
		firstGene = firstGeneValue;
		secondGene = secondGeneValue;
	}
};
