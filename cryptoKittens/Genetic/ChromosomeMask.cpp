#include "ChromosomeMask.h"

ChromosomeMask::DependentSignsAndConditionOfExpression::DependentSignsAndConditionOfExpression() noexcept
	: baseGene(GeneState::Dominant), baseGenePresence(BaseGenePresence::Presence) {}

ChromosomeMask::DependentSignsAndConditionOfExpression::DependentSignsAndConditionOfExpression
(const GeneState baseGene, const BaseGenePresence baseGenePresence,
	const std::deque<ChromosomeMask>&& signs) noexcept
	: baseGene(baseGene), baseGenePresence(baseGenePresence), signs(signs)
{}

ChromosomeMask::DependentSignsAndConditionOfExpression::DependentSignsAndConditionOfExpression
(const ChromosomeMask::DependentSignsAndConditionOfExpression& cp)
	: baseGene(cp.baseGene), baseGenePresence(cp.baseGenePresence), signs(cp.signs)
{}

ChromosomeMask::ChromosomeMask(const std::string_view signName,
	const std::string_view dominantGeneticExpression,
	const std::string_view recessiveGeneticExpression,
	const ChromosomeMask::DependentSignsAndConditionOfExpression& dependentSigns) noexcept
	: signName(signName),
	dominantGeneticExpression(dominantGeneticExpression),
	interveningGeneticExpression(""),
	recessiveGeneticExpression(recessiveGeneticExpression),
	typeOfDominance(TypeOfDominance::Complete),
	dependentSigns(dependentSigns)
{}

ChromosomeMask::ChromosomeMask(const std::string_view signName,
	const std::string_view dominantGeneticExpression,
	const std::string_view interveningGeneticExpression,
	const std::string_view recessiveGeneticExpression,
	const ChromosomeMask::DependentSignsAndConditionOfExpression& dependentSigns) noexcept
	: signName(signName),
	dominantGeneticExpression(dominantGeneticExpression),
	interveningGeneticExpression(interveningGeneticExpression),
	recessiveGeneticExpression(recessiveGeneticExpression),
	typeOfDominance(TypeOfDominance::Incomplete),
	dependentSigns(dependentSigns)
{}

ChromosomeMask::ChromosomeMask(const std::string_view signName,
	const std::string_view dominantGeneticExpression,
	const std::string_view recessiveGeneticExpression) noexcept
	: signName(signName),
	dominantGeneticExpression(dominantGeneticExpression),
	interveningGeneticExpression(""),
	recessiveGeneticExpression(recessiveGeneticExpression),
	typeOfDominance(TypeOfDominance::Complete)
{}

ChromosomeMask::ChromosomeMask(const std::string_view signName,
	const std::string_view dominantGeneticExpression,
	const std::string_view interveningGeneticExpression,
	const std::string_view recessiveGeneticExpression) noexcept
	: signName(signName),
	dominantGeneticExpression(dominantGeneticExpression),
	interveningGeneticExpression(interveningGeneticExpression),
	recessiveGeneticExpression(recessiveGeneticExpression),
	typeOfDominance(TypeOfDominance::Incomplete)
{}

ChromosomeMask::ChromosomeMask(const ChromosomeMask& cp)
	: signName(cp.signName),
	dominantGeneticExpression(cp.dominantGeneticExpression),
	interveningGeneticExpression(cp.interveningGeneticExpression),
	recessiveGeneticExpression(cp.recessiveGeneticExpression),
	typeOfDominance(cp.typeOfDominance),
	dependentSigns(cp.dependentSigns)
{}

bool operator==(const ChromosomeMask::DependentSignsAndConditionOfExpression& lhs, 
	const ChromosomeMask::DependentSignsAndConditionOfExpression& rhs) {
	return lhs.baseGene == rhs.baseGene &&
		lhs.baseGenePresence == rhs.baseGenePresence &&
		lhs.signs == rhs.signs;
}

bool operator==(const ChromosomeMask& lhs, const ChromosomeMask& rhs) {
	return lhs.signName == rhs.signName &&
		lhs.typeOfDominance == rhs.typeOfDominance &&
		lhs.dominantGeneticExpression == rhs.dominantGeneticExpression &&
		lhs.interveningGeneticExpression == rhs.interveningGeneticExpression &&
		lhs.recessiveGeneticExpression == rhs.recessiveGeneticExpression &&
		lhs.dependentSigns == rhs.dependentSigns;
}