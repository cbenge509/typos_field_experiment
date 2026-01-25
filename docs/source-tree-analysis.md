# Source Tree Analysis

## Project Structure

```
typos_field_experiment/
│
├── R-analysis/                    # Core Statistical Analysis
│   ├── final_project.Rmd          # Main analysis (580 lines) - treatment effects, robustness checks
│   ├── pilot_study.Rmd            # Pilot study analysis (219 lines) - power analysis
│   ├── results_04092021_2.csv     # Main experiment data (2.4MB, n=1,587)
│   ├── final_data_cleaned.csv     # Cleaned dataset (500KB)
│   └── results_pilot.csv          # Pilot study data (16KB)
│
├── visualizations/                # Python Visualization Layer
│   ├── plot_utils.py              # UC Berkeley color palette + Altair theme (852 lines)
│   ├── w241_final._eda.ipynb      # EDA notebook generating HTML charts
│   ├── data/                      # Cleaned data for visualization
│   │   ├── pilot_data_cleaned.csv
│   │   └── results_cleaned_04092021.csv
│   └── *.html                     # Generated interactive Altair charts (17 files)
│       ├── demographic_*.html     # Demographics visualizations
│       ├── divergence_*.html      # Likert scale divergence plots
│       ├── participant_count_*.html
│       ├── likert_*.html
│       └── wpm_by_group.html
│
├── pelican-site/                  # Static Site Generator
│   ├── pelicanconf.py             # Pelican configuration
│   ├── publishconf.py             # Production config
│   ├── content/                   # Markdown content
│   │   ├── final_project.md       # Main article (2.5MB with embedded charts)
│   │   ├── img/                   # Content images
│   │   └── static/                # Static assets
│   └── output/                    # Generated site (development)
│
├── static-site/                   # Production Deployment
│   ├── .azure/
│   │   └── config                 # Azure App Service configuration
│   ├── index.html                 # Site entry point
│   ├── my-super-post.html         # Main article (2.5MB)
│   ├── theme/                     # Compiled theme assets
│   │   ├── css/
│   │   ├── js/
│   │   └── fonts/
│   └── img/                       # Production images
│
├── clean-blog/                    # Pelican Theme
│   ├── templates/                 # Jinja2 templates
│   │   ├── base.html
│   │   ├── article.html
│   │   └── ...
│   └── static/                    # Theme static assets
│       ├── css/
│       └── js/
│
├── images/                        # Project Images
│   ├── andrew.png                 # Author photo
│   ├── cbenge.png                 # Author photo
│   ├── stone.png                  # Author photo
│   └── ucb.png                    # UC Berkeley branding
│
├── docs/                          # Generated Documentation (this folder)
│
├── requirements.txt               # Python dependencies (104 packages)
├── Pipfile                        # Pipenv configuration
├── Pipfile.lock                   # Locked dependencies
├── README.md                      # Project README
├── CLAUDE.md                      # Claude Code instructions
├── LICENSE                        # MIT License
└── .gitignore                     # Git ignore rules
```

---

## Critical Directories

### R-analysis/ — Statistical Analysis Core

**Purpose:** Contains all R code for causal inference and statistical modeling.

**Key Files:**
| File | Lines | Purpose |
|------|-------|---------|
| `final_project.Rmd` | 580 | Main analysis: data cleaning, treatment effects, robustness checks, heterogeneous effects |
| `pilot_study.Rmd` | 219 | Pilot study: power analysis, initial regression, covariate balance |

**R Libraries Used:**
- `tidyverse`, `dplyr`, `tidyr` — Data manipulation
- `data.table` — Fast data operations
- `sandwich`, `lmtest` — Robust standard errors
- `cobalt` — Covariate balance checking
- `stargazer` — Regression tables
- `MASS` — Ordinal regression (proportional odds)
- `ggplot2` — Static visualizations

**Statistical Methods:**
- Linear regression with HC1 robust standard errors
- Proportional odds logistic regression (POLR)
- Two-stage least squares (2SLS) for CACE estimation
- Covariate balance checking with F-tests

---

### visualizations/ — Python Visualization Layer

