# Project Overview

## Do Grammatical Errors in Social Media Posts Affect the Perception of the Authors' Intelligence?

**A Randomized Controlled Trial**

---

## Executive Summary

This academic research project from UC Berkeley's MIDS program (W241 - Experiments and Causal Inference, Spring 2021) investigates whether grammatical errors in social media posts affect perception of authors' intelligence. The study uses randomized controlled trials with three treatment groups: control, typographical errors, and phonological errors.

**Key Findings:**
- Both typographical and phonological errors significantly reduced perceived intelligence ratings (p < 0.001)
- Phonological errors (e.g., *their→there*): **-1.57 points** effect
- Typographical errors (e.g., *teh→the*): **-0.73 points** effect
- Phonological errors are twice as damaging to perceived intelligence as simple typos

---

## Project Classification

| Property | Value |
|----------|-------|
| **Repository Type** | Monolith |
| **Project Type** | Data Science / Academic Research |
| **Primary Language** | R (analysis), Python (visualization) |
| **Sample Size** | n=1,587 participants |
| **Data Source** | UC Berkeley XLab |

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Statistical Analysis** | R | 4.0.4 | Causal inference, regression modeling |
| **R Packages** | tidyverse, data.table | - | Data manipulation |
| **R Packages** | sandwich, lmtest | - | Robust standard errors, coefficient testing |
| **R Packages** | cobalt | - | Covariate balance checking |
| **R Packages** | stargazer, MASS | - | Regression tables, ordinal regression |
| **Visualization** | Python | 3.8.8 | Chart generation |
| **Python Packages** | Altair | 4.1.0 | Interactive visualizations |
| **Python Packages** | matplotlib, seaborn | 3.4.1, 0.11.1 | Static plots |
| **Python Packages** | pandas, numpy | 1.2.3, 1.20.2 | Data processing |
| **Static Site** | Pelican | 4.6.0 | Site generation |
| **Theme** | clean-blog | - | Pelican theme |
| **Deployment** | Azure App Service | F1 (free) | Production hosting |
| **Region** | Azure eastus | - | Deployment location |

---

## Architecture Pattern

This project follows a **Data Science Pipeline** architecture:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Raw Data       │───►│  R Analysis      │───►│  Statistical    │
│  (Qualtrics)    │    │  (RMarkdown)     │    │  Results        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Production     │◄───│  Pelican Site    │◄───│  Python Viz     │
│  (Azure)        │    │  Generator       │    │  (Altair/HTML)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

**Data Flow:**
1. **Data Collection** → Qualtrics survey exports to CSV
2. **Data Cleaning** → R scripts process raw data
3. **Statistical Analysis** → R computes treatment effects with robust standard errors
4. **Visualization** → Python generates interactive Altair charts
5. **Site Generation** → Pelican compiles markdown + charts to HTML
6. **Deployment** → Azure App Service hosts the static site

---

## Authors

- **Cristopher Benge** — [GitHub](https://cbenge509.github.io/)
- **Siduo (Stone) Jiang** — [LinkedIn](https://www.linkedin.com/in/siduojiang/)
- **Andrew Fogarty** — [Website](http://seekinginference.com/)

**Institution:** UC Berkeley, Master of Information and Data Science
**Course:** W241 Experiments and Causal Inference
**Term:** Spring 2021
**Instructor:** D. Alex Hughes, PhD

---

## Live Site

**URL:** https://w241-final-project.azurewebsites.net/

---

## License

MIT License
