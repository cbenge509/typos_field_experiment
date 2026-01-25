# Architecture Document

## Typos Field Experiment — Academic Research Project

---

## 1. Executive Summary

This is a **Data Science Pipeline** architecture for an academic research project investigating the effect of grammatical errors on perceived intelligence. The system processes survey data through statistical analysis in R, generates visualizations in Python, and publishes results via a static website hosted on Azure.

**Architecture Type:** Data Science Pipeline with Static Site Output
**Complexity Level:** Low-Medium (single-purpose research project)
**Deployment Model:** Static site on Azure App Service (serverless)

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ Qualtrics       │  │ CSV Data Files  │  │ Cleaned Data    │             │
│  │ Survey Export   │──│ (Raw)           │──│ (Processed)     │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ANALYSIS LAYER                                     │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐  │
│  │ R Statistical Analysis          │  │ Python Visualization            │  │
│  │ ├── Data cleaning               │  │ ├── Altair charts               │  │
│  │ ├── Treatment effects           │  │ ├── Matplotlib plots            │  │
│  │ ├── Robustness checks           │  │ ├── Pandas stylers              │  │
│  │ └── Regression tables           │  │ └── HTML output                 │  │
│  └─────────────────────────────────┘  └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                                  │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐  │
│  │ Pelican Static Site Generator   │  │ clean-blog Theme                │  │
│  │ ├── Markdown → HTML             │  │ ├── Jinja2 templates            │  │
│  │ ├── Embed visualizations        │  │ ├── CSS styles                  │  │
│  │ └── Generate navigation         │  │ └── JavaScript                  │  │
│  └─────────────────────────────────┘  └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DEPLOYMENT LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Azure App Service (F1 Free Tier)                                     │   │
│  │ URL: https://w241-final-project.azurewebsites.net/                  │   │
│  │ Region: eastus                                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Responsibilities

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| Data Collection | Qualtrics | Survey administration, data export |
| Data Processing | R (data.table) | Cleaning, transformation, feature engineering |
| Statistical Analysis | R (sandwich, lmtest) | Treatment effects, robustness checks |
| Visualization | Python (Altair) | Interactive charts, styled tables |
| Site Generation | Pelican | Markdown to HTML conversion |
| Theming | clean-blog | Visual presentation |
| Hosting | Azure App Service | Static file serving |

---

## 3. Technology Stack

### 3.1 Analysis Technologies

| Technology | Version | Purpose | Key Packages |
|------------|---------|---------|--------------|
| **R** | 4.0.4 | Statistical analysis | tidyverse, data.table, sandwich, lmtest, cobalt, stargazer, MASS |
| **Python** | 3.8.8 | Visualization | altair 4.1.0, matplotlib 3.4.1, seaborn 0.11.1, pandas 1.2.3 |

### 3.2 Web Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Pelican** | 4.6.0 | Static site generator |
| **Jinja2** | 2.11.3 | Template engine |
| **Markdown** | 3.3.4 | Content format |

### 3.3 Infrastructure

| Technology | Configuration | Purpose |
|------------|---------------|---------|
| **Azure App Service** | F1 (Free) | Static hosting |
| **Azure Region** | eastus | Geographic location |
| **Resource Group** | rg-w241 | Resource organization |

---

## 4. Data Architecture

### 4.1 Data Files

| File | Size | Records | Description |
|------|------|---------|-------------|
| `results_04092021_2.csv` | 2.4MB | ~1,587 | Raw Qualtrics export |
| `final_data_cleaned.csv` | 500KB | ~9,500 | Cleaned, long-format data (6 posts × ~1,587 participants) |
| `results_pilot.csv` | 16KB | ~40 | Pilot study data |

### 4.2 Data Schema

**Core Variables:**
| Variable | Type | Description |
|----------|------|-------------|
| `ROWID` | Integer | Participant identifier |
| `Treatment` | Categorical | Control / Typographical / Phonological |
| `Prompt` | Categorical | Diet / Sports / Accident / Music / Science / Mind |
| `Intelligence` | Integer (1-7) | **Primary outcome** - Likert scale |
| `Writing` | Integer (1-7) | Secondary outcome |
| `Effective` | Integer (1-7) | Secondary outcome |
| `Interest` | Integer (1-7) | Covariate |
| `Meet` | Integer (1-7) | Covariate |

**Demographic Variables:**
| Variable | Type | Description |
|----------|------|-------------|
| `Year` | Integer | Birth year |
| `Gender` | Categorical | Cisgender Man/Woman, Non-binary, etc. |
| `English` | Boolean | English as first language |
| `Race` | Categorical | Race/ethnicity |
| `Country` | Categorical | Country of residence |
| `State` | Categorical | US state (if applicable) |
| `Degree` | Categorical | Education level |
| `ReadSocialMedia` | Categorical | Frequency of reading social media |
| `WriteSocialMedia` | Categorical | Frequency of posting |

### 4.3 Data Flow

