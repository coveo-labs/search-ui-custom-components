## Basic Usage

SalesforceCommunityResultLink will change clickable URI logic to open Salesforce content (Knowledge, Chatter, ContentDocument, Collaboration Group, Idea & Case) in the context of a Salesforce Lightning Community

```
https://mycommunity.company.com/s/article/article-url-name
https://mycommunity.company.com/s/case/5002000000D8cuI
https://mycommunity.company.com/s/feed/5003000000D8cuI
https://mycommunity.company.com/s/question/5003000000D8cuI
https://mycommunity.company.com/s/contentdocument/5004000000D8cuI
https://mycommunity.company.com/s/ideas#5005000000D8cuI
https://mycommunity.company.com/s/group/5006000000D8cuI

```

This component inherits from the ResultLink component options.

Most of the options available for a ResultLink component are also available for a SalesforceCommunityResultLink component.

Here is the list of ResultLink options which the SalesforceCommunityResultLink component does not support.

- Field
- hrefTemplate

## Options

### useAsPrintable (optional) : _boolean_

Specifies whether to display link instead of title

Default value is the boolean `false`.

Example: `data-use-as-printable='true'`

### enableUrlRewriter (optional) : _boolean_

Whether to enable url rewriting logic

Default value is the boolean `true`.

Example: `data-enable-url-rewriter='true'`

### hostName (optional) : _string_

Specifies the host name of your Salesforce Lightning Community.

Default value is the string `window.location.hostname`.

Example: `data-host-name='community.company.com'`

### name (optional) : _string_

Specifies the name of your Salesforce Lightning Community.

Default value is the string ``.

Example: `data-name='community-name'`

### protocol (optional) : _string_

Specifies protocol for the clickable link.

Default value is the string `window.location.protocol`.

Example: `data-protocol='https'`
