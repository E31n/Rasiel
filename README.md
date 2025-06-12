<div align="center">
<h1> 🌌 Rasiel </h1>

[![Stars](https://img.shields.io/github/stars/E31n/Rasiel?style=for-the-badge&color=8a2be2)](https://github.com/E31n/Rasiel/stargazers)
[![Forks](https://img.shields.io/github/forks/E31n/Rasiel?style=for-the-badge&color=9370db)](https://github.com/E31n/Rasiel/network)
[![Issues](https://img.shields.io/github/issues/E31n/Rasiel?style=for-the-badge&color=ba55d3)](https://github.com/E31n/Rasiel/issues)
[![License](https://img.shields.io/github/license/E31n/Rasiel?style=for-the-badge&color=d8bfd8)](https://github.com/E31n/Rasiel/blob/main/LICENSE)
[![Astro](https://img.shields.io/badge/Powered%20by-Astro-blueviolet?style=for-the-badge&logo=astro)](https://astro.build)

**Rasiel** is a sleek and modern static wallpaper website built with
[Svelte](https://svelte.dev/) and [Astro](https://astro.build/). It offers an
intuitive interface for browsing, viewing, and downloading high-quality
wallpapers. With features like slideshow viewing and bulk downloading based on
tags, Rasiel provides a seamless experience for wallpaper enthusiasts.

</div>

---

## ✨ Features

- **Responsive Wallpaper Viewer**: Browse and view wallpapers with a clean and
  responsive design.
- **Slideshow Mode**: Enjoy your favorite wallpapers in a continuous slideshow.
- **Download Options**:
    - Single-click download for individual wallpapers.
    - Bulk download wallpapers based on selected tags.
- **Tag-Based Filtering**: Easily filter wallpapers by categories or themes
  using tags.
- **Static Site Generation**: Built with Astro for fast and efficient static
  site generation.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or above)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/E31n/Rasiel.git
    cd Rasiel
    ```

2. **Install dependencies**:

    ```bash
    npm install
    # or
    bun install
    ```

3. **Run the development server**:

    ```bash
    npm run dev
    # or
    bun run dev
    ```

4. **Build for production**:

    ```bash
    npm run build
    # or
    bun run build
    ```

5. **Preview the production build**:
    ```bash
    npm run preview
    # or
    bun run preview
    ```

---

## 🖼️ Adding Wallpapers

To add new wallpapers:

1. Rename your image as Topic_Desc_Tags_Category.ext
2. Where Tags should be seperated by \_ and spaces should be replaced with - and
   ext can be any supported image format like webp, jpg, png, etc.
3. Place your image files in the `public/wallpapers/` or specific inner
   directory.

---

## 🏷️ Tagging System

Rasiel uses a tag-based system to categorize wallpapers.

- Tags help in filtering wallpapers based on themes, colors, or other
  attributes.
- Ensure that each wallpaper has appropriate tags for better organization and
  searchability.

---

## 📦 Bulk Downloading

Users can download multiple wallpapers at once based on selected tags: (Yet to
be implemented)

1. Navigate to the tag or category page.
2. Click on the "Download All" button to download a ZIP file containing all
   wallpapers under that tag.

---

## 🧪 Technologies Used

- [Svelte](https://svelte.dev/) - Frontend framework for building user
  interfaces.
- [Astro](https://astro.build/) - Static site generator for fast and optimized
  websites.
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript.
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for
  styling.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit them: `git commit -m 'Add your message here'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

For any issues or suggestions, please open an
[issue](https://github.com/E31n/Rasiel/issues) on GitHub.
