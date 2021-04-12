############################################################################
# IMPORTS
############################################################################

import numpy as np
import seaborn as sns
import pandas as pd
import altair as alt
from collections import OrderedDict
from vega_datasets import data

import matplotlib as mpl
mpl.rcParams['font.family'] = 'serif'
mpl.rcParams['font.serif'] = 'Times New Roman'

from matplotlib import pyplot as plt
import matplotlib.ticker as tck

############################################################################
# Plotting Utilities, Constants, Methods for W209 arXiv project
############################################################################

#---------------------------------------------------------------------------
## Plotting Palette
#
# Create a dict object containing U.C. Berkeley official school colors for plot palette 
# reference : https://brand.berkeley.edu/colors/
# secondary reference : https://alumni.berkeley.edu/brand/color-palette# CLass Initialization
#---------------------------------------------------------------------------

berkeley_palette = OrderedDict({
                    'berkeley_blue'     : '#003262',
                    'california_gold'   : '#fdb515',
                    'founders_rock'     : '#3b7ea1',
                    'medalist'          : '#c4820e',
                    'bay_fog'           : '#ddd5c7',
                    'lawrence'          : '#00b0da',
                    'sather_gate'       : '#b9d3b6',
                    'pacific'           : '#46535e',
                    'soybean'           : '#859438',
                    'south_hall'        : '#6c3302',
                    'wellman_tile'      : '#D9661F',
                    'rose_garden'       : '#ee1f60',
                    'golden_gate'       : '#ed4e33',
                    'lap_lane'          : '#00a598',
                    'ion'               : '#cfdd45',
                    'stone_pine'        : '#584f29',
                    'grey'              : '#eeeeee',
                    'web_grey'          : '#888888',
                    # alum only colors
                    'metallic_gold'     : '#BC9B6A',
                    'california_purple' : '#5C3160',
                    # standard web colors
                    'white'             : '#FFFFFF',
                    'black'             : '#000000'
                    })

#---------------------------------------------------------------------------
## Altair custom "Cal" theme
#---------------------------------------------------------------------------

def cal_theme():
    font = "Lato"

    return {
        "config": {
            "title": {
                "fontSize": 30,
                "font": font,
                "anchor": "middle",
                "align":"center",
                "color": berkeley_palette['berkeley_blue'],
                "subtitleFontSize": 20,
                "subtitleFont": font,
                "subtitleAcchor": "middle",
                "subtitleAlign": "center",
                "subtitleColor": berkeley_palette['berkeley_blue']
            },
            "axisX": {
                "labelFont": font,
                "labelColor": berkeley_palette['pacific'],
                "labelFontSize": 15,
                "titleFont": font,
                "titleFontSize": 20,
                "titleColor": berkeley_palette['berkeley_blue'],
                "titleAlign": "right",
                "titleAnchor": "end",
                "titlePadding": 20
            },
            "axisY": {
                "labelFont": font,
                "labelColor": berkeley_palette['pacific'],
                "labelFontSize": 15,
                "titleFont": font,
                "titleFontSize": 20,
                "titleColor": berkeley_palette['berkeley_blue'],
                "titleAlign": "right",
                "titleAnchor": "end",
                "titlePadding": 20
            },
            "headerRow": {
                "labelFont": font,
                "titleFont": font,
                "titleFontSize": 15,
                "titleColor": berkeley_palette['berkeley_blue'],
                "titleAlign": "right",
                "titleAnchor": "end"
            },
            "legend": {
                "labelFont": font,
                "labelFontSize": 15,
                "labelColor": berkeley_palette['stone_pine'],
                "symbolType": "stroke",
                "symbolStrokeWidth": 3,
                "symbolOpacity": 1.0,
                "symbolSize": 500,
                "titleFont": font,
                "titleFontSize": 20,
                "titleColor": berkeley_palette['berkeley_blue']
            },
            "view": {
                "labelFont": font,
                "labelColor": berkeley_palette['pacific'],
                "labelFontSize": 15,
                "titleFont": font,
                "titleFontSize": 20,
                "titleColor": berkeley_palette['berkeley_blue'],
                "titleAlign": "right",
                "titleAnchor": "end"
            },
            "facet": {
                "labelFont": font,
                "labelColor": berkeley_palette['pacific'],
                "labelFontSize": 15,
                "titleFont": font,
                "titleFontSize": 20,
                "titleColor": berkeley_palette['berkeley_blue'],
                "titleAlign": "right",
                "titleAnchor": "end"
            },
            "row": {
                "labelFont": font,
                "labelColor": berkeley_palette['pacific'],
                "labelFontSize": 15,
                "titleFont": font,
                "titleFontSize": 20,
                "titleColor": berkeley_palette['berkeley_blue'],
                "titleAlign": "right",
                "titleAnchor": "end"
            }

        }
    }

