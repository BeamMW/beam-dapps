# Cryptokittens😺😻😸

## Collection of kittens😺
There is a collection of pictures of kittens consisting of N species of kittens. Each species has a set of individual characteristics that make the species unique. Representatives of the same species will be interchangeable. There is a limited number of each kind of kitten, which will be calculated based on their degree of rarity. There are rare and more common kittens.

The goal of the game is to collect a complete collection of kittens with representatives of each species. Later we may add new species and expand the collection.

**TODO:**
- An algorithm for counting the initial number of kittens of each species in the collection based on their degree of rarity

## Kitten giveaway😻
Every M days at a certain time kittens are distributed (or every S blocks). Each time K species of kittens are distributed (each species a certain number based on the degree of rarity of the species).

It is known in advance which species and in what quantity will be distributed. After each distribution a new K species is shipped for distribution and users can come and see what will be distributed.

During the giveaway the users can click on the kittens they want to take away. The user can change the size of the fee to make it more likely that they will get a kitten. The first ones whose requests are processed faster get the kitten.  Fee is withdrawn only in case of a successful transaction, when a kitten is received.

You can get 1 kitten per giveaway. 

Once all available species of kittens are distributed, you cannot click on them. After all available kittens are distributed, new species are shipped for the next distribution. But they will not be available until the beginning of the next of the next giveaway, but users can go in and see in advance what will be distributed.

Translated with www.DeepL.com/Translator (free version)

**TODO:**
- an algorithm for shipping K kitten species based on how many of each species are left 
and the rarity of those species
- an algorithm to select the number of kittens of each species to be dispensed based on the rarity and how many kittens of that species have already been dispensed
- the transaction with a zero number of beams and with the removal of fee 
- an algorithm for selecting winners (tracking the blocks that are processed faster)
- an algorithm of controlling the number of kittens in 1 hand - only 1 kitty
- an algorithm of giving out a kitten to the winner

## Game start:😸
Each new player is shipped F (probably 1-3) kittens of different species as starter capital when he first enters. Perhaps the 3 starter kittens can be made the same and release F starter species for that. 

**TODO:**
- ship starting kittens to the user (~~randomly or~~~ F special starting species)

## For future reference:😼
The user should be able to sell the kitten to another user for a certain amount, which will be calculated based on how many members of the species have already been distributed. The initial value of kittens at the time when no member of the species has been given out will be calculated based on the rarity of the species.

Users should also have the opportunity to exchange kittens among themselves. 

**TODO:**
- algorithm for calculating the cost of a kitten based on how many of the species have already been distributed
- transactions for selling and exchanging kittens
- terms of kitten exchange
