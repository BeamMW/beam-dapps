#pragma once
#include <deque>
#include <map>
#include <string_view>
#include "Mask.h"

#pragma pack (push, 1)
/*
* Chromosome, that consists of 2 alleles of gene, that describe sign expression
*/
class Chromosome
{
public:
	GeneState firstGene; // state of first gene
	GeneState secondGene;  // state of second gene

	Chromosome() noexcept = default;
	~Chromosome() noexcept = default;

	// method for setting gene states in chromosome
	void setGenes(const GeneState firstGeneValue, const GeneState secondGeneValue) noexcept
	{
		firstGene = firstGeneValue;
		secondGene = secondGeneValue;
	}
};
#pragma pack (pop)