**Purpose:** Generates interactive Altair charts and styled HTML tables for the website.

**Key Files:**
| File | Lines | Purpose |
|------|-------|---------|
| `plot_utils.py` | 852 | Berkeley color palette, custom Altair theme, 15+ visualization functions |
| `w241_final._eda.ipynb` | 24 cells | Orchestrates chart generation, saves HTML outputs |

**Visualization Functions:**
| Function | Output | Description |
|----------|--------|-------------|
| `diverge_plot()` | Altair chart | Likert scale divergence visualization |
| `participant_count_plot()` | Altair chart | Participation by treatment group |
| `get_demographic_*()` | Altair/HTML | Demographics analysis (gender, country, state, student status) |
| `get_likert_variance()` | Altair chart | Response variance distribution |
| `get_wpm_plot()` | Altair chart | Words per minute distribution |
| `get_descriptive_statistics()` | Pandas Styler | Styled statistics table |

**Color Palette:**
```python
berkeley_palette = {
    'berkeley_blue': '#003262',      # Primary
    'california_gold': '#fdb515',    # Accent
    'founders_rock': '#3b7ea1',      # Secondary
    'medalist': '#c4820e',
    'bay_fog': '#ddd5c7',
    # ... 20+ colors total
}
```

---

### pelican-site/ — Static Site Generator

**Purpose:** Converts markdown content + HTML charts into a static website.

**Configuration:**
| Setting | Value |
|---------|-------|
| Theme | clean-blog |
| Timezone | EST |
| Pagination | 5 posts |
| Static Paths | static, img |

**Content Structure:**
- `content/final_project.md` — Main article with embedded visualizations
- `content/img/` — Article images
- `content/static/` — Static assets

---

### static-site/ — Production Deployment

**Purpose:** Final compiled site deployed to Azure App Service.

**Azure Configuration:**
| Setting | Value |
|---------|-------|
| Resource Group | rg-w241 |
| SKU | F1 (Free tier) |
| App Service Plan | asp-windows-eastus-free |
| Location | eastus |
| Web App Name | w241-final-project |

**Live URL:** https://w241-final-project.azurewebsites.net/

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATA COLLECTION                                  │
│  Qualtrics Survey → results_04092021_2.csv (2.4MB, n=1,587)            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         R ANALYSIS                                       │
│  final_project.Rmd                                                       │
│  ├── Data cleaning (data.table)                                         │
│  ├── Treatment effect estimation (lm + sandwich)                        │
│  ├── Robustness checks (demographics, pretreatment)                     │
│  ├── Heterogeneous effects (gender, social media usage)                 │
│  └── CACE estimation (2SLS)                                             │
│  Output: Statistical results, PDF report                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         PYTHON VISUALIZATION                             │
│  plot_utils.py + w241_final._eda.ipynb                                  │
│  ├── Load cleaned data                                                   │
│  ├── Apply Berkeley color theme                                          │
│  ├── Generate Altair interactive charts                                  │
│  └── Save as HTML files                                                  │
│  Output: 17 HTML chart files                                            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         PELICAN SITE GENERATION                          │
│  pelican-site/                                                           │
│  ├── Markdown content + embedded HTML charts                             │
│  ├── clean-blog theme                                                    │
│  └── pelicanconf.py configuration                                        │
│  Output: Static HTML site in output/                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         AZURE DEPLOYMENT                                 │
│  static-site/                                                            │
│  ├── Copy generated site                                                 │
│  └── Deploy to Azure App Service (F1 free tier)                         │
│  Output: https://w241-final-project.azurewebsites.net/                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## File Statistics

| Category | Count | Total Size |
|----------|-------|------------|
| R Files (.Rmd) | 2 | ~32KB |
| Python Files (.py) | 3 | ~40KB |
| Jupyter Notebooks (.ipynb) | 1 | 137KB |
| CSV Data Files | 5 | ~3MB |
| HTML Charts | 17 | ~2.6MB |
| Markdown Content | 1 | 2.5MB |
| Static Site HTML | 8 | ~2.6MB |
| Images | 4 | 414KB |
