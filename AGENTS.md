# AGENTS.md

See CLAUDE.md for general project architecture and commands. This file records
standing rules that must be followed when working in this repository.

## CV maintenance (two synchronized versions)

The CV exists in two forms that MUST be kept in sync on every update:

1. **HTML version** (public, on the website at `/cv`)
   - Content: `content/cv.toml` (English) and `content_zh/cv.toml` (Chinese) —
     structured data rendered by `src/components/pages/CvPage.tsx`.
   - Publications on the CV page are generated automatically from
     `content/publications.bib` (journal + conference entries only); updating the
     bib updates the HTML CV.

2. **LaTeX version** (private source + public PDF)
   - Source lives in `cv-latex/` (`cv.tex`, `publication.bib`, `mycv.cls`, ...).
   - **`cv-latex/` is gitignored. NEVER commit, push, or publish the LaTeX
     source.** It stays local-only. Do not copy it into `public/`, `out/`, or any
     tracked directory.
   - The only public artifact is the compiled PDF:
     `public/CV_GuanxiongShen.pdf` — keep exactly this one CV PDF file
     (no duplicates elsewhere in the repo).

### Update workflow

When the user asks to update the CV (or any CV content such as career,
education, teaching, funding, supervision, services):

1. Update **both** `content/cv.toml` and `content_zh/cv.toml`.
2. Update `cv-latex/cv.tex` accordingly.
3. For publications: update **both** `content/publications.bib` (website +
   HTML CV) and `cv-latex/publication.bib` (LaTeX CV).
4. Recompile the PDF and refresh the public copy:

   ```bash
   cd cv-latex && latexmk -pdf cv.tex && cp cv.pdf ../public/CV_GuanxiongShen.pdf
   ```

   (TeX Live is installed at `/Library/TeX/texbin`; `latexmk` runs pdflatex +
   biber. Clean aux files afterwards with `latexmk -c` if desired.)

5. Run `npm run lint && npm run build` before committing website changes.

Under-review papers stay commented out in `cv-latex/publication.bib` until
accepted; never list them on the public CV (especially double-blind
submissions).
