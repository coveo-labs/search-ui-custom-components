## Basic Usage

RewriteResultLink will change clickable/printable URI logic to specified rewrite rule. Will also rewrite all attachments + all childs.

```
<a class="CoveoRewriteResultLink" find="" replace="" target="_blank"></a>
```

This component inherits from the ResultLink component options.

Most of the options available for a ResultLink component are also available for a ReweriteResultLink component.



## Options

### find : _string[]_

Array of Regex to use for finding the URL.
*Number of items in the array MUST be equal to replace array.*


Example: `data-find='/https:\/\/.*\.domain\.co\.uk/gm'`

### replace : _string[]_

Array of Regex to use for replacing the URL.


Example: `data-replace='https://mail.domain.uk'`

