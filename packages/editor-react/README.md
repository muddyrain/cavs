<p align="center">
  <a href="https://www.blocknotejs.org">
    <img alt="TypeCell" src="https://github.com/TypeCellOS/BlockNote/raw/main/docs/public/img/logos/banner.svg?raw=true" width="300" />
  </a>
</p>

<p align="center">
Welcome to BlockNote! The open source Block-Based
React rich text editor. Easily add a modern text editing experience to your app.
</p>

<p align="center">
<a href="https://discord.gg/Qc2QTTH5dF"><img alt="Discord" src="https://img.shields.io/badge/Chat on discord%20-%237289DA.svg?&style=for-the-badge&logo=discord&logoColor=white"/></a> 
</p>

<p align="center">
  <a href="https://www.blocknotejs.org">
    Homepage
  </a> - <a href="https://www.blocknotejs.org/docs/introduction">
    Documentation
  </a> - <a href="https://www.blocknotejs.org/docs/quickstart">
    Quickstart
  </a>- <a href="https://www.blocknotejs.org/examples">
    Examples
  </a>
</p>

# Live demo

See our homepage @ [https://www.blocknotejs.org](https://www.blocknotejs.org/) or browse the [examples](https://www.blocknotejs.org/examples).

# Example code (React)

[![npm version](https://badge.fury.io/js/%40blocknote%2Freact.svg)](https://badge.fury.io/js/%40blocknote%2Freact)

```typescript
import { useCreateBlockNote } from "@cavs/editor-react";
import { BlockNoteView } from "@blocknote/mantine";
import "@cavs/editor-core/fonts/inter.css";
import "@blocknote/mantine/style.css";

function App() {
  const editor = useCreateBlockNote();

  return <BlockNoteView editor={editor} />;
}
```

`@cavs/editor-react` comes with a fully styled UI that makes it an instant, polished editor ready to use in your app.

If you prefer to create your own UI components (menus), or don't want to use React, you can use `@cavs/editor-core` (_advanced_, [see docs](https://www.blocknotejs.org/docs/vanilla-js)).

# Features

BlockNote comes with a number of features and components to make it easy to embed a high-quality block-based editor in your app:

### Animations:

<img src="https://github.com/TypeCellOS/BlockNote/blob/readme/.resources/animations.gif?raw=true" width="400" />

### Helpful placeholders:

<img src="https://github.com/TypeCellOS/BlockNote/blob/readme/.resources/placeholders.gif?raw=true" width="400" />

### Drag and drop blocks:

<img src="https://github.com/TypeCellOS/BlockNote/blob/readme/.resources/dragdrop.gif?raw=true" width="400" />

### Nesting / indentation with tab and shift+tab:

<img src="https://github.com/TypeCellOS/BlockNote/blob/readme/.resources/nesting.gif?raw=true" width="400" />

### Slash (/) menu:

<img src="https://github.com/TypeCellOS/BlockNote/blob/readme/.resources/slashmenu.gif?raw=true" width="400" />

### Format menu:

<img src="https://github.com/TypeCellOS/BlockNote/blob/readme/.resources/selectmenu.gif?raw=true" width="400" />

### Real-time collaboration:

<img src="https://github.com/TypeCellOS/BlockNote/blob/readme/.resources/collaboration.gif?raw=true" width="400" />

# Feedback 🙋‍♂️🙋‍♀️

We'd love to hear your thoughts and see your experiments, so [come and say hi on Discord](https://discord.gg/Qc2QTTH5dF) or [Matrix](https://matrix.to/#/#typecell-space:matrix.org).

# Contributing 🙌

See [CONTRIBUTING.md](CONTRIBUTING.md) for more info and guidance on how to run the project (TLDR: just use `npm start`).

Directory structure:

```
blocknote
├── packages/core       - The core of the editor
├── packages/react      - The main library for use in React apps
├── packages/mantine    - Mantine (default) implementation of BlockNote UI
├── packages/ariakit    - AriaKit implementation of BlockNote UI
├── packages/shadcn     - ShadCN / Tailwind / Radix implementation of BlockNote UI
├── examples            - Example apps
├── playground          - App to browse the example apps (https://playground.blocknotejs.org)
└── tests               - Playwright end to end tests
```

The codebase is automatically tested using Vitest and Playwright.

# License 📃

BlockNote is licensed under the [MPL 2.0 license](https://fossa.com/blog/open-source-software-licenses-101-mozilla-public-license-2-0/), which allows you to use BlockNote in commercial (and closed-source) applications. If you make changes to the BlockNote source files, you're expected to publish these changes so the wider community can benefit as well.

# Credits ❤️

BlockNote builds directly on two awesome projects; [Prosemirror](https://prosemirror.net/) by Marijn Haverbeke and [Tiptap](https://tiptap.dev/). Consider sponsoring those libraries when using BlockNote: [Prosemirror](https://marijnhaverbeke.nl/fund/), [Tiptap](https://github.com/sponsors/ueberdosis).

BlockNote is built as part of [TypeCell](https://www.typecell.org). TypeCell is proudly sponsored by the renowned [NLNet foundation](https://nlnet.nl/foundation/) who are on a mission to support an open internet, and protect the privacy and security of internet users. Check them out!

<a href="https://nlnet.nl"><img src="https://nlnet.nl/image/logos/NGIAssure_tag.svg" alt="NLNet" width="100"></a>

Hosting and deployments powered by Vercel:

<a href="https://vercel.com/?utm_source=TypeCell&utm_campaign=oss"><img src="https://images.ctfassets.net/e5382hct74si/78Olo8EZRdUlcDUFQvnzG7/fa4cdb6dc04c40fceac194134788a0e2/1618983297-powered-by-vercel.svg" alt="NLNet" width="150"></a>

This project is tested with BrowserStack
