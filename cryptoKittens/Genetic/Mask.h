#pragma once
#include "ChromosomeMask.h"

using PhenotypeMask = std::vector<ChromosomeMask>;

/*
* Mask contatins set of general characteristics of one class of characters
*/
class Mask
{
public:
	PhenotypeMask phenotypeMask; // set of general characteristics of each chromosome 
	uint16_t size; // size of phenotypeMask = number of all chromosomes

	Mask() noexcept : size(0) {}
	~Mask() noexcept = default;

	uint16_t getSize() noexcept
	{
		setSize(phenotypeMask);
		return size;
	}

private:
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

bool operator==(const Mask& lhs, const Mask& rhs) {
	return lhs.phenotypeMask == rhs.phenotypeMask;
}

//namespace std
//{
//	template<> struct hash<Mask>
//	{
//
//		std::size_t operator()(ChromosomeMask const& s) const noexcept;
//		
//		std::size_t operator()(ChromosomeMask::DependentSignsAndConditionOfExpression const& s) const noexcept
//		{
//			std::size_t h1 = std::hash<uint16_t>{}(static_cast<uint16_t>(s.baseGene));
//			std::size_t h2 = std::hash<uint16_t>{}(static_cast<uint16_t>(s.baseGene));
//			std::size_t h4 = std::hash<std::vector<ChromosomeMask>>{}(s.signs);
//			return h1 ^ (h2 << 1);
//		}
//
//		std::size_t operator()(ChromosomeMask const& s) const noexcept
//		{
//			std::size_t h1 = std::hash<std::string>{}(s.signName);
//			std::size_t h2 = std::hash<std::string>{}(s.dominantGeneticExpression);
//			std::size_t h3 = std::hash<std::string>{}(s.interveningGeneticExpression);
//			std::size_t h4 = std::hash<std::string>{}(s.recessiveGeneticExpression);
//			std::size_t h4 = std::hash<uint16_t>{}(static_cast<uint16_t>(s.typeOfDominance));
//			std::size_t h5 = std::hash<ChromosomeMask::DependentSignsAndConditionOfExpression>{}(s.dependentSigns);
//			return h1 ^ (h2 << 1);
//		}
//
//		std::size_t operator()(Mask const& s) const noexcept
//		{
//			std::size_t h1 = std::hash<std::vector<ChromosomeMask>>{}(s.phenotypeMask);
//			std::size_t h2 = std::hash<uint16_t>{}(s.size);
//			return h1 ^ (h2 << 1);
//		}
//	};
//}
