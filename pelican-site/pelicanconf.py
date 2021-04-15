#!/usr/bin/env python
# -*- coding: utf-8 -*- #

AUTHOR = 'Cris Benge, Stone Jiang, Andrew Fogarty'
SITENAME = 'W241 Final Project'
SITEURL = ''

PATH = 'content'

TIMEZONE = 'EST'

DEFAULT_LANG = 'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (('Pelican', 'https://getpelican.com/'),
         ('Python.org', 'https://www.python.org/'),
         ('Jinja2', 'https://palletsprojects.com/p/jinja/'),
         ('You can modify those links in your config file', '#'),)

# Social widget
SOCIAL = (('You can add links in your config file', '#'),
          ('Another social link', '#'),)

DEFAULT_PAGINATION = 5

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
THEME = 'clean-blog'
STATIC_PATHS = ['static','img']
#CUSTOM_CSS = 'static/custom.css'

GITHUB_URL = 'https://github.com/cbenge509/typos_field_experiment'
TWITTER_URL = 'http://twitter.com/myprofile'
FACEBOOK_URL = 'http://facebook.com/myprofile'