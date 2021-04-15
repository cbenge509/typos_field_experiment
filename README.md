*Do Grammatical Errors in Social Media Posts Affect the Perception of the Authors' Intelligence?*
==========================================================

![GitHub](https://img.shields.io/github/license/cbenge509/typos_field_experiment) ![GitHub](https://img.shields.io/badge/R-v4.0.4-red) ![GitaHub](https://img.shields.io/badge/ggplot2-v3.3.3-yellowgreen) ![GitHub Pipenv locked Python version](https://img.shields.io/github/pipenv/locked/python-version/cbenge509/typos_field_experiment) ![GitHub Pipenv locked dependency version](https://img.shields.io/github/pipenv/locked/dependency-version/cbenge509/typos_field_experiment/altair) ![GitHub Pipenv locked dependency version](https://img.shields.io/github/pipenv/locked/dependency-version/cbenge509/typos_field_experiment/matplotlib) ![GitHub Pipenv locked dependency version](https://img.shields.io/github/pipenv/locked/dependency-version/cbenge509/typos_field_experiment/seaborn) ![GitHub Pipenv locked dependency version](https://img.shields.io/github/pipenv/locked/dependency-version/cbenge509/typos_field_experiment/pelican)

<img align="right" width="180" src="./images/ucb.png"/> 

#### Authors : [Cristopher Benge](https://cbenge509.github.io/) | [Siduo (Stone) Jiang](https://www.linkedin.com/in/siduojiang/) | [Andrew Fogarty](http://seekinginference.com/)


[![](./images/cbenge.png)](https://cbenge509.github.io/)&nbsp;&nbsp;[![](./images/stone.png)](https://www.linkedin.com/in/siduojiang/)&nbsp;&nbsp;[![](./images/andrew.png)](http://seekinginference.com/)

U.C. Berkeley, Masters in Information & Data Science program - [datascience@berkeley](https://datascience.berkeley.edu/) <br>
Spring 2021, W241 - Experiments and Causal Inference - [D. Alex Hughes, PhD](https://www.ischool.berkeley.edu/people/d-alex-hughes)<br><br>
<i>Final Research Project</i>

---

## Visit the Live Project Website!

 > [W241 Final Project : Do Grammatical Errors in Social Media Posts Affect the Perception of the Authors' Intelligence?](https://w241-final-project.azurewebsites.net/)

---

## Enviornment Setup

To setup your local enviornment for running the Python portion of this project, you will need to install a distribution of [Anaconda](https://www.anaconda.com/products/individual) (preferably version `4.10` or later) and run the following:

```bash
conda create -n your_env_name python=3.8.8
conda activate your_env_name
pip install -r requirements.txt
```

All modeling and analysis was performed in R version `4.0.4`; see [CRAN](https://cran.r-project.org/) for download and installation instructions.

# Study Overview

Command of language is one of the most significant cognitive abilities we possess and is often the most pervasive signal we encounter in a social media setting. When we notice overt and unintentional grammatical errors in social media posts, do we make unconscious assumptions about the authors’ general intelligence? Do we attribute difficulty with written language with other indicators such as lower-performing verbal acuity or overall intelligence? Further, are some categories of grammatical errors more injurious than others – or do we take in stride all these trespasses?

General intelligence, sometimes referred to as cognitive ability, includes our capacity to ”reason, plan, solve problems, think abstractly, comprehend complex ideas, learn quickly, and learn from experience” ([Plomin, 1999](https://www.nature.com/articles/35011520)). Assessment of our cognitive abilities often informs critical judgments in others that affect our educational, occupational, and relationship opportunities ([B. M. Newman & P. R. Newman, 2020](https://www.sciencedirect.com/book/9780128154502/theories-of-adolescent-development?via=ihub=)). Though social media channels are often used to identify potentially qualified job candidates, their use in screening candidates for suitability and background investigation is also on the rise ([Driver, 2020](https://www.businessnewsdaily.com/2377-social-media-hiring.html)). In the CareerBuilder survey that noted an increase in social media screening, 57% of employers reported rejecting candidates based on negative findings in applicant social media posts. Of those rejected, 27% of employers specified ”poor communication skills” as the primary factor for the rejection.

There is evidence that we ought to take this question seriously. In ([Borkenau & Liebler, 1993](https://onlinelibrary.wiley.com/doi/pdf/10.1111/j.1467-6494.1993.tb00779.x)), college students rated their perceived intelligence of strangers after watching them read aloud a pre-written weather report. The study found a significant correlation between perceived and measured IQ scores of the strangers, suggesting that some information about individual intelligence is provided through verbal communication. ([Kreiner et al., 2002](https://www.tandfonline.com/doi/abs/10.1080/00221300209602029)) showed that, while experiments with only a small percentage of typographical errors didn’t result in significant perceived intelligence ratings, the presence of a larger number of typographical errors or phonological errors did significantly influence the perception of cognitive writing abilities. The participants in these studies were comprised entirely of college students, but it may be the case that other populations would arrive at a different outcome. In ([Silverman, 1990](https://www.sciencedirect.com/science/article/abs/pii/0094730X9090046U)) college professors gave equally high perceived intelligence ratings to hypothetical students with and without verbal language difficulties, such as stuttering. More work is necessary to fully understand these questions, particularly in the context of contemporary social media communication channels where abbreviation, punctuation-skipping, and slang are frequently employed to accommodate restrictive post-length limitations on popular platforms.

