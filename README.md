# PoolTogether Analytics UI

Provides insight into the health of the PoolTogether protocol, such as statistics on treasury reserves and token faucets.

# Setup

Install dependencies:

```bash
$ yarn
```

Make sure you have `direnv` installed and copy `.envrc.example` to `.envrc`:

```bash
$ cp .envrc.example .envrc
```

Fill in your own values for `.envrc`, then run:

```bash
$ direnv allow
```

To run the local server, run:

```
$ yarn dev
```

## Adding More Info!

### Adding more tokens to watch

Pretty much everything is reacting to `useTokenLists` to get a list of token addresses to query for. Just add an address to the correct chain there.

### Adding more addresses to watch

Take a look at `TokenBalancesCard` and `useGovernanceTokenBalances` to get a live list of balances. These two components lookup token balances the Governance Timelock addresses on each chain. This is more or less copy pasta'd to create `ReservesCard` and `usePrizePoolReserves` to fetch token balances of V3 Prize Pool reserves.

#### Developer Tools

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
