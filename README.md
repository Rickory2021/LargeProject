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

## Using This Monorepo

### Develop, Build, and Config

To develop, build, and configure all apps, packages, and dependencies,<br>
Please refer to [SETUP.md](doc/SETUP.md) to setup the project.

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

## Contributing to Monorepo

To contribute to the Monorepo after setting up,<br>
Please refer to [CONTRIBUTING.md](doc/CONTRIBUTING.md) properly contribute to the project.

## Additional Docuementation

Additional Docuementation that is used for this project can be found in the [Docuement Directory](doc/).<br>
Please refer to the Markdown files as well as the group discord's #general-docuemntation for important information
