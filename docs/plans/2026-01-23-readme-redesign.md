# README Redesign Plan

**Date:** 2026-01-23
**Status:** Approved

## Design Goals

- **Primary audience:** Academic peers/researchers AND recruiters/hiring managers
- **Visual style:** Academic paper structure with modern GitHub formatting
- **Results presentation:** Prominent Key Findings callout near top
- **Author section:** Minimal - names and links only, no photos
- **Badges:** Custom research-themed (Causal Inference, sample size, significance level)

## Structure

| Section | Purpose |
|---------|---------|
| **Header** | Centered title, custom research badges (RCT, n=1,587, p<0.001), quick nav links |
| **Key Findings** | Blockquote headline + results table + plain-English takeaway |
| **Abstract** | ~150 words: stakes, methodology, findings, keywords |
| **Methods** | Mermaid flowchart + treatment conditions + statistical approach |
| **Repository Structure** | Directory tree + tech stack table |
| **Reproduction** | Prerequisites, copy-paste commands, expected outputs |
| **Citation & Authors** | BibTeX block, one-line author credits, minimal footer |

## Design Principles

1. Academic paper structure (Abstract → Methods → Results)
2. Recruiters see clear outcomes in 10 seconds
3. Custom Berkeley-colored badges (#003262, #fdb515, #3b7ea1)
4. Scannable: tables, diagrams, blockquotes break up text
5. Minimal author section - content speaks for itself
6. Mermaid diagrams (no ASCII art)

## Key Content

### Badges
- Causal Inference/RCT (Berkeley blue)
- Sample size n=1,587 (California gold)
- Significance p<0.001 (Founders rock)
- R 4.0.4, Python 3.8, License

### Key Findings
- Phonological errors: -1.57 points (p < 0.001)
- Typographical errors: -0.73 points (p < 0.001)
- Phonological errors twice as damaging as typos

### Statistical Approach
Linear regression with robust standard errors (HC1), controlling for post characteristics and demographics.
