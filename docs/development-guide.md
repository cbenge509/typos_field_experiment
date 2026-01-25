# Development Guide

## Typos Field Experiment

---

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| **R** | 4.0.4+ | Statistical analysis |
| **RStudio** | Latest | R IDE (recommended) |
| **Python** | 3.8.x | Visualization |
| **Conda/Miniconda** | Latest | Python environment management |
| **Git** | Latest | Version control |

### Optional Software

| Software | Purpose |
|----------|---------|
| **Azure CLI** | Deployment to Azure |
| **VS Code** | Code editing |
| **Jupyter** | Notebook execution |

---

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/cbenge509/typos_field_experiment.git
cd typos_field_experiment
```

### 2. Python Environment

**Option A: Using Conda (Recommended)**
```bash
# Create environment
conda create -n typos python=3.8.8
conda activate typos

# Install dependencies
pip install -r requirements.txt
```

**Option B: Using Pipenv**
```bash
pip install pipenv
pipenv install
pipenv shell
```

### 3. R Environment

**Install R Packages:**
Open R or RStudio and run:

```r
install.packages(c(
  "tidyverse",
  "dplyr",
  "tidyr",
  "data.table",
  "sandwich",
  "lmtest",
  "cobalt",
  "stargazer",
  "MASS",
  "ggplot2",
  "stringr",
  "knitr",
  "rmarkdown"
))
```

### 4. Verify Installation

**Python:**
```bash
python --version  # Should be 3.8.x
python -c "import altair; print(altair.__version__)"  # Should be 4.1.0
```

**R:**
```r
R --version  # Should be 4.0.4+
library(tidyverse)
library(sandwich)
```

---

## Project Structure Quick Reference

```
typos_field_experiment/
├── R-analysis/           # Statistical analysis
├── visualizations/       # Python visualization
├── pelican-site/         # Site generator
├── static-site/          # Production deployment
├── clean-blog/           # Pelican theme
├── images/               # Project images
├── docs/                 # Documentation
├── requirements.txt      # Python dependencies
└── Pipfile               # Pipenv configuration
```

---

## Running the Analysis

### R Statistical Analysis

**Method 1: RStudio (Recommended)**
1. Open RStudio
2. File → Open File → `R-analysis/final_project.Rmd`
3. Click "Knit" button (or Ctrl+Shift+K)
4. Output: `final_project.pdf`

**Method 2: Command Line**
```bash
cd R-analysis
Rscript -e "rmarkdown::render('final_project.Rmd')"
```

**Pilot Study:**
```bash
cd R-analysis
Rscript -e "rmarkdown::render('pilot_study.Rmd')"
```

### Python Visualization

**Method 1: Jupyter Notebook**
```bash
cd visualizations
jupyter notebook w241_final._eda.ipynb
# Run all cells (Cell → Run All)
```

**Method 2: Convert to Script**
```bash
cd visualizations
jupyter nbconvert --to script w241_final._eda.ipynb
python w241_final._eda.py
```

**Generated Files:**
After running, you'll have 17 HTML chart files in `visualizations/`:
- `demographic_*.html` (6 files)
- `divergence_*.html` (3 files)
- `participant_count_*.html` (2 files)
- `likert_*.html` (3 files)
- `descriptive_statistics_*.html` (2 files)
- `wpm_by_group.html`

---

## Building the Website

### Local Development

**Generate Site:**
```bash
cd pelican-site
pelican content -o output
```

**Preview Locally:**
```bash
cd pelican-site
pelican --listen
# Open http://localhost:8000 in browser
```

**Auto-Regenerate on Changes:**
```bash
cd pelican-site
pelican --autoreload --listen
```

### Production Build

```bash
cd pelican-site
pelican content -o ../static-site -s publishconf.py
```

---

## Deployment

### Azure App Service Deployment

**Prerequisites:**
- Azure CLI installed and logged in
- Subscription with App Service access

**Deploy:**
```bash
cd static-site
az webapp up --name w241-final-project --resource-group rg-w241 --sku F1
```

**Configuration:**
The `.azure/config` file contains default settings:
```ini
[defaults]
group = rg-w241
sku = F1
appserviceplan = asp-windows-eastus-free
location = eastus
web = w241-final-project
```

---

## Common Tasks

### Update Analysis with New Data

1. Place new CSV in `R-analysis/`
2. Update file path in `final_project.Rmd`:
   ```r
   d <- fread("new_results.csv")
   ```
3. Knit the RMarkdown file
4. Regenerate visualizations if needed

### Add New Visualization

1. Edit `visualizations/plot_utils.py`:
   ```python
   def my_new_plot(df):
       # Create chart using Altair
       chart = alt.Chart(df).mark_bar()...
       return chart
   ```

2. Call from notebook:
   ```python
   from plot_utils import my_new_plot
   p = my_new_plot(df)
   p.save('my_new_chart.html')
   ```

3. Embed in site content:
   ```markdown
   <!-- In pelican-site/content/final_project.md -->
   {% include 'my_new_chart.html' %}
   ```

### Modify Site Theme

1. Edit templates in `clean-blog/templates/`
2. Edit styles in `clean-blog/static/css/`
3. Regenerate site: `pelican content -o output`

### Update Dependencies

**Python:**
```bash
pip freeze > requirements.txt
```

**R:**
Document in `CLAUDE.md` or create `renv.lock`:
```r
# Install renv
install.packages("renv")
renv::init()
renv::snapshot()
```

---

## Testing

### Validate R Analysis

```r
# Run all code chunks without knitting
source("final_project.Rmd")

