## Basic Usage

ScopeSelector will add the specified scope based on the current selected tab.

```
<div class="CoveoScopeSelector"></div>
```

This component inherits from the ResultLink component options.

Most of the options available for a ResultLink component are also available for a ReweriteResultLink component.



## Options

Specifies a JSON object describing a mapping of Facet values to their desired captions.
You can only set this option in the {@link init} call of your search interface. You cannot set it directly in the
markup as an HTML attribute.
Example:
```
   // Specific scopes
   var myScopes = {  "ALL": "12","Email": "43", [ etc ... ]};
   // You can set the option in the 'init' call using 'pure' JavaScript:
   Coveo.init(document.querySelector('#search'), {
      ScopeSelector : {
        scopes: myScopes
       }
    })
    
    // Or  the jQuery extension
    $("#search").coveo("init", {
       ScopeSelector: {
         scopes: myScopes
       }
    })
```

