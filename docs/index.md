# Project Documentation Index

## Typos Field Experiment

**Do Grammatical Errors in Social Media Posts Affect the Perception of Authors' Intelligence?**

---

## Project Overview

| Property | Value |
|----------|-------|
| **Type** | Monolith — Data Science / Academic Research |
| **Primary Language** | R (analysis), Python (visualization) |
| **Architecture** | Data Science Pipeline with Static Site Output |
| **Sample Size** | n=1,587 participants |
| **Live Site** | [w241-final-project.azurewebsites.net](https://w241-final-project.azurewebsites.net/) |

---

## Quick Reference

| Component | Technology | Entry Point |
|-----------|------------|-------------|
| **Statistical Analysis** | R 4.0.4 | `R-analysis/final_project.Rmd` |
| **Visualization** | Python 3.8 / Altair | `visualizations/plot_utils.py` |
| **Site Generator** | Pelican 4.6.0 | `pelican-site/pelicanconf.py` |
| **Deployment** | Azure App Service | `static-site/.azure/config` |

**Tech Stack:** R · tidyverse · data.table · sandwich · lmtest · Python · Altair · matplotlib · Pelican · Azure

---

## Generated Documentation

### Core Documents

- [Project Overview](./project-overview.md) — Executive summary, technology stack, architecture pattern
- [Architecture](./architecture.md) — System design, data flow, statistical methodology
- [Source Tree Analysis](./source-tree-analysis.md) — Directory structure, critical folders, file statistics
- [Development Guide](./development-guide.md) — Setup instructions, common tasks, troubleshooting

---

## Existing Documentation

| Document | Location | Description |
|----------|----------|-------------|
| [README](../README.md) | Root | Project overview, key findings, reproduction instructions |
| [CLAUDE.md](../CLAUDE.md) | Root | Claude Code guidance for this repository |
| [LICENSE](../LICENSE) | Root | MIT License |
| [Main Article](../pelican-site/content/final_project.md) | pelican-site/content | Full research article with embedded visualizations |
| [Theme README](../clean-blog/README.md) | clean-blog | Pelican theme documentation |

---

## Key Results Summary

> **Both typographical and phonological errors significantly reduced perceived intelligence ratings (p < 0.001).**

| Treatment | Effect on Intelligence Rating | Significance |
|-----------|-------------------------------|--------------|
| Phonological errors (e.g., *their→there*) | **-1.57** points | p < 0.001 |
| Typographical errors (e.g., *teh→the*) | **-0.73** points | p < 0.001 |

**Bottom line:** Phonological errors are twice as damaging to perceived intelligence as simple typos.

---

## Getting Started

### For Analysis

```bash
# Clone repository
git clone https://github.com/cbenge509/typos_field_experiment.git
cd typos_field_experiment

# Run R analysis
cd R-analysis
Rscript -e "rmarkdown::render('final_project.Rmd')"
```

### For Visualization

```bash
# Set up Python environment
conda create -n typos python=3.8.8
conda activate typos
pip install -r requirements.txt

# Run visualization notebook
cd visualizations
jupyter notebook w241_final._eda.ipynb
```

### For Website

```bash
# Generate site
cd pelican-site
pelican content -o output
pelican --listen
# Visit http://localhost:8000
```

---

## AI-Assisted Development Guidance

When working with this codebase:

1. **Statistical Analysis Changes**
   - Edit `R-analysis/final_project.Rmd`
   - Follow robust standard error conventions (sandwich + HC1)
   - Maintain covariate balance checks

2. **Visualization Changes**
   - Use `visualizations/plot_utils.py` as the source of truth for styling
   - Apply Berkeley color palette consistently
   - Save charts as HTML for web embedding

3. **Content Updates**
   - Edit `pelican-site/content/final_project.md`
   - Regenerate site after changes
   - Test locally before deploying

4. **Deployment**
   - Copy generated site to `static-site/`
   - Deploy via `az webapp up`

---

## Project Authors

- **Cristopher Benge** — [GitHub](https://cbenge509.github.io/)
- **Siduo (Stone) Jiang** — [LinkedIn](https://www.linkedin.com/in/siduojiang/)
- **Andrew Fogarty** — [Website](http://seekinginference.com/)

**UC Berkeley MIDS** — W241 Experiments and Causal Inference — Spring 2021

---

## Documentation Metadata

| Property | Value |
|----------|-------|
| Generated | 2026-01-23 |
| Workflow | document-project (BMM v1.2.0) |
| Scan Level | Exhaustive |
| Files Analyzed | All source files |
