# Color NFT
This project allows you to mint new Color NFT tokens. Once a token has been minted on a network, it is displayed on the frontend. 

## To deploy contract to blockchain
`truffle migrate --network (specify network)`

# local contract commands
## Deploy contract
`contract = await Color.deployed`

## To mint new tokens
`await contract.mint(#FFFFF)` where #FFFFF is the color of your choice

