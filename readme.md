# Strova assert

| Keyword | alias | meaning |
|---|:---:|---|
*reserved* | ! | nothing
nullable | ? | may be null, used for type checking if not null
notEmpty | # | <ul><li>*string* must contain white character</li><li>*array* must not be zero sized</li><li>*object* must have some properites</li></ul>
notBlank | $ | for *string* only - must not contain white characters only

[![Build Status](https://travis-ci.org/vojtechsoban/babel-plugin-comment-strova-assert.svg?branch=master)](https://travis-ci.org/vojtechsoban/babel-plugin-comment-strova-assert)
