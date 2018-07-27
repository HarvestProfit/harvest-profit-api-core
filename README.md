[![CircleCI](https://circleci.com/gh/HarvestProfit/harvest-profit-api-core.svg?style=svg&circle-token=1b4aaf037d0fc472f191c6c6ed967319f7703ac7)](https://circleci.com/gh/HarvestProfit/harvest-profit-api-core)
[![codecov](https://codecov.io/gh/HarvestProfit/harvest-profit-api-core/branch/master/graph/badge.svg)](https://codecov.io/gh/HarvestProfit/harvest-profit-api-core)

## Installation
You can install this via [NPM](https://www.npmjs.com/):
```bash
npm install @harvest-profit/api-core
```
Or [Yarn](https://yarnpkg.com/en/):
```bash
yarn add @harvest-profit/api-core
```

## Usage

```js static
import ApiCore from 'harvest-profit/api-core';
```

## Development
While developing, you may find it useful to preview your components. You can do so by running the development server with:
```bash
yarn start
```

To deploy a new version to NPM, bump the version number, commit/merge to `master`, and run the following:
```bash
yarn run clean
yarn run build

# Either NPM
npm publish
# Or Yarn, they do the same thing
yarn publish
```

## License
This project is [MIT licensed](https://github.com/HarvestProfit/harvest-profit-api/blob/master/LICENSE)
