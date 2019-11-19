## Basic Usage

AdditionalQueryFilter will query the index to retrieve an additional filter to apply.
For example: Get field @syscompany from the index and apply it as an AdvancedExpression.

```
<div class="CoveoAdditionalQueryFilter" data-fields="@mycompany,@myuser" data-query="@sysource=People @currentuser" data-filterquery="(@mycompany={FIELD1} AND @myuser={FIELD2}) OR NOT @mycompany"></div>
```

## main.js in C:\Program Files\Coveo Search API 8\pipelines\default
Should contain:
```javascript
var currUser='';

Coveo.onResolveIdentity(function (authenticated) {
  var user = authenticated[0];
  Log.info("ID: "+user.user);
  //user = COVEO\\wnijmeijer
  var logonname = user.user.split('\\')[1];
  Log.info("Usern:"+logonname );
  currUser = logonname;
  return authenticated;
});
 
Coveo.onPreprocessQuery(function(query) {
  if (query.expression){
    if (query.expression.contains('@querytogetcompanyname')){
      query.expression= query.expression.replace('@querytogetcompanyname','@sysloginname=="'+currUser+'"');
    }
  }
});
```


## Options

### fields : _string[]_

Array of fields to fetch.

Example: `data-fields="@mycompany,@myuser"`

### query : _string_

Query to execute to retrieve the fields

Example: `data-query="@syssource=People @querytogetcompanyname" `

### filterquery : _string_

Query to execute as new AdvancedExpression with every query.
FIELDX in order of the fields specified by fields.

Example: `data-filterquery="(@mycompany={FIELD1} AND @myuser={FIELD2}) OR NOT @mycompany" `


### filterquerynoresults : _string_

Query to execute when query did not find the content.


Example: `data-filterquerynoresults="NOT @mycompany" `

### scope : _string_

Scope ID to use for the above queries
*Scope ID defined in Search Scopes*

Example: `data-scope="432" `