# Check model outputs
summary(model_ucb_treatment)
```

### Validate Visualizations

```python
# Check chart renders without error
from plot_utils import *
df = pd.read_csv('data/results_cleaned_04092021.csv')
p = get_demographic_gender(df)
p  # Display in notebook
```

### Validate Site Build

```bash
cd pelican-site
pelican content -o output
# Check for warnings/errors in output
# Verify all pages render correctly
```

---

## Troubleshooting

### Common Issues

**R Package Installation Fails:**
```r
# Try installing from source
install.packages("package_name", type = "source")
```

**Python Import Errors:**
```bash
# Verify correct environment is active
conda activate typos
which python  # Should point to conda env
```

**Pelican Theme Not Found:**
```bash
# Ensure theme path is correct in pelicanconf.py
THEME = 'clean-blog'  # Relative to pelican-site/
```

**Azure Deployment Fails:**
```bash
# Check Azure CLI login
az login
az account show

# Check resource group exists
az group show --name rg-w241
```

### Getting Help

- **R Issues:** Stack Overflow, R documentation
- **Python/Altair:** Altair documentation, GitHub issues
- **Pelican:** Pelican documentation
- **Azure:** Azure documentation, az CLI help

---

## Code Style Guidelines

### R Code

- Use tidyverse style guide
- Prefer `data.table` for large data operations
- Always use robust standard errors for regression
- Comment statistical assumptions

### Python Code

- Follow PEP 8
- Use type hints where helpful
- Document functions with docstrings
- Use the Berkeley color palette for all visualizations

### Markdown

- Use ATX-style headers (`#`, `##`, etc.)
- Include alt text for images
- Use fenced code blocks with language specifiers

---

## Useful Commands Reference

```bash
# Python environment
conda activate typos
conda deactivate

# R analysis
Rscript -e "rmarkdown::render('final_project.Rmd')"

# Jupyter
jupyter notebook
jupyter nbconvert --to script notebook.ipynb

# Pelican
pelican content -o output
pelican --listen
pelican --autoreload --listen

# Azure
az login
az webapp up
az webapp browse --name w241-final-project

# Git
git status
git add .
git commit -m "message"
git push origin main
```
