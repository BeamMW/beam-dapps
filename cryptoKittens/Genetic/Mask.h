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

	friend bool operator==(const Mask& lhs, const Mask& rhs);

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