alt.themes.register("my_cal_theme", cal_theme)
alt.themes.enable("my_cal_theme")


###################################################################################
###################################################################################

## DIVERGENCE DATA PREP

###################################################################################
###################################################################################

def get_divergence_data(df):

    df2_effective = df.groupby(by=['Treatment','Prompt','Effective']).ROWID.count().reset_index().sort_values(by=['Prompt','Effective','Treatment'])
    df2_effective.columns = ['treatment', 'prompt','rank','total']
    df2_effective['question'] = 'effective'

    df2_intelligence = df.groupby(by=['Treatment','Prompt','Intelligence']).ROWID.count().reset_index().sort_values(by=['Prompt','Intelligence','Treatment'])
    df2_intelligence.columns = ['treatment', 'prompt','rank','total']
    df2_intelligence['question'] = 'intelligence'

    df2_writing = df.groupby(by=['Treatment','Prompt','Writing']).ROWID.count().reset_index().sort_values(by=['Prompt','Writing','Treatment'])
    df2_writing.columns = ['treatment', 'prompt','rank','total']
    df2_writing['question'] = 'writing'
    df2 = pd.concat([df2_effective, df2_intelligence, df2_writing], axis=0, ignore_index=True)

    gt = df2.groupby(by=['treatment','prompt','question']).agg({'total':'sum'}).reset_index()
    gt.columns = ['treatment','prompt','question','grand_total']
    df2 = df2.merge(gt, on=['treatment','prompt','question'], how='inner')
    df2['pct_of_total'] = (df2.total / df2.grand_total) * 100.
    df2['pct_start'] = np.nan
    df2['pct_end'] = np.nan

    # fill in any missing votes as 0 percent votes
    x = [(a, b, c, d) for a in df2.treatment.unique() for b in df2.prompt.unique() for c in df2['rank'].unique() for d in df2.question.unique()]
    x = pd.DataFrame(x, columns=['treatment','prompt','rank','question'])
    x = x.merge(df2[['treatment','prompt','rank','question','pct_of_total']], how='left', on=['treatment','prompt','rank','question'])
    x = x[(x.pct_of_total.isna()==True)]
    x.pct_of_total = np.float32(0.0)
    df2 = pd.concat([df2,x], axis=0, ignore_index=True)

    # set baseline in the middle
    df2.loc[(df2['rank'] == 4), 'pct_start'] = df2.loc[(df2['rank'] == 4), 'pct_of_total']/2 * -1
    df2['pct_end'] = df2['pct_start'] * -1

    # calculate ranks 1-3 and 5-7
    for r,t,p,q in [(a,b,c,d) for a in [3,2,1] for b in df2.treatment.unique() for c in df2.prompt.unique() for d in df2.question.unique()]:
        # get starting value for negative percentages, this becomes the "end" value for the next rank down
        pct_start = np.float32(df2[((df2['rank'] == (r+1)) & (df2.treatment == t) & (df2.prompt == p) & (df2.question == q))].pct_start)
        df2.loc[((df2['rank'] == r) & (df2.treatment == t) & (df2.prompt == p) & (df2.question == q)), 'pct_end'] = pct_start
        pct_new_start = np.float32(df2.loc[((df2['rank'] == r) & (df2.treatment == t) & (df2.prompt == p) & (df2.question == q)), 'pct_of_total'] * -1) + pct_start
        df2.loc[((df2['rank'] == r) & (df2.treatment == t) & (df2.prompt == p) & (df2.question == q)), 'pct_start'] = pct_new_start

    for r,t,p,q in [(a,b,c,d) for a in [5,6,7] for b in df2.treatment.unique() for c in df2.prompt.unique() for d in df2.question.unique()]:
        pct_start = np.float32(df2[((df2['rank'] == (r-1)) & (df2.treatment == t) & (df2.prompt == p) & (df2.question == q))].pct_end)
        df2.loc[((df2['rank'] == r) & (df2.treatment == t) & (df2.prompt == p) & (df2.question == q)), 'pct_start'] = pct_start
        pct_end = np.float32(df2.loc[((df2['rank'] == r) & (df2.treatment == t) & (df2.prompt == p) & (df2.question == q)), 'pct_of_total']) + pct_start
        df2.loc[((df2['rank'] == r) & (df2.treatment == t) & (df2.prompt == p) & (df2.question == q)), 'pct_end'] = pct_end
    
    return df2

