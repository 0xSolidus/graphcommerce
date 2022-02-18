<p align="center">
    <a href="https://www.graphcommerce.org/"><img src="./examples/magento-graphcms/public/favicon.svg" alt="GraphCommerce Logo"/></a>
</p>
<p align="center">
    <a href="https://www.npmjs.com/package/@graphcommerce/graphcommerce"><img src="https://img.shields.io/npm/v/@graphcommerce/graphcommerce.svg?sanitize=true" alt="Version"></a>
    <a href="https://github.com/ho-nl/graphcommerce/blob/main/LICENSE.md"><img src="https://img.shields.io/npm/l/@graphcommerce/graphcommerce.svg?sanitize=true" alt="License"></a>
    <a href="https://npmcharts.com/compare/@graphcommerce/graphcommerce?minimal=true"><img src="https://img.shields.io/npm/dm/@graphcommerce/graphcommerce.svg?sanitize=true" alt="Downloads"></a>
 </p>

<div align="center">

📚 [Docs](https://graphcommerce.org/docs) | 🗣
[Slack](https://join.slack.com/t/graphcommerce/shared_invite/zt-11rmgq1ad-F~0daNtKcSvtcC4eQRzjeQ)
| 📝 [Changelog](./CHANGELOG.md)

</div>

GraphCommerce is an open source front-end framework for building headless
Magento e-commerce storefronts in React.

Take a look at the GraphCommerce
[demo store](https://graphcommerce.vercel.app/nl-nl) or set up your local
development environment with the instructions below.

---

# Getting Started

### Download the example

- `git clone https://github.com/ho-nl/m2-pwa graphcommerce`
- `mkdir my-project`
- `cp -R graphcommerce/examples/magento-graphcms/. my-project`
- `cd my-project`
- `cp -R .env.example .env`
- `rm CHANGELOG.md && touch CHANGELOG.md`
- `rm -rf node_modules && rm -rf .next`

### Update package.json

Edit /package.json. Delete `"scripts": {...}` and rename `scripts_local` to
`scripts`

Before:

```json
{
  "name": "@graphcommerce/magento-graphcms",
  "scripts": {
    // ... monorepo scripts, start, build, dev, ...
  },
  "scripts_local": {
    // ... start, build, dev, ...
  }
}
```

After

```json
{
  "name": "@my-company/my-project",
  "scripts": {
    // ... start, build, dev, ...
  }
}
```

## Start the development environment

- `yarn` Install the dependencies
- `yarn codegen` Converts all .graphql files to typescript files
- `yarn dev` Run the app

Visit the development environment running at http://localhost:3000  
Visit the GraphQL Playground running at http://localhost:3000/api/graphql

---

## Next Steps

- Learn more about
  [getting started with GraphCommerce](./docs/content/getting-started/create.md)
- [Start building a GraphCommerce custom storefront](../getting-started/start-building.md)
  by customizing text and component styles, fetching data from server
  components, and making changes to GraphQL queries
