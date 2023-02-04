import { css, defineConfig } from "@twind/core"
import presetAutoprefix from "@twind/preset-autoprefix"
import presetTailwind from "@twind/preset-tailwind"
import presetLineClamp from "@twind/preset-line-clamp"
import presetTailwindForms from "@twind/preset-tailwind-forms"

export default defineConfig({
  darkMode: "class",
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    fontFamily: {
      sans: [
        "-apple-system",
        "BlinkMacSystemFont",
        "segoe ui",
        "helvetica neue",
        "Arial",
        "noto sans",
        "sans-serif",
        "apple color emoji",
        "segoe ui emoji",
        "segoe ui symbol",
        "noto color emoji",
      ],
    },
    extend: {
      colors: {
        primary: {
          50: "#e7edff",
          100: "#bec9f6",
          200: "#93a6eb",
          300: "#6a82e2",
          400: "#405ed8",
          500: "#2845bf",
          600: "#1d3695",
          700: "#14266c",
          800: "#0a1743",
          900: "#01081b",
        },
      },
    },
  },
  preflight: (preflight: any) => css`
    ${preflight}

    html {
      font-family: -apple-system, BlinkMacSystemFont, segoe ui, helvetica neue,
        Arial, noto sans, sans-serif, apple color emoji, segoe ui emoji,
        segoe ui symbol, noto color emoji !important;
    }

    .scrollbar {
      scroll-behavior: smooth;
    }

    .scrollbar::-webkit-scrollbar {
      width: 3px;
    }
    .scrollbarhide.scrollbar::-webkit-scrollbar-thumb {
      background: transparent;
    }
    .scrollbarhide.scrollbar::-webkit-scrollbar-thumb:hover {
      background: transparent;
    }
    .scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }

    .scrollbar::-webkit-scrollbar-thumb {
      background: #555;
    }

    .scrollbar::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    .scrollbar::-webkit-scrollbar-track:hover {
      background: transparent;
    }
    .post-card-thumbnail:hover img {
      @apply scale-150;
    }
    .article-body {
      @apply text-lg leading-7;
    }

    .article-body h1,
    .article-body h2,
    .article-body h3,
    .article-body h4,
    .article-body h5,
    .article-body h6 {
      @apply my-4 font-bold text-black dark:text-gray-100;
    }

    .article-body h1 {
      @apply text-2xl md:text-4xl;
    }

    .article-body h2 {
      @apply text-xl md:text-3xl;
    }

    .article-body h3 {
      @apply text-lg md:text-2xl;
    }

    .article-body h4 {
      @apply text-base md:text-xl;
    }

    .article-body a {
      @apply text-primary-500 duration-200 hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-400;
    }

    .article-body {
      @apply pt-4;
    }

    .article-body p {
      @apply text-base leading-[24px] md:text-lg md:leading-[32px] text-black dark:text-gray-100;
    }

    .article-body p:not(:last-child) {
      @apply mb-6;
    }

    .article-body img {
      @apply h-auto max-h-full max-w-full rounded-md;
    }

    .article-body blockquote {
      @apply border-l-4 border-gray-200 p-4;
    }

    .article-body li {
      @apply ml-6 mb-2 text-base md:ml-12 md:text-lg;
    }

    .article-body ul {
      position: relative;
    }

    .article-body ul::before {
      content: " ";
      position: absolute;
      top: 0;
      bottom: 0;
      width: 5px;
      height: 100%;
      background: #0000001c;
      border-radius: 10px;
    }

    .article-body ul::before {
      @apply left-[3px] dark:bg-[#ffffff1c] md:left-[20px];
    }

    .article-body ul,
    .article-body figure {
      @apply my-4;
    }

    .article-body iframe {
      @apply relative m-0 aspect-video h-auto w-full rounded-md align-baseline;
    }

    .article-body figcaption {
      @apply text-center text-xs italic;
    }

    .article-body hr {
      @apply mx-4 mb-4 text-gray-400;
    }

    .article-body .IRPP_kangoo .ctaText {
      dark: color-[#ffffff9c];
    }

    .article-body .IRPP_kangoo:hover .ctaText,
    .article-body .IRPP_kangoo:hover .postTitle {
      @apply opacity-60 transition-opacity duration-200;
    }

    .article-body .wp-block-table .has-fixed-layout {
      @apply w-full;
      table-layout: fixed;
    }

    .article-body .wp-block-table th,
    .article-body .wp-block-table td {
      @apply p-3 border border-gray-300;
    }

    .article-body .wp-block-button {
      @apply inline-flex flex-shrink-0 relative items-center justify-center align-middle rounded-xl m-0 font-medium leading-tight transition-colors duration-75 ease-out outline-none appearance-none cursor-pointer focus:outline-none select-none whitespace-nowrap disabled:shadow-none disabled:cursor-not-allowed disabled:opacity-60 h-9 px-4 text-base min-w-[2.5rem] shadow-sm text-white bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800;
    }

    #ez-toc-container.ez-toc-transparent {
      background: none;
    }

    div#ez-toc-container {
      width: 100%;
    }

    div#ez-toc-container {
      padding-right: 20px;
    }

    #ez-toc-container {
      background: #f9f9f9;
      border: 1px solid #aaa;
      border-radius: 4px;
      -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
      display: table;
      margin-bottom: 1em;
      padding: 10px;
      position: relative;
      width: auto;
    }

    #ez-toc-container > [type="checkbox"],
    .cssicon,
    .cssiconcheckbox {
      @apply hidden;
    }
  `,
  presets: [
    presetAutoprefix(),
    presetTailwind(),
    presetTailwindForms(),
    presetLineClamp(),
  ],
})