###################################################################################
###################################################################################

## DIVERGENCE PLOTS (LIKERT)

###################################################################################
###################################################################################

def diverge_plot(data, question):

    color_scale = alt.Scale(
        domain=["1","2","3","4","5","6","7"],
        range=[berkeley_palette["rose_garden"],
            berkeley_palette["medalist"],
            berkeley_palette["california_gold"],
            berkeley_palette["bay_fog"],
            berkeley_palette["lawrence"],
            berkeley_palette["founders_rock"],
            berkeley_palette["berkeley_blue"]]
    )

    select = alt.selection_multi(fields=['rank'])

    p = alt.Chart()\
        .transform_filter(alt.datum.question == question)\
        .mark_bar().encode(
        x=alt.X('pct_start:Q'),
        x2=alt.X2('pct_end:Q'),
        y=alt.Y('prompt:N', axis=alt.Axis(title=None, ticks=False, domain=False, offset=5, minExtent=60)),
            color=alt.Color(
                'rank:O',
                legend=None,
            scale=color_scale),
        tooltip=[alt.Tooltip('treatment:N', title='Assignment'),
            alt.Tooltip('question:N', title='Question'),
            alt.Tooltip('rank:O', title='Rank (1-7)'),
            alt.Tooltip('pct_of_total:Q', title='% of Total', format='.2f')],
        opacity=alt.condition(select, alt.OpacityValue(1.0), alt.OpacityValue(0.5))
        ).properties(height=150,width=650,title={'text':''}).add_selection(select)

    l = alt.Chart(pd.DataFrame({'X':[0]})).mark_rule(size=3, color=berkeley_palette["pacific"], strokeDash=[10,5])\
        .encode(x=alt.X('X', type='quantitative', title=None))
    
    return alt.layer(p, l)

def macro_diverge_plot(data, question, title):

    c = diverge_plot(data, question)\
        .facet(
            row=alt.Row('treatment:N', 
                sort=alt.SortArray(['Control','Typographical','Phonological']),
                header=alt.Header(
                    labelColor=berkeley_palette['pacific'],
                    labelFontSize=20,
                    labelFont='Lato',
                    title=""
                )
            ),
            title=title, 
            data=data)\
        .configure(padding={'top':20, 'left':20, 'right':20,'bottom':20})\
        .configure_facet(spacing=10)\
        .configure_view(stroke=None)\
        .configure_title(anchor='middle')\
        .configure_axis(grid=False)\
        .configure_title(dy=-20)

    return c

###################################################################################
###################################################################################

## PARTICIPANT COUNT PLOTS (send in only with [treatment, total] columns)

###################################################################################
###################################################################################

def participant_count_plot(data):

    b = alt.Chart().mark_bar(line={'color':berkeley_palette['web_grey']}).encode(
        x = alt.X('treatment:O', sort=['Control', 'Typographical', 'Phonological'],
            axis = alt.Axis(title = 'Assignment Group', labelAngle=0, labelPadding=10, labelFontSize=20, titleFontSize=25)),
        y = alt.Y('total:Q', axis = alt.Axis(title = "Participants Assigned", labelPadding=10, labelFontSize=20, titleFontSize=25),
            scale=alt.Scale(domain=[0,14])),
        color = alt.Color('treatment:O', legend = None,
            scale=alt.Scale(range = [berkeley_palette['pacific'], berkeley_palette['berkeley_blue'], berkeley_palette['founders_rock']]))
    )

    t = alt.Chart().mark_text(
        color = berkeley_palette['white'],
        size = 20,
        align='center',
        baseline='middle',
        dy = 20).encode(
            x = alt.X('treatment:O', axis=None, sort=['Control', 'Typographical','Phonological']),
            y = alt.Y('total:Q'),
            text = alt.Text('total:Q')
        )

    p = alt.layer(b, t, data = data)\
        .properties(height=300,width=650,title={'text':'Pilot Participation'})\
        .configure(padding={'top':20, 'left':20, 'right':20,'bottom':20})\
        .configure_facet(spacing=10)\
        .configure_view(stroke=None)\
        .configure_title(anchor='middle')\
        .configure_axis(grid=False)\
        .configure_title(dy=-20)
    
    return p

