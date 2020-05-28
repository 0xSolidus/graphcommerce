# Magento 2 PWA as a library

The goal is to create a frontend where Magento is used as a library be able to
use Magento's functionality on places where we want as little or much as needed.

- As little: Only use Magento's GraphQL API to fetch / send data
- As much: Use @magento/venia-ui components out of the box and follow the
  'checkout in a component' model.

Magento's PWA solution consists of the following packages:
https://github.com/magento/pwa-studio/tree/develop/packages

| PWA Studio                               | Our Solution           |
| ---------------------------------------- | ---------------------- |
| babel-preset-peregrine                   | NextJS + Typescript    |
| create-pwa                               | NextJS                 |
| graphql-cli-validate-magento-pwa-queries | GraphQL Code Generator |
| pagebuilder                              | GraphCMS               |
| peregrine                                |                        |
| pwa-buildpack                            | NextJS                 |
| upward-js                                | NextJS + Vercel        |
| upward-spec                              | Serverless             |
| venia-concept                            | Reach Digital UI       |
| venia-styleguide                         | Reach Digital UI       |
| venia-ui                                 | Reach Digital UI       |

## Valuable parts of Magento's PWA solution

Magento's PWA solution is client side only rendered, this means that we can
_only_ use Magento's library to render client side. The biggest value that the
Magento UI framework delivers is actually the dynamic components:

- Product delivery informatin
- Product Add To Cart
- Customer login information
- Minicart
- Checkout / Cart
- Account

## NIH parts of Magento's PWA solution

Magento has the tendency to invent solutions themselves which are a lesser
version of actual open source solutions and therefor we're replacing Magento's
custom parts with NextJS where possible.

## Useless parts of Magento's PWA solution

The UI library is (as expected) super limited and is a custom solution once
again. It doesn't offer a good default and it will require beautification before
we can even begin to start using it. I'd call the solution Naive.

## Technical

Considered bad:

- @magento/venia-ui/lib/RootComponents -> NextJS Dynamic pages, should be
  rewritten completely to leverage SSG.
- @magento/venia-ui/lib/components -> All components should be replaceable, but
  having a compatibility layer so that they work would be nice.

* React Router is considered bad to be used in combination with NextJS and
  should be avoided at all costs.

## Strategy

1. Get category listing working
2. Get product view working
3. Get Add To Cart working
4. Get Minicart working
5. Get Checkout working
