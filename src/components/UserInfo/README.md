## Basic Usage

UserInfo will show a rich people quickview.
It will try to construct an organization structure, will get an overview of activities, show recent documents and team documents.

You can set all the settings of the control like:
```javascript
 $("#search").coveo("options", {
    UserInfo: { scopePeople: myPeopleScope, 
                scopeDocuments: myAllScope,
                userField: '@systitle',
                userTitleField: '@sysworktitle',
                userPhoneField: '@sysworkphone',
                userMobileField: '',
                userOfficeField: '@sysoffice',
                userEmailField: '@sysworkemail',
                userAuthorField: '@systitle',
                userLoginField: '@sysloginname',
                imageField: '',
                emailFields: ['@sysfrom','@systo'],
                authorFields: ['@sysauthor', '@sysdisplayfrom'],
                loginFields: ['@sysloginname'],
                queryPeople: '@sysconnectortype==ActiveDirectoryCrawler @systitle=="KEYFIELD"',
                queryDocuments: "@sysdate>now-30d NOT @sysfiletype=('exchangeappointment,Image,activedirperson,spsite,exchangeperson,spuserprofile')",
                queryTeamDocuments: "@sysdate>now-30d NOT @sysfiletype=('exchangeappointment,Image,activedirperson,spsite,exchangeperson,spuserprofile')",
                managersField: '@sysmanager',
                directReportsField: '@directreports',
                managersQuery: '@sysconnectortype==ActiveDirectoryCrawler @systitle=="KEYFIELD"',
                directReportsQuery: '@sysconnectortype==ActiveDirectoryCrawler @sysmanager=="KEYFIELD"',
                useThumbnail: true,
                emptyPic: 'lib/images/Background1.png',
                activityFields: ['@syssource', '@sysdisplayrecipients'],
                activityCaption: ['Source', 'Popular Senders']
              }
  });
```

And define the control in your HTML template like:
```html
                <a class="CoveoResultLink" target="_blank"></a><div class="CoveoUserInfo" data-caption=""><div class="coveo-icon-for-quickview"><svg alt="Quickview" focusable="false" enable-background="new 0 0 20 12" viewBox="0 0 20 12" xmlns="http://www.w3.org/2000/svg" class="coveo-icon-for-quickview-svg"><g fill="currentColor"><path d="m10 4.3c-1 0-1.7.8-1.7 1.7 0 1 .8 1.7 1.7 1.7 1 0 1.7-.8 1.7-1.7 0-1-.7-1.7-1.7-1.7m0 4.7c-1.6 0-3-1.4-3-3s1.4-3 3-3 3 1.4 3 3-1.4 3-3 3"></path><path d="m19.8 6.4v-.001c.069-.117.109-.253.109-.399s-.04-.282-.109-.399v-.001c-.005-.008.005.007 0 0-2.203-3.473-5.917-5.6-9.8-5.6-3.884 0-7.655 2.091-9.8 5.602l0 0c-.069.117-.109.253-.109.398s.04.281.109.398c0 0-.001-.002 0 0 2.203 3.475 5.916 5.602 9.8 5.602 3.883 0 7.597-2.127 9.8-5.6.005-.007-.005.008 0 0zm-9.8 4.1c-3.236 0-6.28-1.635-8.189-4.339-.067-.095-.067-.228-.002-.324 1.908-2.797 4.953-4.337 8.191-4.337 3.235 0 6.278 1.634 8.187 4.337.068.096.068.231 0 .327-1.909 2.702-4.952 4.336-8.187 4.336z"></path></g></svg></div></div>
      
```


## Options

### scopePeople: _string_
For On-Premise deployments: sets the ScopeId to use for the People query.

### scopeDocuments: _string_
For On-Premise deployments: sets the ScopeId to use for the Documents query.

### userField: _string_
Set the userField to use for all lookups. This field should contain the same values as the values within the `managersField`.

### userTitleField: _string_
Set the userTitleField. Should contain the title of each user (will be shown as sub entry in the Org Chart).

### userPhoneField: _string_
Field to use for the Work Phone. Will be displayed on the selected user only.

### userMobileField: _string_
Field to use for the Mobile Phone. Will be displayed on the selected user only.

### userOfficeField: _string_
Field to use for the Office. Will be displayed on the selected user only.

### userEmailField: _string_
Field to use for the Email. Will be displayed on the selected user only. Will also be used to construct the query for Related Documents.

### userAuthorField: _string_
Field to use for the Author. Will be displayed on the selected user only. Will also be used to construct the query for Related Documents.

### userLoginField: _string_
Field to use for the Login Field. Will be displayed on the selected user only. Will also be used to construct the query for Related Documents.

### imageField: _string_
Field to use for the images (thumbnails of the people). If `useThumbnail` is set to `false` you must supply an field for the image. Should contain the full path to the image.

### emailFields: _string[]_
Which fields must be used in the recent Documents to find related documents on email addresses. 

### authorFields: _string[]_
Which fields must be used in the recent Documents to find related documents authors. 

### loginFields: _string[]_
Which fields must be used in the recent Documents to find related documents on login name. 

### queryPeople: _string_
Query to execute to get the people information. The `KEYFIELD` will be replaced by the `userField` contents.

### queryDocuments: _string_
Query to execute to get the documents related to the current person. The `emailFields`, `authorFields` and `loginFields` will be added to the query.

### queryTeamDocuments: _string_
Query to execute to get the documents related to the current team. The `emailFields`, `authorFields` and `loginFields` will be added to the query.

### managersField: _string_
Field to retrieve the managers information.

### directReportsField: _string_
Field to retrieve the direct reports of the current person.

### useThumbnail: _boolean_
If the control needs to use thumbnails from the index for the pictures of the people.

### emptyPic: _boolean_
If no thumbnail is available or no `imageField`, then the `emptyPic` will be used for images.

### activityFields: _string[]_
The fields (must be a Facet field) to use to display on the Recent Activity overview.

### activityCaption: _string[]_
The captions for each `activityFields`  to display on the Recent Activity overview.

