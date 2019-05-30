## Basic Usage

The CustomContext component in a Coveo Search interface.

```
 <body id='search' class='CoveoSearchInterface'>
    <div class='CoveoCustomContext' data-context='{"foo":"bar"}'></div>
```

![CustomContext](CustomContext_v2.png)

![CustomContext](CustomContext_querySuggest.png)

## Options

### context : _[key: string]: any_

Specifies the context object to be sent along with the search queries

Example: `data-context='{"foo":"bar"}'`

Default value is `{}`.
