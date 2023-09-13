## Inspiration
There are many websites that allow you to place bets on different sporting events. Very few of them provide esports as one of their offerings. And almost every single one of them allows you to bet only on the result of esports matches. But between the map picks and the final kill, **a lot** of things happen. My goal was to build an app that allowed viewers to get more involved in the action by predicting the result of small micro-events during the esports match like round results, kill counts, player abilities, and much more. We see such micro-bets in traditional sports but almost never in esports, until now. For such an app, a reliable source of live events happening in the game was essential, and GRID served that exact purpose. Additionally, money is the central aspect of a betting platform, so I also wanted to eliminate friction by adopting a borderless payments infrastructure to power my app. Hence I chose to do it using cryptocurrency, similar to _Stake.com_.

## What it does
flank.bet is a crypto-powered esports micro-betting platform that allows you, as a viewer, to predict micro-events in a game (CSGO, currently) happening in realtime. As the game progresses, you are prompted with different events, and you can wager money on one of the potential outcomes of that particular event. It also comes with embedded live-stream of the match, so you can watch the game and place your bets at the same time. These bets are short-lived, and come with instant payouts. Watch the game, predict the outcome, place your bet, wait for the result, get paid. Placing these bets requires a level of skill and analytical understanding of the game dynamics, players, maps, weapons, and agents as every micro-event such as a kill, depends on all of those factors.

## How I built it
There are 4 pillars of the app - frontend, backend, Firestore database, and a smart contract.
First I have the frontend, built using Next.js. This is the user-facing app where you can watch matches and place your bets. When a user places a bet, the respective amount of crypto (MATIC) is moved from their wallet to a smart contract and locked in there.
Second is a Node.js server. This interacts with and receives live events from GRID, filters out the relevant ones, creates question-based bets from them, and saves them to Firebase. On the frontend, these questions are read from Firebase and users' bets are saved along with them. When the outcome has been declared in the match, the server filters out the winners of that particular event, calculates the payouts using the following algorithm and distributes the money among them from the smart contract. Each winner is distributed a different amount of MATIC depending on how much MATIC they originally entered.
```
payout = betAmount + (betAmount / totalBetAmountOnWinningOutcome) * totalBetAmountOnLosingOutcome;
```
The smart contract is deployed on the _Polygon Mumbai Testnet_, so anyone can try it out using test MATIC tokens.

## Challenges I ran into
The hardest part was definitely mocking the live event stream using websockets. Since the events were provided as a huge JSON file, it could not be deployed to a production server. Thankfully the organisers provided a sample server to mock the live events stream. I extended it and built my own server in a similar fashion.
Another challenge was the smart contract interaction and making it work smoothly with Firestore database. I had to change my schemas multiple times before settling for ones that worked well.

## Accomplishments that I'm proud of
Firstly I am proud of finishing the app before the deadline and making a valid submission. There were times when that seemed quite difficult.
I am also proud of having learnt a ton of new stuff in a limited period of time, like interacting with smart contracts from a server environment as opposed to from the browser.
There were so many moving parts to this project and I'm glad I got them to work together.

## What's next for flank.bet
This submission serves as a POC for the immense possibilities that can be unlocked using GRID. In the upcoming days I want to add support for more events and make it possible to bet on more complex events like most kills in a round, damage dealt by a player, abilities used and their impact.
I only used the CSGO datasets provided in the hackathon since I am not familiar with DOTA. In the future I want to seek help from other developers and add support for more games like Valorant in addition to DOTA.
