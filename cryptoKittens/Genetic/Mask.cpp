#include "Mask.h"

Mask::Mask() noexcept : size(0) {}

uint16_t Mask::getSize() noexcept
{
	setSize(phenotypeMask);
	return size;
}

void Mask::setSize(const PhenotypeMask& mask) noexcept
{
	for (auto maskIt = mask.cbegin(); maskIt != mask.cend(); ++maskIt)
	{
		++size;
		if (!(maskIt->dependentSigns.signs.empty()))
			setSize(maskIt->dependentSigns.signs);
	}
}

bool operator==(const Mask& lhs, const Mask& rhs) {
	return lhs.phenotypeMask == rhs.phenotypeMask;
}
