# WEB3 INVADERS

![Alt text](website/attachements/header.png)

## Introduction

Web3 invaders is a game developed to participate in the [Alchemy University Ethereum Bootcamp](https://university.alchemy.com/).

It's like a space invaders game embellished with web3.

**PLAY ON A COMPUTER** (not adapted to small devices)  
Access the game [here](https://dev.invaders.sampleweb3.dev/)  

**Use a Polygon Amoy Tesnet wallet**

- **Production environment:** https://invaders.sampleweb3.dev/  
- **Dev environment:** https://dev.invaders.sampleweb3.dev/

## Features

### Playable game

- ✅ A space invader game
- ✅ 3 Levels (you start from level 1 each time)

### Customizable game through NFTs

- ✅ Modify your spaceship to change it's power
- ✅ Modify your projectile to have more fun

### Marketplace to buy/sell NFTs related to the game

- ✅ Custom smart contract to buy and sell NFTs

## Run locally

Launch your game
```sh
    npm install
    npm run dev
```

## Security disclaimer & improvement

This project is created for fun and need security improvements before using it for a real projects:
- Anyone can play with a smart contract function
  -  You can fake the leaderboard score
  -  You can fake leveling up

- The code readability, typescript and unit tests should be improved in the future.

## Credits

- [Alchemy](https://www.alchemy.com/) - Great tutorials to learn smart contracts development on ethereum in depth!

- [FreeCodeCamp Youtube video](https://www.youtube.com/watch?v=gyMwXuJrbJQ) - Full Stack web3 development, best way to start a web3 journey
  
- [MidJourney](https://www.midjourney.com/) - All assets are generated from midjourney (they are then reworked on GIMP, find the gimp files in the [raw folder](./raw/))

- [ChatGPT](https://openai.com/) - Useful on specific use cases

- [AWS](https://aws.amazon.com/) - Hosting (S3 & Cloudfront - automated with terraform and scripts through AWS Organization). Github workflows & project are stored on a private repository. This act as a public interface.
