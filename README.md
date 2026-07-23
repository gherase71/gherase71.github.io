# Personal Website Template

This repository contains the source code of a personal academic website template.

The website is built with **Hugo** and can be hosted on any static hosting provider (GitLab Pages, GitHub Pages). Hugo installation is not required on your own computer and all could be modified on the GitLab web site.

## Table of contents

- [Set and and deploy on GitHub](#set-and-and-deploy-on-github)
- [How to update content](#how-to-update-content)
  - [How to add or modify content items](#how-to-add-or-modify-content-items)
  - [How to modify pages](#how-to-modify-pages)
- [How to write in Markdown](#how-to-write-in-markdown)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [How to customize the website](#how-to-customize-the-website)
  - [Colors, fonts and the logo](#colors-fonts-and-the-logo)
  - [Fetching your publications from HAL](#fetching-your-publications-from-hal)

---

## Set and and deploy on GitHub

Go on [GitHub](https://github.com/) create a new public repository. The name this repository need to be this one
`your-gitlab-account-name.github.io`.
This repository add all files of this web site on it.
Open the hugo.toml file and modify the baseURL as indicated.
To pubish your website on Internet go the repository settings then in the Pages section.
Change the source from `Deploy from a branch` to `GitHub Action`.

## How to update content

### How to add or modify content items

To add a new item, use the corresponding Hugo archetype (or copy an existing item), place it in the directory listed below, name it according to the naming convention, and fill in the required fields by following the instructions in the file.

```bash
hugo new publications/title.md
hugo new supervisions/name-surname.md
hugo new news/YYYY-MM-DD-title.md
```

To modify an existing item, locate its file in the corresponding directory and follow the instructions provided in the file.

| Content type | Archetype                    | Directory               | File name             |
|--------------|------------------------------|-------------------------|-----------------------|
| Publication  | `archetypes/publications.md` | `content/publications/` | `title.md`            |
| Supervision  | `archetypes/supervisions.md` | `content/supervisions/` | `name-surname.md`     |
| News         | `archetypes/news.md`         | `content/news/`         | `YYYY-MM-DD-title.md` |

### How to modify pages

To modify one of the pages below, open the corresponding file and locate the comments marking the beginning and end of the editable section. Write your Markdown content between those two comments.

| Page                                 | File                                  |
|--------------------------------------|---------------------------------------|
| Home                                 | `content/_index.md`                   |
| Research topics                      | `content/research/research-topics.md` |
| Teaching                             | `content/teaching.md`                 |
| Links                                | `content/links.md`                    |
| Footer links                         | `layouts/partials/footer.html`        |
| Name on the top bar (title section)  | `hugo.toml`                           |


---

## How to write in Markdown

Markdown is a lightweight markup language used for the site content. Here are the essential rules:

- **Headings**: Use `#` for H1, `##` for H2, `###` for H3.
  - *Example:* `### My Subtitle`
- **Emphasis**: Use `**bold**` for strong text and `*italics*` for emphasis.
- **Lists**:
  - Unordered: Use `-` or `*` at the beginning of the line.
  - Ordered: Use `1.`, `2.`, etc.
- **Links**: `[Link text](https://url-here.com)`
- **Images**: `![Alt text](/assets/images/folder/image.png)`
- **Blockquotes**: Use `>` at the beginning of a paragraph.
- **Code**: Use backticks (`` ` ``) for inline code or triple backticks (`` ``` ``) for code blocks.

To add accordion:
```html
<details>
    <summary>Title</summary>
    <div class="details-body">
        Content
    </div>
</details>
```

For more details, see the [Markdown Guide](https://www.markdownguide.org/basic-syntax/).

---

## Quick Start

```bash
hugo server -D
```

The website will be available at: http://localhost:1313

---

## Architecture

```text
.
├── content/
│   ├── _index.md                Home page
│   ├── links.md                 Links page (profiles, resources, contact)
│   ├── teaching.md              Teaching page (plain prose)
│   ├── publications/            Collection: publications
│   ├── supervisions/            Collection: supervised students/researchers
│   ├── news/                    Collection: news
│   └── research/
│       ├── publications.md          Publications page (layout: publications-list)
│       ├── research-topics.md       Research topics page
│       └── supervisions.md          Supervisions page (layout: supervisions-list)
│
├── layouts/
│   ├── news/                    List of news and single news
│   ├── partials/                Components such as cards, navbar, and footer
│   ├── research/                List layouts for publications and supervisions
│   ├── index.html               Home page layout
│   ├── 404.html                 Error 404 page
│   └── _default/
│       ├── baseof.html             Base HTML shared across all pages
│       ├── single.html             Generic single page: prose page
│       └── list.html               Generic list page: not used but here by convention
│
├── archetypes/                  Templates for creating new collection items
│
├── static/
│   └── assets/
│       ├── css/                    Stylesheets
│       ├── js/                     JavaScript files
│       ├── images/                 Your own images go here (empty by default)
│       └── videos/                 Videos (e.g. an optional home page presentation video)
│
├── hugo.toml                    Hugo configuration file
├── .github/workflows
│   └── /hugo.yml                   GitHub Pages configuration file
└── .gitignore                   Excludes build artifacts (public/, resources/, .hugo_build.lock)
```

---

## How to customize the website

### Colors, fonts and the logo

All colors are defined once in `static/assets/css/variables.css` (`--pw-primary`, `--pw-accent`,
`--pw-bg`, `--pw-border`, `--pw-muted`) and reused everywhere else — change them there rather than
in individual page stylesheets. The font is also defined in this file.

### Fetching your publications from HAL

The "All publications" tab on the Publications page fetches your publications live from the
HAL API. Open `static/assets/js/publications.js` and replace the placeholder name in the
`halUrl` query with your own name, or — for a more reliable match — your HAL author identifier.
This is optional: if you don't use HAL, you can remove the "All publications" tab and rely only
on the manually curated `content/publications/` collection.