def participant_count_plot_live(data):

    df2 = data[['Start Date','Treatment','ROWID']].copy()
    df2['Start Date'] = df2['Start Date'].dt.normalize()
    df2 = df2.drop_duplicates().groupby(by=['Start Date','Treatment']).agg({'ROWID':'count'}).reset_index()
    df2.columns = ['date','branch','total']
    df2['display_date'] = df2.date.dt.strftime('%b %d')
    df2['source'] = 'Amazon'
    df2.loc[(df2.date > '2021-04-05'), 'source'] = 'XLab'
    df2 = df2.groupby(by=['branch','source']).agg({'total':'sum'}).reset_index().rename(columns={'branch':'treatment'})

    base = alt.Chart().mark_bar().encode(
        x=alt.X('total:Q', axis=alt.Axis(title = 'Participants Assigned', labelPadding=10, labelFontSize=20, titleFontSize=25)),
        y = alt.X('treatment:O', axis=alt.Axis(title = '', labelAngle=0, labelPadding=10, labelFontSize=20, titleFontSize=25), sort=['Control', 'Typographical','Phonological']),
        color = alt.Color('treatment:O', legend = None,
            scale=alt.Scale(range = [berkeley_palette['pacific'], berkeley_palette['berkeley_blue'], berkeley_palette['founders_rock']]))
    ).properties(width=650, height=150)

    txt = base.mark_text(dx=-15, size=15).encode(
        text='total:Q',
        color=alt.value('white')
    )

    p = alt.layer(base, txt).properties(width=600, height=150, title={'text':''})\
        .facet(
            row=alt.Row('source:N', 
                sort=alt.SortArray(['XLab','Amazon']),
                header=alt.Header(labelColor=berkeley_palette['pacific'], labelFontSize=25,labelFont='Lato',title='')
                ), 
            data=df2,
            title='Live Study Participation'
        ).configure(padding={'top':20, 'left':20, 'right':20,'bottom':20})\
            .configure_facet(spacing=10)\
            .configure_view(stroke=None)\
            .configure_title(anchor='middle')\
            .configure_axis(grid=False)\
            .configure_title(dy=-20)
    
    return p

###################################################################################
###################################################################################

## MISSING DEMOGRAPHICS DATA (HTML w/ PANDAS STYLER)

###################################################################################
###################################################################################

def color_all_missing(val):
    color = 'white' if val == 0 else 'black'
    return 'color: %s' % color

def highlight_missing(s):
    is_max = s == 0
    return ['background-color: black' if v else '' for v in is_max]

def highlight_missing_max(s):
    is_max = s == s.max()
    return ['background-color: black' if v else '' for v in is_max]

def color_all_missing_max(val):
    color = 'white' if val == df.shape[0] else 'black'
    return 'color: %s' % color

def get_missing_demographics(df):

    cm = sns.light_palette("#0067B0", as_cmap=True)

    cols = [c for c in df.columns if c in ['Year','Gender','English','Race',
        'Country','State','Student','Degree']]

    rend = pd.DataFrame({'% Missing Values' : round(df[cols].isnull().mean() * 100, 2),
                'Missing Values (Count)' : df[cols].isnull().sum(),
                'Non-Null Values' : df[cols].notnull().sum(),
                'Density' : 1 / df[cols].nunique()})\
        .style.bar(color = "#22a7f0", align = 'left', subset=['% Missing Values'])\
        .background_gradient(cmap=cm, subset=['Density'])\
        .apply(highlight_missing, subset=['Non-Null Values'])\
        .apply(highlight_missing_max, subset=['Missing Values (Count)'])\
        .set_caption('Distribution of Missing Demographic Values')\
        .set_precision(2)
    
    return rend

###################################################################################
###################################################################################

## DEMOGRAPHICS : YEAR DISTRIBUTION (GOOD DATA ONLY)

###################################################################################
###################################################################################

def get_good_demographic_year(df):

    df2 = df.copy()
    df2.Year = df2.Year.fillna('<MISSING>')
    df2 = pd.DataFrame(df2.groupby(by=['ROWID','Year']).size()\
        .reset_index()[['ROWID','Year']].Year.value_counts(dropna=False))\
        .reset_index().rename(columns={'index':'year', 'Year':'count'}).sort_values(by='year')

    strange_values = ['19996','25','26','54','<MISSING>','Los Angeles','Mumbai, India','US','2020']
    good = df2[(~df2.year.isin(strange_values))].copy()
    good['year'] = good['year'].astype(int)

    p = alt.Chart(good).mark_bar(size=15, color=berkeley_palette['pacific'], line={'color':berkeley_palette['web_grey']})\
        .encode(
            x = alt.X('year:Q', bin=False, 
                axis=alt.Axis(format='.0f', labelAngle=-45), 
                scale=alt.Scale(domain=[min(good.year), max(good.year)]),
                title='Year of Birth'
            ),
            y = alt.Y('count:Q', 
                axis=alt.Axis(title='Frequency')
            )
        ).properties(height=300, width=650, title={'text':'Distribution of Birth Year', 'subtitle':'Valid Data Only'})\
        .configure(padding={'top':20, 'left':20, 'right':20,'bottom':20})\
        .configure_facet(spacing=10)\
        .configure_view(stroke=None)\
        .configure_title(anchor='middle')\
        .configure_axis(grid=False)\
        .configure_title(dy=-10)
    
    return p

