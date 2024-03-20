# Slicer

Simple Inventory Manager for small businesses

## About this repo

This repository is a monorepo using Turborepo and pnpm containing:

### Apps and Packages

- `nextjs`: a [Next.js](https://nextjs.org/) app
- `mobile`: an expo mibile app using React Native
- `@repo/ui`: a stub React component library shared by both `nextjs` and `mobile` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo
- `packages/api`: an express backend for our endpoints

### Utilities

- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Using this monorepo

### Develop

To develop all apps and packages and install dependencies, run the following command:

```
pnpm dev
```

### Build

To build all apps and packages, run the following command:

```
pnpm build
```

### Configure environmental variables

To Configure all env variables, run the following command:

```
# Not yet set up
cp .env.example .env

```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```
