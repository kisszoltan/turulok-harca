# Turulok Harca

Turulok Harca is an interactive, satirical web game inspired by the atmosphere and power dynamics of _Game of Thrones_, transposed to the Hungarian political landscape. The project merges fantasy storytelling with real-world allegory, offering players a chance to ask provocative questions and vote on issues that reflect current political tensions.

> ⚠️ **Note:** This project is built specifically for a Hungarian audience. While the mechanics and technologies are universally understandable, meaningful participation requires knowledge of Hungarian language, culture, and current political discourse.

## Technologies Used

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [HeroUI v2](https://heroui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## Game Concept

Players join one of two fictional factions:

- **Hungeros**, ruled by the conservative _Victarion Oben_, and
- **Westeria**, led by the reformist _Petyr Magor_.

These characters are allegorical stand-ins for real-world Hungarian political figures. Players can:

- **Submit questions** they would like to ask the "future ruler"
- **Vote** on questions submitted by others
- **See live vote tallies** and track which faction has the most support
- **Engage in playful tribal competition** between Westeria and Hungeros

The UI and copy are entirely in Hungarian, reflecting the localized nature of the project.

## How to Use

### Clone and Install

```bash
git clone https://github.com/kisszoltan/turulok-harca.git
cd turulok-harca
pnpm install
```

For your own backend structures and logic you will be required to create a project in Convex and then run the following command:

```bash
pnpm convex
```

### Run the Development Server

```bash
pnpm dev
```

## Deployment

The project is designed for deployment on platforms like Vercel or Netlify.

You can verify your project prior deployment with the following command:

```bash
pnpm build
```

## License

Licensed under the [MIT license](https://github.com/kisszoltan/turulok-harca/blob/main/LICENSE).

## Disclaimer

Turulok Harca is a creative cultural project exploring civic engagement and political satire in the Hungarian context. It’s not affiliated with any party or movement.