###################################################################################
###################################################################################

## DEMOGRAPHICS : GENDER DISTRIBUTION PLOT

###################################################################################
###################################################################################

def get_demographic_gender(df):

    df2 = df.copy()
    df2.Gender = df2.Gender.fillna('<MISSING>')
    df2 = pd.DataFrame(df2.groupby(by=['ROWID','Gender']).size()\
        .reset_index()[['ROWID','Gender']].Gender.value_counts(dropna=False))\
        .reset_index().rename(columns={'index':'gender', 'Gender':'count'}).sort_values(by='gender')

    b = alt.Chart()\
        .mark_bar(
            color=berkeley_palette['rose_garden'], opacity=0.85,
            stroke=berkeley_palette['berkeley_blue'],
            strokeWidth=1
        ).encode(
            x=alt.X('gender:N', 
                axis=alt.Axis(labelAngle=-45, labelFontSize=20, title='Participant Gender', titleFontSize=25)),
            y=alt.Y('count:Q',
                axis = alt.Axis(title='Frequency', titleFontSize=25))
        )

    t = alt.Chart().mark_text(
        color = berkeley_palette['pacific'],
        size = 20,
        align='center',
        baseline='middle',
        dy = -20
        ).encode(
            x = alt.X('gender:N', axis=None),
            y = alt.Y('count:Q', axis=None),
            text = alt.Text('count:Q')
        )

    p = alt.layer(b, t, data=df2)\
        .properties(height=300,width=700,title={'text':'Distribution of Gender'})\
        .configure(padding={'top':20, 'left':20, 'right':20,'bottom':20})\
        .configure_facet(spacing=10)\
        .configure_view(stroke=None)\
        .configure_title(anchor='middle')\
        .configure_axis(grid=False)\
        .configure_title(dy=-20)
    
    return p

###################################################################################
###################################################################################

## DEMOGRAPHICS : COUNTRY DISTRIBUTION

###################################################################################
###################################################################################

def get_demographic_country(df):

    df2 = df.copy()
    df2.Country = df2.Country.fillna('<MISSING>')
    df2 = pd.DataFrame(df2.groupby(by=['ROWID','Country']).size()\
        .reset_index()[['ROWID','Country']].Country.value_counts(dropna=False))\
        .reset_index().rename(columns={'index':'country', 'Country':'count'}).sort_values(by='country')

    ctry = pd.DataFrame({
        'country':['<MISSING>', 'Afghanistan', 'Canada', 'China', 'France',
        'Hong Kong (S.A.R.)', 'India', 'Italy', 'Mexico', 'New Zealand',
        'Portugal', 'Singapore', 'United Kingdom of Great Britain and Northern Ireland',
        'United States of America'],
        'id':[0, 4, 124, 156, 250, 344, 356, 380, 484, 554, 620, 702, 826, 840]})

    df2 = df2.merge(ctry, how='inner', on='country')

    source = alt.topo_feature(data.world_110m.url, "countries")
    background = alt.Chart(source).mark_geoshape(fill="white")

    foreground = (
        alt.Chart(source)
        .mark_geoshape(stroke=berkeley_palette['bay_fog'], strokeWidth=0.25)
        .encode(
            color=alt.Color(
                "count:N", scale=alt.Scale(range=[berkeley_palette['pacific'], berkeley_palette['lawrence'], 
                berkeley_palette['lap_lane'], berkeley_palette['founders_rock'], 
                berkeley_palette['founders_rock'], berkeley_palette['berkeley_blue']]), legend=None,
            ),
            tooltip=[
                alt.Tooltip("country:N", title="Country"),
                alt.Tooltip("count:Q", title="Participants"),
            ],
        )
        .transform_lookup(
            lookup="id",
            from_=alt.LookupData(df2, "id", ["count", "country"]),
        )
    )

    final_map = alt.layer(background, foreground)\
        .properties(width=700, height=400, title={'text':'Distribution of Country'})\
        .configure_title(anchor='middle')\
        .configure_title(dy=-10)\
        .project("naturalEarth1")\
        .configure(padding={'top':20, 'left':20, 'right':20,'bottom':20})\
        .configure_view(stroke=None, strokeWidth=0)\
        .configure_axis(grid=False)

    return final_map

