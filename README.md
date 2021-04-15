# Property NFT
This project allows you to mint new Color NFT tokens. Once a token has been minted on a network, it is displayed on the frontend. 

## To deploy contract to blockchain
`truffle migrate --network (specify network)`

# local contract commands
These are to be executed in truffle develop
## Deploy to local blockchain
`migrate`
## Deploy contract
`cintract = await Property.deployed`

## Get Name
`await contract.name`

## Get Symbol
`await contract.symbol`
## To mint new tokens
`await contract.mint(#FFFFF)` where #FFFFF is the color of your choice

