const fetch = require('node-fetch');

class ManifoldService {
  constructor() {
    this.predictionsList = [
      {
        id: 'new-pandemic-in-2025',
        question: "Will there be a new pandemic in 2025?",
        embedUrl: "https://embed.polymarket.com/market.html?market=new-pandemic-in-2025&features=volume&theme=dark"
      },
      {
        id: 'fed-rate-hike-in-2025',
        question: "Will the Fed hike rates in 2025?",
        embedUrl: "https://embed.polymarket.com/market.html?market=fed-rate-hike-in-2025&features=volume&theme=dark"
      },
      {
        id: 'russia-x-ukraine-ceasefire-in-2025',
        question: "Will Russia and Ukraine agree to a ceasefire in 2025?",
        embedUrl: "https://embed.polymarket.com/market.html?market=russia-x-ukraine-ceasefire-in-2025&features=volume&theme=dark"
      },
      {
        id: 'israel-withdraws-from-gaza-in-2025',
        question: "Will Israel withdraw from Gaza in 2025?",
        embedUrl: "https://embed.polymarket.com/market.html?market=israel-withdraws-from-gaza-in-2025&features=volume&theme=dark"
      },
      {
        id: 'will-trump-deport-750000-or-more-people-in-2025',
        question: "Will Trump deport 750,000 or more people in 2025?",
        embedUrl: "https://embed.polymarket.com/market.html?market=will-trump-deport-750000-or-more-people-in-2025&features=volume&theme=dark"
      },
      {
        id: 'us-recession-in-2025',
        question: "Will there be a US recession in 2025?",
        embedUrl: "https://embed.polymarket.com/market.html?market=us-recession-in-2025&features=volume&theme=dark"
      },
      {
        id: 'will-2025-be-the-hottest-year-on-record',
        question: "Will 2025 be the hottest year on record?",
        embedUrl: "https://embed.polymarket.com/market.html?market=will-2025-be-the-hottest-year-on-record&features=volume&theme=dark"
      },
      {
        id: 'obama-divorce-in-2025',
        question: "Will the Obamas divorce in 2025?",
        embedUrl: "https://embed.polymarket.com/market.html?market=obama-divorce-in-2025&features=volume&theme=dark"
      },
      {
        id: 'google-maps-renames-gulf-of-america-before-march',
        question: "Will Google Maps rename Gulf of America before March?",
        embedUrl: "https://embed.polymarket.com/market.html?market=google-maps-renames-gulf-of-america-before-march&features=volume&theme=dark"
      },
      {
        id: 'will-trump-extend-tax-cut-on-high-earners',
        question: "Will Trump extend tax cuts on high earners?",
        embedUrl: "https://embed.polymarket.com/market.html?market=will-trump-extend-tax-cut-on-high-earners&features=volume&theme=dark"
      },
      {
        id: 'x-relaunches-vine-before-july',
        question: "Will X relaunch Vine before July?",
        embedUrl: "https://embed.polymarket.com/market.html?market=x-relaunches-vine-before-july&features=volume&theme=dark"
      },
      {
        id: 'zuckerberg-divorce-in-2025',
        question: "Will the Zuckerbergs divorce in 2025?",
        embedUrl: "https://embed.polymarket.com/market.html?market=zuckerberg-divorce-in-2025&features=volume&theme=dark"
      },
      {
        id: 'will-trump-cut-corporate-taxes-in-2025',
        question: "Will Trump cut corporate taxes in 2025?",
        embedUrl: "https://embed.polymarket.com/market.html?market=will-trump-cut-corporate-taxes-in-2025&features=volume&theme=dark"
      },
      {
        id: 'ai-wins-math-olympiad-in-2025',
        question: "Will AI win Math Olympiad in 2025?",
        embedUrl: "https://embed.polymarket.com/market.html?market=ai-wins-math-olympiad-in-2025&features=volume&theme=dark"
      },
      {
        id: 'us-enacts-ai-safety-bill-in-2025',
        question: "Will US enact AI Safety Bill in 2025?",
        embedUrl: "https://embed.polymarket.com/market.html?market=us-enacts-ai-safety-bill-in-2025&features=volume&theme=dark"
      },
      {
        id: 'openai-announces-it-has-achieved-agi-in-2025',
        question: "Will OpenAI announce AGI achievement in 2025?",
        embedUrl: "https://embed.polymarket.com/market.html?market=openai-announces-it-has-achieved-agi-in-2025&features=volume&theme=dark"
      },
      {
        id: 'deepseek-better-than-all-openai-models-before-march',
        question: "Will Deepseek surpass all OpenAI models before March?",
        embedUrl: "https://embed.polymarket.com/market.html?market=deepseek-better-than-all-openai-models-before-march&features=volume&theme=dark"
      },
      {
        id: 'trump-divorce-in-2025',
        question: "Will the Trumps divorce in 2025?",
        embedUrl: "https://embed.polymarket.com/market.html?market=trump-divorce-in-2025&features=volume&theme=dark"
      },
      {
        id: 'jay-z-beyonc-divorce-in-2025',
        question: "Will Jay-Z and Beyoncé divorce in 2025?",
        embedUrl: "https://embed.polymarket.com/market.html?market=jay-z-beyonc-divorce-in-2025&features=volume&theme=dark"
      },
      {
        id: 'taylor-swift-and-travis-kelce-engaged-before-april',
        question: "Will Taylor Swift and Travis Kelce get engaged before April?",
        embedUrl: "https://embed.polymarket.com/market.html?market=taylor-swift-and-travis-kelce-engaged-before-april&features=volume&theme=dark"
      }
    ];
  }

  async getMarkets() {
    return this.predictionsList;
  }

  async checkResolution(marketId) {
    return { resolved: false, outcome: null };
  }
}

module.exports = new ManifoldService();