###################################################################################
###################################################################################

## DEMOGRAPHICS : STATE DISTRIBUTION

###################################################################################
###################################################################################

def get_demographic_state(df):

    df2 = df.copy()
    df2.State = df2.State.fillna('<MISSING>')
    df2 = pd.DataFrame(df2.groupby(by=['ROWID','State']).size()\
        .reset_index()[['ROWID','State']].State.value_counts(dropna=False))\
        .reset_index().rename(columns={'index':'state', 'State':'count'}).sort_values(by='state')

    codes = pd.DataFrame({'state':['Alabama','Alaska','Arizona','Arkansas','California',
        'Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia',
        'Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana',
        'Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri',
        'Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York',
        'North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
        'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia',
        'Washington','West Virginia','Wisconsin','Wyoming','Puerto Rico'],
        'id':[1,2,4,5,6,8,9,10,11,12,13,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,
        32,33,34,35,36,37,38,39,40,41,42,44,45,46,47,48,49,50,51,53,54,55,56,72]})

    df2 = df2.merge(codes, how='left', on='state').fillna(-99)
    df2.id = df2.id.astype(int)

    states = alt.topo_feature(data.us_10m.url, 'states')
    b = alt.Chart(states).mark_geoshape(stroke=berkeley_palette['white'], strokeWidth=0.25).encode(
            color=alt.Color(
                "count:N", scale=alt.Scale(range=[berkeley_palette['pacific'], "#00b0da", 
                "#009dcb", "#008aba", "#0077aa", "#006598", "#005386", "#004274", "#003262"]), legend=None),
            tooltip=[
                alt.Tooltip("state:N", title="U.S. State"),
                alt.Tooltip("count:Q", title="Participants")]
        ).transform_lookup(
            lookup='id',
            from_=alt.LookupData(df2, 'id', ["count","state"]))\
        .project(type='albersUsa')\
        .properties(width=700, height=400, title={'text':'Distribution of U.S. State'})\
        .configure_title(anchor='middle')\
        .configure_title(dy=-10)\
        .configure(padding={'top':20, 'left':20, 'right':20,'bottom':20})\
        .configure_view(stroke=None, strokeWidth=0)\
        .configure_axis(grid=False)
    
    return b

###################################################################################
###################################################################################

## DEMOGRAPHICS : STUDENT STATUS DISTRIBUTION

###################################################################################
###################################################################################

