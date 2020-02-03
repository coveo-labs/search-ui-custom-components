## Basic Usage

AdditionalQueryFilter will query the index to retrieve an additional filter to apply.
It can also show tabs based upon a match on a field from the user (for example department).
Besides the 'show tabs' it can also activate the initial tab for a specific profile.

In your tab section you can set:
```html
<a class="CoveoTab" id="allresults" data-id="All" data-sort="relevancy" data-icon="coveo-sprites-tab-all-content" data-caption="All"
          data-tab-show=""
          data-tab-show-not="HR"
          data-tab-show-initial="Sales"></a>
```
The above will disable the tab if the syscompany == HR. It will activate the tab for the `Sales` people.
Remark: filter is partial match.

```html
<a class="CoveoTab" id="allresults" data-id="All" data-sort="relevancy" data-icon="coveo-sprites-tab-all-content" data-caption="All"
          data-tab-show="HR"
          data-tab-show-not=""></a>
```
The above will show the tab if the syscompany == HR. Remark: filter is partial match.


For example: Get field @syscompany from the index and apply it as an AdvancedExpression.

```html
<div class="CoveoAdditionalQueryFilter" data-scope="123" data-fields="@mycompany,@myuser" data-query="@syssource=People @querytogetcompanyname" data-filterquery="(@mycompany={FIELD1} AND @myuser={FIELD2}) OR NOT @mycompany"></div>
```

Retrieved fields are stored in local storage with id: `AdditionalQueryFilter`.

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


### tabfield : _string_

Field to use to enable/disable tabs

Example: `data-tabfield="mycompany" `