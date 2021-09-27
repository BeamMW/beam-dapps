#pragma once
#include "ChromosomeMask.h"

using PhenotypeMask = std::deque<ChromosomeMask>;

#pragma pack (push, 1)
/*
* Mask contatins set of general characteristics of one class of characters
*/
class Mask
{
public:
	PhenotypeMask phenotypeMask; // set of general characteristics of each chromosome 
	uint16_t size; // size of phenotypeMask = number of all chromosomes

	Mask() noexcept;
	~Mask() noexcept = default;

	uint16_t getSize() noexcept;

	friend bool operator==(const Mask& lhs, const Mask& rhs);

private:
	void setSize(const PhenotypeMask& mask) noexcept;
};

#pragma pack (pop)