def get_demographic_student_status(df):

    df2 = df.copy()
    df2.Student = df2.Student.fillna('<MISSING>')

    df2 = pd.DataFrame(df2.groupby(by=['ROWID','Student']).size()\
        .reset_index()[['ROWID','Student']].Student.value_counts(dropna=False))\
        .reset_index().rename(columns={'index':'student', 'Student':'count'}).sort_values(by='student')
    df2 = df2.sort_values(by = ['count','student'], ascending=False)

    y = df2['count'].values
    x = df2.student.values
    x_label = 'Student Status'
    y_label = 'Frequency'
    y_label2 = '% of Total'
    title = 'Distribution of Student Status'
    show_pct_y = True
    tot = df2['count'].sum()
    pct_format='{0:.0%}'

    def my_format(num, x):
        return (str(num*100)[:4 + (x-1)] + '%').replace('.','')

    # build the pareto chart
    fig = plt.figure(figsize=(10, 7), dpi = 100)
    ax1 = fig.add_subplot(111)
    ax2 = ax1.twinx()

    bars = ax1.bar(x = x, height = y, width = 0.9, align = 'center', edgecolor = berkeley_palette['berkeley_blue'], 
        color = '#0078D4', linewidth = 1, alpha = 0.8)
    ax1.set_xticks(range(df2.shape[0]))
    ax1.set_xticklabels(x, rotation = 45, fontsize=12)
    for xtick in ax1.get_xticklabels():
        xtick.set_color(berkeley_palette['black'])
    ax1.get_yaxis().set_major_formatter(
        tck.FuncFormatter(lambda x, p: format(int(x), ',')))
    ax1.tick_params(axis = 'y', labelsize = 10)
    ax1.tick_params(axis = 'y', labelcolor = berkeley_palette['pacific'])

    if x_label:
        ax1.set_xlabel(x_label, fontsize = 20, horizontalalignment = 'right', x = 1.0, 
            color = berkeley_palette['pacific'], labelpad=10)
    if y_label:
        ax1.set_ylabel(y_label, fontsize = 20, horizontalalignment = 'right', y = 1.0, 
            color = berkeley_palette['pacific'], labelpad=20)
    if title:
        plt.title(title, fontsize = 25, fontweight = 'semibold', color = berkeley_palette['berkeley_blue'], pad = 30, loc='center')

    weights = y / tot
    cumsum = weights.cumsum()
    cumsum = [0.999999999 if x >= 1.0 else x for x in cumsum]
    cumsum[len(cumsum)-1] = 1.0

    ax2.plot(x, cumsum, color =berkeley_palette['black'], label = 'Cumulative Distribution', alpha = 1)
    ax2.scatter(x, cumsum, color = berkeley_palette['rose_garden'], marker = 'D', s = 15)
    ax2.set_ylabel('', color = berkeley_palette['berkeley_blue'])
    ax2.tick_params('y', colors = berkeley_palette['web_grey'])
    ax2.set_ylim(0, 1.01)

    vals = ax2.get_yticks()
    ax2.set_yticks(vals.tolist())
    ax2.set_yticklabels([pct_format.format(x) for x in vals], fontsize = 10)

    # hide y-labels on right side
    if not show_pct_y:
        ax2.set_yticks([])
    else:
        if y_label2:
            ax2.set_ylabel(y_label2, fontsize = 20, horizontalalignment = 'right', y = 1.0, 
                color = berkeley_palette['pacific'], labelpad = 20)
            ax2.set_yticklabels([])
            ax2.set_yticks([])
            
    #formatted_weights = [pct_format.format(x) for x in cumsum]
    formatted_weights = [my_format(x, 0) for x in cumsum]
    for i, txt in enumerate(formatted_weights):
        ax2.annotate(text = txt, xy = (x[i], cumsum[i] + .05), fontweight = 'bold', color = berkeley_palette['black'], fontsize=15)

    if '<MISSING>' in df2.student.values:
        yy = df2[(df2.student.values=='<MISSING>')].values[0][1]
        b = bars.get_children()[len(bars.get_children())-1]
        xx = (b.get_x() + b.get_width() / 2) - 0.05
        ax1.annotate(text = str(yy), xy = (xx, yy+5), fontweight = 'bold', color = berkeley_palette['rose_garden'], fontsize=15)

    # Adjust the plot spine borders to be lighter
    for ax in [ax1, ax2]:
        for p, v in zip(["top", "bottom", "right", "left"], [0.0, 0.3, 0.0, 0.3]):
            ax.spines[p].set_alpha(v)

    # Sset the Y-axis grid-lines to dim, and display the Accuracy plot.
    plt.grid(axis='y', alpha=.3)
    plt.tight_layout()
    #plt.show()
    return plt

###################################################################################
###################################################################################

## DESCRIPTIVE STATISTICS STYLER (PANDAS)

###################################################################################
###################################################################################

def get_descriptive_statistics(df, cols = None):

    if not cols:
        cols = df.columns

    rend = df[cols].describe()\
        .T.style.background_gradient(cmap=sns.light_palette("#0067B0", as_cmap=True))\
        .set_precision(2)
    return rend

###################################################################################
###################################################################################

## LIKERT SCALE ANSWER VARIANCE PLOT

###################################################################################
###################################################################################

def get_likert_variance(df):

    df2 = df.copy()
    df2['likert_var'] = np.var(df2[['Interest','Effective','Intelligence','Writing','Meet']], axis=1)
    df2['group'] = 'XLab'
    df2.loc[(df2['Start Date'] < "2021-04-05"), 'group'] = 'Amazon'

    at = alt.Chart(df2).transform_density('likert_var', as_=['likert_var','Density'], groupby=['group'])\
        .mark_area(opacity=0.5, stroke=berkeley_palette['black'], strokeWidth=2)\
        .encode(
            x = alt.X('likert_var:Q', 
                axis=alt.Axis(values=list(np.arange(0.0, 9.5, 0.5)), tickCount=19), title="Variance"),
            y = alt.Y('Density:Q'),
            color = alt.Color('group:N', 
                scale=alt.Scale(domain=df2.group.unique(),
                    range=[berkeley_palette['berkeley_blue'], berkeley_palette['california_gold']]),
                legend = alt.Legend(title="Participant Group", padding=10, 
                    symbolType="square", symbolStrokeWidth=1, orient="right", offset=-170)))\
        .properties(height=250, width=650, title={'text':'Distribution of Variance', 'subtitle':'for Likert Scale Answers'})\
            .configure(padding={'top':20, 'left':20, 'right':20,'bottom':20})\
            .configure_facet(spacing=10)\
            .configure_view(stroke=None)\
            .configure_title(anchor='middle')\
            .configure_axis(grid=False)\
            .configure_title(dy=-5)
    
    return at