```
Qualtrics Survey
       │
       ▼ (CSV export)
results_04092021_2.csv (raw)
       │
       ▼ (R: data.table processing)
final_data_cleaned.csv (cleaned, long format)
       │
       ├──────────────────────┐
       ▼                      ▼
R Analysis               Python Visualization
(treatment effects)      (Altair charts)
       │                      │
       ▼                      ▼
PDF Report              HTML Charts (17 files)
                              │
                              ▼
                    Pelican Site Generation
                              │
                              ▼
                    Azure App Service
```

---

## 5. Statistical Methodology

### 5.1 Experimental Design

- **Design:** Randomized Controlled Trial (RCT)
- **Sample Size:** n = 1,587 participants
- **Treatment Arms:**
  - Control (no errors)
  - Typographical errors (e.g., "teh" → "the")
  - Phonological errors (e.g., "their" → "there")
- **Randomization:** Qualtrics built-in randomizer
- **Data Source:** UC Berkeley XLab

### 5.2 Statistical Models

**Baseline Model:**
```r
lm(Intelligence ~ Treatment)
```

**Full Model with Controls:**
```r
lm(Intelligence ~ Treatment + length + Gender + English + Race +
   isUS + Degree + age_bins + ReadSocialMedia + WriteSocialMedia +
   Intelligence.pretreat + Writing.pretreat + Interest.pretreat +
   Effective.pretreat)
```

**Robust Standard Errors:**
```r
coeftest(model, vcov. = vcovHC(model, type = "HC1"))
```

**Ordinal Regression:**
```r
polr(intelligence.factor ~ Treatment + controls, method = "logistic")
```

### 5.3 Key Results

| Treatment | Effect | SE | p-value |
|-----------|--------|-----|---------|
| Phonological | -1.57 | 0.07 | < 0.001 |
| Typographical | -0.73 | 0.07 | < 0.001 |

---

## 6. Visualization Architecture

### 6.1 Altair Theme System

The project uses a custom "Cal" theme for consistent UC Berkeley branding:

```python
alt.themes.register("my_cal_theme", cal_theme)
alt.themes.enable("my_cal_theme")
```

**Theme Configuration:**
- Font: Lato
- Primary Color: #003262 (Berkeley Blue)
- Accent Color: #fdb515 (California Gold)
- Secondary Color: #3b7ea1 (Founders Rock)

### 6.2 Generated Visualizations

| Category | Files | Chart Type |
|----------|-------|------------|
| Demographics | 6 | Bar charts, choropleth maps, Pareto |
| Likert Analysis | 3 | Divergence plots |
| Participation | 2 | Stacked bar charts |
| Response Quality | 3 | Density plots, histograms |
| Descriptive Stats | 2 | Styled HTML tables |

---

## 7. Deployment Architecture

### 7.1 Azure Configuration

```
Resource Group: rg-w241
├── App Service Plan: asp-windows-eastus-free (F1)
└── Web App: w241-final-project
    ├── Runtime: Static HTML
    ├── Region: East US
    └── URL: https://w241-final-project.azurewebsites.net/
```

### 7.2 Deployment Process

1. Generate site with Pelican: `pelican content -o output`
2. Copy output to `static-site/`
3. Deploy via Azure CLI: `az webapp up`

---

## 8. Development Workflow

### 8.1 Analysis Workflow

```
1. Data arrives (Qualtrics CSV)
       ↓
2. Run R analysis (RStudio)
   - Open final_project.Rmd
   - Knit to PDF
       ↓
3. Run Python visualizations (Jupyter)
   - Open w241_final._eda.ipynb
   - Run all cells
   - Charts saved to visualizations/*.html
       ↓
4. Update site content
   - Edit pelican-site/content/final_project.md
   - Embed new charts
       ↓
5. Generate site
   - cd pelican-site
   - pelican content -o output
       ↓
6. Deploy
   - Copy output to static-site/
   - az webapp up
```

### 8.2 Local Development

**R Analysis:**
```bash
cd R-analysis
# Open final_project.Rmd in RStudio
# Ctrl+Shift+K to knit
```

**Python Visualization:**
```bash
cd visualizations
jupyter notebook w241_final._eda.ipynb
# Run all cells
```

**Site Preview:**
```bash
cd pelican-site
pelican content -o output
pelican --listen
# Visit http://localhost:8000
```

---

## 9. Security Considerations

- **Data Privacy:** Raw survey data contains no PII (anonymous Qualtrics responses)
- **Deployment:** Static site with no server-side processing
- **Access Control:** Public read-only website
- **No Secrets:** No API keys or credentials in repository

---

## 10. Future Considerations

### 10.1 Potential Enhancements

- **Automated Pipeline:** GitHub Actions for CI/CD
- **Interactive Analysis:** Shiny app for exploratory analysis
- **Data Updates:** Support for additional survey waves
- **Responsive Design:** Mobile-optimized visualizations

### 10.2 Maintenance Notes

- Python dependencies pinned to 2021 versions
- R packages may need updates for newer R versions
- Azure F1 tier has 60 min/day compute limit (adequate for static site)
