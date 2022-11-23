export const COIN_LIST: {
  id: string
  symbol: string
  name: string
  platforms: { [platform: string]: string }
}[] = [
  {
    id: 'pooltogether',
    symbol: 'pool',
    name: 'PoolTogether',
    platforms: {
      'ethereum': '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e',
      'polygon-pos': '0x25788a1a171ec66da6502f9975a15b609ff54cf6'
    }
  },
  {
    id: 'usd-coin',
    symbol: 'usdc',
    name: 'USD Coin',
    platforms: {
      'ethereum': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      'near-protocol': 'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near',
      'step-network': '0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d',
      'klay-token': '0x6270b58be569a7c0b8f47594f191631ae5b2c86c',
      'velas': '0x80a16016cc4a2e6a2caca8a4a498b1699ff0f844',
      'dogechain': '0x765277eebeca2e31912c9946eae1021199b39c61',
      'canto': '0x80b5a32e4f032b2a058b4f29ec95eefeeb87adcd',
      'arbitrum-nova': '0x750ba8b76187092b0d1e87e28daaf484d1b5273b',
      'bitgert': '0xcf2df9377a4e3c10e9ea29fdb8879d74c27fcde7',
      'kava': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
      'astar': '0x6a2d262d56735dba19dd70682b39f6be9a931d98',
      'cosmos': 'ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858',
      'conflux': '0x6963efed0ab40f6c3d7bda44a05dcf1437c44372',
      'energi': '0xffd7510ca0a3279c7a5f50018a26c21d5bc1dbcf',
      'sx-network': '0xe2aa35c2039bd0ff196a6ef99523cc0d3972ae3e',
      'evmos': '0x51e44ffad5c2b122c8b635671fcc8139dc636e82',
      'elastos': '0xa06be0f5950781ce28d965e5efc6996e88a8c141',
      'defi-kingdoms-blockchain': '0x3ad9dfe640e1a9cc1d9b0948620820d975c3803a',
      'milkomeda-cardano': '0xb44a9b6905af7c801311e8f4e76932ee959c663c',
      'syscoin': '0x2bf9b864cdc97b08b6d79ad4663e71b8ab65c45c',
      'telos': '0x818ec0a7fe18ff94269904fced6ae3dae6d6dc0b',
      'moonbeam': '0x8f552a71efe5eefc207bf75485b356a0b3f01ec9',
      'avalanche': '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
      'meter': '0xd86e243fc0007e6226b07c9a50c9d70d78299eb5',
      'kucoin-community-chain': '0x980a5afef3d17ad98635f6c5aebcbaeded3c3430',
      'fuse': '0x620fd5fa44be6af63715ef4e65ddfa0387ad13f5',
      'metis-andromeda': '0xea32a96608495e54156ae48931a7c20f0dcc1a21',
      'optimistic-ethereum': '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
      'aurora': '0xb12bfca5a55806aaf64e99521918a4bf0fc40802',
      'kardiachain': '0x765277eebeca2e31912c9946eae1021199b39c61',
      'cronos': '0xc21223249ca28397b4b6541dffaecc539bff0c59',
      'boba': '0x66a2a913e447d6b4bf33efbec43aaef87890fbbc',
      'ronin': '0x0b7007c13325c48911f73a2dad5fa5dcbf808adc',
      'sora': '0x00ef6658f79d8b560f77b7b20a5d7822f5bc22539c7b4056128258e5829da517',
      'okex-chain': '0xc946daf81b08146b1c7a8da2a851ddf2b3eaaf85',
      'arbitrum-one': '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
      'harmony-shard-0': '0x985458e523db3d53125813ed68c274899e9dfab4',
      'fantom': '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
      'tomochain': '0xcca4e6302510d555b654b3eab9c0fcb223bcfdf0',
      'solana': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      'binance-smart-chain': '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      'polygon-pos': '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      'xdai': '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83'
    }
  },
  {
    id: 'tether',
    symbol: 'usdt',
    name: 'Tether',
    platforms: {
      'ethereum': '0xdac17f958d2ee523a2206206994597c13d831ec7',
      'near-protocol': 'dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near',
      'velas': '0xb44a9b6905af7c801311e8f4e76932ee959c663c',
      'ethereumpow': '0x2ad7868ca212135c6119fd7ad1ce51cfc5702892',
      'xdai': '0x4ecaba5870353805a9f068101a40e0f32ed605c6',
      'canto': '0xd567b3d7b8fe3c79a1ad8da978812cfc4fa05e75',
      'bitgert': '0xde14b85cf78f2add2e867fee40575437d5f10c06',
      'kava': '0xb44a9b6905af7c801311e8f4e76932ee959c663c',
      'avalanche': '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
      'astar': '0x3795c36e7d12a8c252a20c5a7b455f7c57b60283',
      'conflux': '0xfe97e85d13abd9c1c33384e796f10b73905637ce',
      'milkomeda-cardano': '0x80a16016cc4a2e6a2caca8a4a498b1699ff0f844',
      'tron': 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
      'syscoin': '0x922d641a426dcffaef11680e5358f34d97d112e1',
      'telos': '0xefaeee334f0fd1712f9a8cc375f427d9cdd40d73',
      'moonbeam': '0xefaeee334f0fd1712f9a8cc375f427d9cdd40d73',
      'fantom': '0x049d68029688eabf473097a2fc38ef61633a3c7a',
      'harmony-shard-0': '0x3c2b8be99c50593081eaa2a724f0b8285f5aba8f',
      'tomochain': '0x381b31409e4d220919b2cff012ed94d70135a59e',
      'kardiachain': '0x551a5dcac57c66aa010940c2dcff5da9c53aa53b',
      'meter': '0x5fa41671c48e3c951afc30816947126ccc8c162e',
      'fuse': '0xfadbbf8ce7d5b7041be672561bba99f79c532e10',
      'cronos': '0x66e428c3f67a68878562e79a0234c1f83c208770',
      'metis-andromeda': '0xbb06dca3ae6887fabf931640f67cab3e3a16f4dc',
      'boba': '0x5de1677344d3cb0d7d465c10b72a8f60699c062d',
      'aurora': '0x4988a896b1227218e4a686fde5eabdcabd91571f',
      'optimistic-ethereum': '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
      'moonriver': '0xb44a9b6905af7c801311e8f4e76932ee959c663c',
      'okex-chain': '0x382bb369d343125bfb2117af9c149795c6c65c50',
      'kucoin-community-chain': '0x0039f574ee5cc39bdd162e9a88e3eb1f111baf48',
      'arbitrum-one': '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
      'iotex': '0x3cdb7c48e70b854ed2fa392e21687501d84b3afc',
      'solana': 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      'binance-smart-chain': '0x55d398326f99059ff775485246999027b3197955',
      'huobi-token': '0xa71edc38d189767582c38a3145b5873052c3e47a',
      'polygon-pos': '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'
    }
  },
  {
    id: 'gitcoin',
    symbol: 'gtc',
    name: 'Gitcoin',
    platforms: {
      'ethereum': '0xde30da39c46104798bb5aa3fe8b9e0e1f348163f',
      'near-protocol': 'de30da39c46104798bb5aa3fe8b9e0e1f348163f.factory.bridge.near'
    }
  },
  {
    id: 'project-galaxy',
    symbol: 'gal',
    name: 'Galxe',
    platforms: {
      'ethereum': '0x5faa989af96af85384b8a938c2ede4a7378d9875',
      'binance-smart-chain': '0xe4cc45bb5dbda06db6183e8bf016569f40497aa5'
    }
  },
  {
    id: 'tribe-2',
    symbol: 'tribe',
    name: 'Tribe',
    platforms: { ethereum: '0xc7283b66eb1eb5fb86327f08e1b5816b0720212b' }
  },
  {
    id: 'compound-governance-token',
    symbol: 'comp',
    name: 'Compound',
    platforms: {
      'ethereum': '0xc00e94cb662c3520282e6f5717214004a7f26888',
      'energi': '0x66bc411714e16b6f0c68be12bd9c666cc4576063',
      'sora': '0x00dbd45af9f2ea406746f9025110297469e9d29efc60df8d88efb9b0179d6c2c',
      'arbitrum-one': '0x354a6da3fcde098f8389cad84b0182725c6c91de',
      'binance-smart-chain': '0x52ce071bd9b1c4b00a0b92d298c512478cad67e8',
      'avalanche': '0xc3048e19e76cb9a3aa9d77d8c03c29fc906e2437',
      'harmony-shard-0': '0x32137b9275ea35162812883582623cd6f6950958',
      'polygon-pos': '0x8505b9d2254a7ae468c0e9dd10ccea3a837aef5c'
    }
  },
  {
    id: 'dai',
    symbol: 'dai',
    name: 'Dai',
    platforms: {
      'ethereum': '0x6b175474e89094c44da98b954eedeac495271d0f',
      'near-protocol': '6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near',
      'hydra': 'abc2cd00700e06922bcf30fe0ad648507113cc56',
      'xdai': '0x44fa8e6f47987339850636f88629646662444217',
      'klay-token': '0x078db7827a5531359f6cb63f62cfa20183c4f10c',
      'velas': '0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d',
      'arbitrum-nova': '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
      'kava': '0x765277eebeca2e31912c9946eae1021199b39c61',
      'astar': '0x6de33698e9e9b787e09d3bd7771ef63557e148bb',
      'cosmos': 'ibc/0CD3A0285E1341859B5E86B6AB7682F023D03E97607CCC1DC95706411D866DF7',
      'energi': '0x0ee5893f434017d8881750101ea2f7c49c0eb503',
      'milkomeda-cardano': '0x639a647fbe20b6c8ac19e48e2de44ea792c62c5c',
      'syscoin': '0xefaeee334f0fd1712f9a8cc375f427d9cdd40d73',
      'moonbeam': '0x765277eebeca2e31912c9946eae1021199b39c61',
      'fantom': '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
      'cronos': '0xf2001b145b43032aaf5ee2884e456ccd805f677d',
      'aurora': '0xe3520349f477a5f6eb06107066048508498a291b',
      'moonriver': '0x80a16016cc4a2e6a2caca8a4a498b1699ff0f844',
      'sora': '0x0200060000000000000000000000000000000000000000000000000000000000',
      'arbitrum-one': '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
      'avalanche': '0xd586e7f844cea2f87f50152665bcbc2c279d8d70',
      'harmony-shard-0': '0xef977d2f931c1978db5f6747666fa1eacb0d0339',
      'metis-andromeda': '0x4651b38e7ec14bb3db731369bfe5b08f2466bd0a',
      'optimistic-ethereum': '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
      'binance-smart-chain': '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
      'polygon-pos': '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
    }
  },
  {
    id: 'uniswap',
    symbol: 'uni',
    name: 'Uniswap',
    platforms: {
      'ethereum': '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      'energi': '0x665b3a802979ec24e076c80025bff33c18eb6007',
      'sora': '0x009be848df92a400da2f217256c88d1a9b1a0304f9b3e90991a67418e1d3b08c',
      'arbitrum-one': '0xfa7f8980b0f1e64a2062791cc3b0871572f1f7f0',
      'optimistic-ethereum': '0x6fd9d7ad17242c41f7131d257212c54a0e816691',
      'harmony-shard-0': '0x90d81749da8867962c760414c1c25ec926e889b6',
      'avalanche': '0x8ebaf22b6f053dffeaf46f4dd9efa95d89ba8580',
      'huobi-token': '0x22c54ce8321a4015740ee1109d9cbc25815c46e6',
      'polygon-pos': '0xb33eaad8d922b1083446dc23f610c2567fb5180f',
      'binance-smart-chain': '0xbf5140a22578168fd562dccf235e5d43a02ce9b1',
      'xdai': '0x4537e328bf7e4efa29d05caea260d7fe26af9d74'
    }
  },
  {
    id: 'badger-dao',
    symbol: 'badger',
    name: 'Badger DAO',
    platforms: {
      'ethereum': '0x3472a5a71965499acd81997a54bba8d852c6e53d',
      'energi': '0x32e6842a6ea6a913687885ac856c2493b5b12f6f',
      'arbitrum-one': '0xbfa641051ba0a0ad1b0acf549a89536a0d76472e',
      'harmony-shard-0': '0x06b19a0ce12dc71f1c7a6dd39e8983e089c40e0d',
      'fantom': '0x753fbc5800a8c8e3fb6dc6415810d627a387dfc9',
      'xdai': '0xdfc20ae04ed70bd9c7d720f449eedae19f659d65'
    }
  },
  {
    id: 'barnbridge',
    symbol: 'bond',
    name: 'BarnBridge',
    platforms: {
      'ethereum': '0x0391d2021f89dc339f60fff84546ea23e337750f',
      'optimistic-ethereum': '0x3e7ef8f50246f725885102e8238cbba33f276747'
    }
  },
  {
    id: 'sushi',
    symbol: 'sushi',
    name: 'Sushi',
    platforms: {
      'ethereum': '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      'energi': '0x32aff6adc46331dac93e608a9cd4b0332d93a23a',
      'solana': 'ChVzxWRmrTeSgwd3Ui3UumcN8KX7VK3WaD4KGeSKpypj',
      'celo': '0xd15ec721c2a896512ad29c671997dd68f9593226',
      'sora': '0x0078f4e6c5113b3d8c954dff62ece8fc36a8411f86f1cbb48a52527e22e73be2',
      'arbitrum-one': '0xd4d42f0b6def4ce0383636770ef773390d85c61a',
      'avalanche': '0x37b608519f91f70f2eeb0e5ed9af4061722e4f76',
      'harmony-shard-0': '0xbec775cb42abfa4288de81f387a9b1a3c4bc552a',
      'binance-smart-chain': '0x947950bcc74888a40ffa2593c5798f11fc9124c4',
      'fantom': '0xae75a438b2e0cb8bb01ec1e1e376de11d44477cc',
      'polygon-pos': '0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a'
    }
  },
  {
    id: 'aave',
    symbol: 'aave',
    name: 'Aave',
    platforms: {
      'ethereum': '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
      'optimistic-ethereum': '0x76fb31fb4af56892a25e32cfc43de717950c9278',
      'energi': '0xa7f2f790355e0c32cab03f92f6eb7f488e6f049a',
      'binance-smart-chain': '0xfb6115445bff7b52feb98650c87f44907e58f802',
      'sora': '0x0091bd8d8295b25cab5a7b8b0e44498e678cfc15d872ede3215f7d4c7635ba36',
      'avalanche': '0x63a72806098bd3d9520cc43356dd78afe5d386d9',
      'harmony-shard-0': '0xcf323aad9e522b93f11c352caa519ad0e14eb40f',
      'fantom': '0x6a07a792ab2965c72a5b8088d3a069a7ac3a993b',
      'polygon-pos': '0xd6df932a45c0f255f85145f286ea0b292b21c90b',
      'huobi-token': '0x202b4936fe1a82a4965220860ae46d7d3939bb25'
    }
  },
  {
    id: 'matic-network',
    symbol: 'matic',
    name: 'Polygon',
    platforms: {
      'ethereum': '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
      'energi': '0x98997e1651919faeacee7b96afbb3dfd96cb6036',
      'moonbeam': '0x3405a1bd46b85c5c029483fbecf2f3e611026e45',
      'sora': '0x009134d5c7b7fda8863985531f456f89bef5fbd76684a8acdb737b3e451d0877',
      'moonriver': '0x682f81e57eaa716504090c3ecba8595fb54561d8',
      'binance-smart-chain': '0xcc42724c6683b7e57334c4e856f4c9965ed682bd',
      'harmony-shard-0': '0x301259f392b551ca8c592c9f676fcd2f9a0a84c5',
      'polygon-pos': '0x0000000000000000000000000000000000001010'
    }
  }
]