###################################################################################
###################################################################################

## LIKERT SCALE ANSWER VARIANCE PLOT

###################################################################################
###################################################################################

def get_likert_counts_by_group(df):

    df2 = df.copy()
    df2['likert_var'] = np.var(df2[['Interest','Effective','Intelligence','Writing','Meet']], axis=1)
    df2['group'] = 'XLab'
    df2.loc[(df2['Start Date'] < "2021-04-05"), 'group'] = 'Amazon'

    tot = df2.groupby(by=['group','ROWID']).size().reset_index().rename(columns={'ROWID':'participant_id',0:'total_responses'})
    lik = df2[(df2.likert_var == 0.0)].groupby(by=['group','ROWID']).size().reset_index().rename(columns={'ROWID':'participant_id',0:'uniform_responses'})

    tot = tot.merge(lik, how='inner', on=['group','participant_id'])
    tot['pct_uniform'] = tot.uniform_responses / tot.total_responses

    tot.groupby(by=['group','uniform_responses']).size().reset_index().rename(columns={0:'count'})

    base = alt.Chart().mark_bar(stroke=berkeley_palette['pacific'], strokeWidth=0.5).encode(
        x=alt.X('count:Q', axis=alt.Axis(title = 'Frequency', labelPadding=10, labelFontSize=20, titleFontSize=25)),
        y = alt.Y('uniform_responses:O', axis=alt.Axis(title = '', labelAngle=0, labelPadding=10, labelFontSize=20, 
            titleFontSize=25, values=[1,2,3,4,5,6], tickCount=6), sort=[1,2,3,4,5,6]),
        color = alt.Color('uniform_responses:O', legend = None,
            scale=alt.Scale(range = [berkeley_palette['bay_fog'], "#00b0da", "#004274", berkeley_palette['golden_gate'], berkeley_palette['rose_garden']]))
    ).properties(width=650, height=150)

    txt = base.mark_text(dx=-15, size=15).encode(
        text='count:Q',
        color=alt.value('white')
    )

    p = alt.layer(base, txt).properties(width=600, height=150, title={'text':''})\
        .facet(
            row=alt.Row('group:N', 
                sort=alt.SortArray(['XLab','Amazon']),
                header=alt.Header(labelColor=berkeley_palette['pacific'], labelFontSize=25,labelFont='Lato', title='')
                ), 
            data=tot.groupby(by=['group','uniform_responses']).size().reset_index().rename(columns={0:'count'}),
            title='Uniform Likert Respones'
        ).configure(padding={'top':20, 'left':20, 'right':20,'bottom':20})\
            .configure_facet(spacing=10)\
            .configure_view(stroke=None)\
            .configure_title(anchor='middle')\
            .configure_axis(grid=False)\
            .configure_title(dy=-20)
    
    return p

###################################################################################
###################################################################################

## LIKERT SCALE ANSWER VARIANCE PLOT

###################################################################################
###################################################################################

def get_wpm_plot(df):

    df2 = df.copy()
    df2['likert_var'] = np.var(df2[['Interest','Effective','Intelligence','Writing','Meet']], axis=1)
    df2['group'] = 'XLab'
    df2.loc[(df2['Start Date'] < "2021-04-05"), 'group'] = 'Amazon'

    p = alt.Chart(df2).mark_bar(opacity=0.8, stroke=berkeley_palette['black'], strokeWidth=0.5).encode(
        x = alt.X('wpm:Q', bin=alt.Bin(maxbins=100), title="Words per Minute (bin=100)"),
        y = alt.Y('count()', title='Frequency'),
        color=alt.Color('group:N', 
            scale=alt.Scale(range = [berkeley_palette['berkeley_blue'], berkeley_palette['california_gold']]),
            legend = alt.Legend(title="Participant Group", padding=10, 
                symbolType="square", symbolStrokeWidth=1, orient="right", offset=-170))
        ).properties(height=300,width=650, title={'text':'Distribution of Response Time', 'subtitle':'Evaluated in Words per Minute'})\
                .configure(padding={'top':20, 'left':20, 'right':20,'bottom':20})\
                .configure_facet(spacing=10)\
                .configure_view(stroke=None)\
                .configure_title(anchor='middle')\
                .configure_axis(grid=False)\
                .configure_title(dy=-5)
    
    return p