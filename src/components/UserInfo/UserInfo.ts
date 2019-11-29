import { Scroller } from './Scroller';
import Component = Coveo.Component;
import Initialization = Coveo.Initialization;
import ComponentOptions = Coveo.ComponentOptions;
import IComponentBindings = Coveo.IComponentBindings;
import SearchEndpoint = Coveo.SearchEndpoint;
import IQueryResult = Coveo.IQueryResult;
import QueryUtils = Coveo.QueryUtils;

import IResultsComponentBindings = Coveo.IResultsComponentBindings;
//import $$ = Coveo.$$;
//import { ExecutionReportSimpleSection } from 'coveo-search-ui';

// const MODAL_BODY_SELECTOR = `#UserModal .modal-body`;
const COLORS = '#004990 #F58020 #08080E #4F5658 #193045 #263E55 #1D4F76 #67768B #296896 #9CB4CB #CDDEE9 #BCC3CA #009DDC #DC291E #B10007 #CE3F00 #ECAD00 #FFDF00 #004214 #009830 #92EA00 #003A4C #007068 #00A78A #003F9B #009AD9 #0F0062 #3F008F #621AFF'.split(
  /\s+/g
);

const MODAL_BODY_SELECTOR = `.UserModal .coveo-modal-body`;

declare const require: (module: string) => any;
//@ts-nocheck
require('./UserInfo.scss');

export class MyUserInfo {
  key: string;
  user: IQueryResult;
  managers: string[];
  directreports: string[];
}

export interface IUserInfoOptions {
  userField?: string;
  userTitleField?: string;
  userPhoneField?: string;
  userOfficeField?: string;
  userMobileField?: string;
  userEmailField?: string;
  userAuthorField?: string;
  imageField?: string;
  userLoginField?: string;
  scopePeople?: string;
  scopeDocuments?: string;
  emailFields?: string[];
  authorFields?: string[];
  loginFields?: string[];
  queryPeople?: string;
  queryDocuments?: string;
  queryTeamDocuments?: string;
  managersField?: string;
  directReportsField?: string;
  managersQuery?: string;
  directReportsQuery?: string;
  useThumbnail?: boolean;
  emptyPic?: string;
  activityFields?: string[];
  activityCaption?: string[];
}

export class UserInfo extends Component implements IComponentBindings {
  static ID = 'UserInfo';
  static options: IUserInfoOptions = {
    //userField must be the same for managers/directreports selection
    userField: ComponentOptions.buildStringOption({ defaultValue: '@systitle' }),
    userTitleField: ComponentOptions.buildStringOption({ defaultValue: '@sysworktitle' }),
    userPhoneField: ComponentOptions.buildStringOption({ defaultValue: '@sysworkphone' }),
    userMobileField: ComponentOptions.buildStringOption({ defaultValue: '' }),
    userOfficeField: ComponentOptions.buildStringOption({ defaultValue: '@sysoffice' }),
    userEmailField: ComponentOptions.buildStringOption({ defaultValue: '@sysworkemail' }),
    userAuthorField: ComponentOptions.buildStringOption({ defaultValue: '@systitle' }),
    userLoginField: ComponentOptions.buildStringOption({ defaultValue: '@sysloginname' }),
    imageField: ComponentOptions.buildStringOption({ defaultValue: '' }),
    scopePeople: ComponentOptions.buildStringOption({ defaultValue: '' }),
    scopeDocuments: ComponentOptions.buildStringOption({ defaultValue: '' }),
    emailFields: Coveo.ComponentOptions.buildListOption({ defaultValue: ['@sysfrom'] }),
    authorFields: Coveo.ComponentOptions.buildListOption({ defaultValue: ['@sysauthor', '@sysdisplayfrom'] }),
    loginFields: Coveo.ComponentOptions.buildListOption({ defaultValue: ['@sysloginname'] }),
    queryPeople: ComponentOptions.buildStringOption({ defaultValue: '@syssource==AD @systitle=="KEYFIELD"' }),
    queryDocuments: ComponentOptions.buildStringOption({
      defaultValue: "@sysdate>now-30d NOT @sysfiletype=('exchangeappointment,Image,activedirperson,spsite,exchangeperson,spuserprofile')"
    }),
    queryTeamDocuments: ComponentOptions.buildStringOption({
      defaultValue: "@sysdate>now-30d NOT @sysfiletype=('exchangeappointment,Image,activedirperson,spsite,exchangeperson,spuserprofile')"
    }),
    managersField: ComponentOptions.buildStringOption({ defaultValue: '@sysmanager' }),
    directReportsField: ComponentOptions.buildStringOption({ defaultValue: '@directreports' }),
    managersQuery: ComponentOptions.buildStringOption({ defaultValue: '@syssource==AD @systitle=="KEYFIELD"' }),
    directReportsQuery: ComponentOptions.buildStringOption({ defaultValue: '@syssource==AD @sysmanager=="KEYFIELD"' }),
    useThumbnail: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    emptyPic: ComponentOptions.buildStringOption({ defaultValue: '' }),
    activityFields: Coveo.ComponentOptions.buildListOption({
      defaultValue: ['@syssource', '@sysfiletype']
    }),
    activityCaption: Coveo.ComponentOptions.buildListOption({
      defaultValue: ['Source', 'Filetypes']
    })
  };

  private currentUser: MyUserInfo;

  private colorIdx: any;

  constructor(
    public element: HTMLElement,
    public options: IUserInfoOptions,
    bindings?: IResultsComponentBindings,
    public result?: IQueryResult
  ) {
    super(element, UserInfo.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, UserInfo, options);
    this.result = result;
    this.buildContent();
  }

  private buildContent() {
    $(this.element).on('click', () => this.showUser());
    /*const innerContent = $$('div', { className: 'coveoUserInfo' });
    innerContent.append($$('div', { className: 'coveoUserInfo-title' }, this.options.caption as string).el);
    innerContent.on('click', () => this.showUser());
    this.element.appendChild(innerContent.el);*/
  }

  private setUser(result: IQueryResult): MyUserInfo {
    var user = new MyUserInfo();
    user.directreports = [];
    user.managers = [];
    user.user = result.raw;
    user.user['title'] = result.title;
    user.user['systitle'] = result.title;
    user.key = result.raw[this.options.userField.replace('@', '')];
    return user;
  }

  private setUserWithKey(key): MyUserInfo {
    var user = new MyUserInfo();
    user.key = key;
    return user;
  }

  private showUser() {
    //Based on the current record
    this.currentUser = this.setUser(this.result);
    this.showUserPage(); //this.currentUser);
  }

  private showNewUser(key) {
    //Based on the current record
    this.currentUser = this.setUserWithKey(key);
    this.showUserPage(); //this.currentUser);
  }

  private getPeers(user: MyUserInfo) {
    return new Promise((resolve, reject) => {
      let reports = (user && user.directreports) || null;
      let manager = (user && user.managers && user.managers.length && user.managers[0]) || null;
      if (reports && reports.length) {
        this.getUsersInfo(reports, this.options.queryPeople).then(reports => {
          resolve([user].concat(reports));
        }, reject);
      } else if (manager) {
        this.getUserInfo(manager, this.options.queryPeople).then(manager => {
          this.getPeers(manager).then(resolve, reject);
        }, reject);
      } else {
        resolve([]);
      }
    });
  }

  private getOrg(user: MyUserInfo, thisUserOnly = null) {
    var _this = this;
    let p = new Promise((resolve, reject) => {
      _this.getUsersInfo(user.managers, _this.options.queryPeople).then(
        managers => {
          _this.getUsersInfo(user.directreports, _this.options.queryPeople).then(
            reports => {
              if (thisUserOnly || (reports && reports.length)) {
                // if no reports, show the manager instead, we will see the peers then.
                //if (managers && managers.length)
                resolve({ user: user, managers: managers, directreports: reports });
              } else if (managers && managers.length) {
                //new User(managers[0].workemail).showOrg(this.currentUserEmail);
                _this.getOrg(managers[0], thisUserOnly).then((o: any) => {
                  o.user = managers[0];
                  resolve(o);
                }, reject);
              } else {
                resolve(user);
                // reject({ id: 'ERR-NO-REPORTS-FOR-ORG', msg: 'No reports, show org for manager instead.' });
              }
            },
            err => {
              console.log(`[ERR-USR-02] Getting reports for a user failed.`, err, user);
              reject();
            }
          );
        },
        err => {
          console.log(`[ERR-USR-03] Getting managers chain for a user failed.`, err, user);
          reject();
        }
      );
    });

    return p;
  }

  private async getDirectReports(key : any) {
    let o: SearchEndpoint = Coveo.SearchEndpoint.endpoints['default'];
    //Check if we need to set the scope
    if (this.options.scopePeople != '') {
      Coveo.SearchEndpoint.endpoints['default'].options.queryStringArguments.scope = this.options.scopePeople;
    }
    var myQueryBuilder = new Coveo.QueryBuilder();
    var fields = [this.options.userField];
    myQueryBuilder.addFieldsToInclude(fields);
    myQueryBuilder.enableQuerySyntax = true;
    //Replace KEYFIELD in queryPeople
    var query = this.options.directReportsQuery;
    query = query.replace('KEYFIELD', key);
    myQueryBuilder.expression.add(query);
    var myQuery = myQueryBuilder.build();
    
    var reports = await o.search(myQuery).then(queryResults => {
      var reports = [];
      let results = queryResults.results;
      if (results && results.length) {
        results.map(result => {
          reports.push(result.raw[this.options.userField.replace('@','')])
        });
      }
      return reports;
    });
    return reports;
  }

  private cleanField(result, field){
    field = field.replace('@', '');
    if (field!=""){
      if (result[field]==undefined) {
           result[field]="";
      }
    }
    return result;
  }

  private cleanFields(result){
    result = this.cleanField(result, this.options.userEmailField);
    result = this.cleanField(result, this.options.managersField);
    result = this.cleanField(result, this.options.userTitleField);
    result = this.cleanField(result, this.options.userAuthorField);
    result = this.cleanField(result, this.options.userLoginField);
    result = this.cleanField(result, this.options.imageField);
    result = this.cleanField(result, this.options.userMobileField);
    result = this.cleanField(result, this.options.userPhoneField);
    result = this.cleanField(result, this.options.userOfficeField);
    result = this.cleanField(result, this.options.directReportsField);

     return result;
  }

  private async getUserInfo(key, queryDef) {
    var queryKey = key; //this.options.userField +'=='+key;
    let user = sessionStorage.getItem(key);
    if (user) {
      return Promise.resolve(JSON.parse(user));
    }
    let o: SearchEndpoint = Coveo.SearchEndpoint.endpoints['default'];
    //Check if we need to set the scope
    if (this.options.scopePeople != '') {
      Coveo.SearchEndpoint.endpoints['default'].options.queryStringArguments.scope = this.options.scopePeople;
    }
    var myQueryBuilder = new Coveo.QueryBuilder();
    var fields = [];
    fields = fields.concat([
      this.options.userEmailField,
      this.options.managersField,
      this.options.userTitleField,
      this.options.userAuthorField,
      this.options.userLoginField,
      this.options.imageField,
      this.options.userMobileField,
      this.options.userPhoneField,
      this.options.userOfficeField,
      this.options.directReportsField
    ]);
    var filtered = fields.filter(function (el) {
      return el != "";
    });
    myQueryBuilder.addFieldsToInclude(filtered);
    myQueryBuilder.enableQuerySyntax = true;
    //Replace KEYFIELD in queryPeople
    var query = queryDef;
    query = query.replace('KEYFIELD', queryKey);
    myQueryBuilder.expression.add(query);
    var myQuery = myQueryBuilder.build();
    var _this = this;
    return o.search(myQuery).then(async queryResults => {
      let results = queryResults.results,
        user = null;
      if (results && results.length) {
        
        user = results[0].raw;
        //Check if we need to use a thumbnail
        if (this.options.useThumbnail){
          if (QueryUtils.hasThumbnail(results[0])) {
            user.image = "'"+o.getViewAsDatastreamUri(results[0].uniqueId, '$Thumbnail$', {
              contentType: 'image/png'
            })+"'";
          } else {
            user.image = this.options.emptyPic;
          }
        } else 
        {
          user.image = results[0].raw[this.options.imageField.replace('@', '')];
        }
        user['title'] = results[0].title;
        user['systitle'] = results[0].title;
        user.managers = results[0].raw[this.options.managersField.replace('@', '')];
        if (user.managers == undefined) {
          user.managers = null;
        } else {
          if (!Array.isArray(user.managers)) {
            user.managers = [user.managers];
          }
        }
        if (this.options.directReportsQuery != '') {
           //Collect the directreports
           console.log("Getting DirectReports for: "+queryKey);
           user.directreports = await this.getDirectReports(queryKey);
           console.log("Got DirectReports for: "+queryKey);
        } else {
          user.directreports = results[0].raw[this.options.directReportsField.replace('@', '')];
          if (user.directreports == undefined) {
            user.directreports = null;
          } else {
            if (!Array.isArray(user.directreports)) {
              user.directreports = [user.directreports];
            }
          }
        }
        user = this.cleanFields(user);
        let bIsSameUser = queryKey == user[_this.options.userField.replace('@', '')];
        if (bIsSameUser) {
          sessionStorage.setItem(queryKey, JSON.stringify(user));
        } else {
          console.error(`WRONG user; key doesn't match the userField. `, key, user[_this.options.userField.replace('@', '')]);
        }
      }
      return user;
    });
  }

  private getUsersInfo(users, query) {
    var _this = this;
    if (users) {
      return Promise.all(
        users.map(key => {
          return _this.getUserInfo(`${key}`, query);
        })
      );
    }
    return Promise.resolve([]);
  }

  private renderPeers(user, peers) {
    let addLi = html => {
      return `<div class="s-item">${html}</div>`;
    };

    peers = (peers || []).filter(p => p && p[this.options.userField.replace('@', '')]);
    let html = peers
      .filter(p => {
        return p[this.options.userField.replace('@', '')] !== user[this.options.userField.replace('@', '')];
      })
      .map(this.renderPerson.bind(this, 'large', ''))
      .map(addLi);
    $('.team-slider')
      .empty()
      .html(html);

    $(`${MODAL_BODY_SELECTOR} .scroller .usercard`).on('click', e => {
      let key = e.currentTarget.getAttribute('data-id');
      e.currentTarget.setAttribute('data-processed', '2');
      this.showNewUser(key);
    });
  }

  private renderPerson(cssClass, selectedKey, p) {
    if (p && p[this.options.userField.replace('@', '')]) {
      let pic = p.image;
      /*if (cssClass === 'large') {
        pic = p.picturelarge;
        cssClass = '';
      }*/

      if ((selectedKey || this.currentUser.key) === p[this.options.userField.replace('@', '')]) {
        cssClass += ' selected';
      }
      //
      // <div class="dept">${p.department}</div>
      return `<div class="usercard ${cssClass}" data-id="${p[this.options.userField.replace('@', '')]}">
      <div class="small-picture" style="background-image: url(${pic})"></div>
        <div class="display-name">${p[this.options.userAuthorField.replace('@', '')]}</div>
        <div class="title">${p[this.options.userTitleField.replace('@', '')]}</div>
       
        </div>`;
    }
    return '';
  }

  /* public showBadge() {
    return this.getUserInfo(`@workemail=="${this.currentUserEmail}"`).then(user => {
      localStorage.setItem('coveoCurrentUser', JSON.stringify(user));
      CURRENT_USER_OFFSET = user.adusertimezoneoffset;
      let pic = user.picturesmall;
      $('.user-badge')
        .empty()
        .attr('data-email', user.workemail)
        .html(`<div class="user-picture" title="${user.workemail}" style="background-image: url(https:${pic})"></div>`)
        .on('click', this.showUserPage.bind(this, user));
    });
  }*/

  private renderOrg(user, selectedKey, data) {
    let managers = (data.managers || []).reverse(),
      reports = data.directreports || [];

    let addLi = html => {
      return `<li>${html}</li>`;
    };

    if (reports && reports.length) {
      managers.push(data.user || user);
    }

    let managersHtml = managers.map(this.renderPerson.bind(this, 'managers', selectedKey)).map(addLi);
    let reportsHtml = '',
      allReportsHtml = reports
        .filter(report => report) // remove undefined items
        .map(this.renderPerson.bind(this, 'reports', selectedKey));

    if (allReportsHtml && allReportsHtml.length) {
      reportsHtml = allReportsHtml.map(addLi).join('');
    }

    return `<h1>My colleagues</h1><ul class="org-chart">${managersHtml.join('')}${reportsHtml}</ul>`;
  }

  private showModal(content: HTMLElement): Coveo.ModalBox.ModalBox {
    Coveo.ModalBox.close();

    let options = {
      className: 'UserModal',
      fullscreen: true,
      sizeMod: 'big'
    };
    return Coveo.ModalBox.open(content, options);
  }

  /* private getManagers(user : any) {

  }*/

  private showUserPage(user: any = null) {
    let e = s => {
      return Coveo.Utils.encodeHTMLEntities(s || '');
    };

    if (!user) {
      return this.getUserInfo(`${this.currentUser.key}`, this.options.queryPeople).then(user => {
        //We want to check if managers are set, if not retrieve them
        //We want to check if directreports are set, if not retrieve them
        if (user.managers == undefined) {
          //.then getManagers
        }
        if (user.directreports == undefined) {
          //.then getDirectReports
        }
        // make sure we found a user to prevent infinite loop.
        if (user) {
          this.showUserPage(user);
        }
      });
    }

    const eventData = {
      documentURL: window.location.href.split(/[?#]/)[0] + '#personpage=' + user[this.options.userField.replace('@', '')],
      uri: user.uri,
      urihash: user.urihash,
      workemail: user.workemail
    };
    Coveo.logCustomEvent(document.querySelector('#search'), { name: 'pageview', type: 'person' }, eventData);

    let loadingAnimation = `<div class="spinner" style="min-height:100px"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>`;

    let div = $(`<div class="CoveoSearchInterface coveo-after-initialization">
  <div class="userpage-container">
    <div class="userpage-main">

      <div id="userpage-recent-docs-user"style="display:block">

      <div data-wait-animation="fade">

          <div class="flex userpage-info-container">
            <div class="userpage-picture" style="background-image: url(${user.image})">
            </div>
            <div class="flex-auto userpage-info">
              <div class="userpage-user-name">${user[this.options.userAuthorField.replace('@', '')]}</div>
              <div class="userpage-user-info">${user[this.options.userTitleField.replace('@', '')]}</div>
              <br>
              
              <div class="userpage-quickinfo icon-email">
                <a href="mailto:${user[this.options.userEmailField.replace('@', '')]}">${e(user[this.options.userEmailField.replace('@', '')])}</a>
              </div>
              <div class="userpage-quickinfo icon-phone">
                ${e(user[this.options.userPhoneField.replace('@', '')])}
              </div>
              <div class="userpage-quickinfo icon-phone">
                ${e(user[this.options.userMobileField.replace('@', '')])}
              </div>
              <div class="userpage-quickinfo icon-position" data-office="${user[this.options.userOfficeField.replace('@', '')]}">
                ${user[this.options.userOfficeField.replace('@', '')]}
              </div>
            </div>
          </div>
          <div class="userpage-section">
            <h1 title="Number of items to which this user contributed (created, posted, modified, commented...) and that were modified in the past 30 days.">My Activity for the Last 30 Days &nbsp; &nbsp; </h1>
            <div id="userpage-stats">
              ${loadingAnimation}
            </div>
          </div>

          <div class="userpage-section">
            <h1 title="Some recent items to which this user contributed (created, posted, modified, commented...).">My Recent Contributions &nbsp; &nbsp;</h1>
            <div class="user-results-list">
              ${loadingAnimation}
            </div>
          </div>

        </div>
      </div>

      <div class="userpage-section" style="margin-top:-1px">
        <h1>My Team</h1>
        <div class="scroller">
          <div class="s-left" ><</div>
          <div class="s-right" >></div>
          <div class="s-content team-slider"></div>
        </div>
      </div>

      <div class="userpage-section">
        <h1>My Team Recent Contributions &nbsp; &nbsp; <span class="coveo-small-icon icon-help" title="Some recent items to which this team contributed (created, posted, modified, commented...)."></span></h1>
        <div id="userpage-recent-docs-team">
          <div class="user-results-list">
            ${loadingAnimation}
          </div>
        </div>
      </div>
    </div>

    <div class="userpage-org">
      <h1>My Colleagues</h1>
    </div>

  </div>
</div>`);

    this.showModal(div.get(0));

    // add &personpage=[email] on the history stack
    let href = window.location.href;
    href = href.replace(/&personpage=[^&]*/g, '');
    history.replaceState({ email: this.currentUser.key }, this.currentUser.key, href + '&personpage=' + this.currentUser.key);

    this.getOrg(user).then(
      (orgData: any) => {
        let html = this.renderOrg(orgData.user, user[this.options.userField.replace('@', '')], orgData);
        $(`${MODAL_BODY_SELECTOR} .userpage-org`)
          .empty()
          .html(html);
          $(`${MODAL_BODY_SELECTOR} .userpage-org .usercard`).on('click', e => {
            let key = e.currentTarget.getAttribute('data-id');
            e.currentTarget.setAttribute('data-processed', '2');
            this.showNewUser(key);
          });
      
        /*$(`${MODAL_BODY_SELECTOR} .userpage-org .usercard`).on('click', e => {
          let email = e.currentTarget.getAttribute('data-id');
          new User(email).showUserPage();
        });*/
      },
      err => {
        if (err && err.id !== 'ERR-NO-REPORTS-FOR-ORG') {
          console.log(`[ERR-USR-10] Failed to get the Org data for this user.`, err, user);
        }
      }
    );

    let s = new Scroller($(`${MODAL_BODY_SELECTOR} .userpage-section .scroller`));

    var _this = this;
    return _this.getPeers(user).then(
      (peers: MyUserInfo[]) => {
        _this.renderPeers(user, peers);
        s.updateScroll();

        // show recent docs for this user
        _this.showRecentDocs(
          [user],
          '#userpage-recent-docs-user',
          this.options.queryDocuments,
          _this.showRecentStats.bind(this), // on success
          () => {
            // on error
            $('#userpage-stats')
              .closest('.userpage-section')
              .remove();
          }
        );

        // show recent docs for team
        peers = peers.filter(p => p && p[this.options.userField.replace('@', '')] !== user[this.options.userField.replace('@', '')]);
        _this.showRecentDocs(peers, '#userpage-recent-docs-team', this.options.queryTeamDocuments);
      },
      err => {
        if (err && err.id !== 'ERR-NO-REPORTS-FOR-ORG') {
          console.log(`[ERR-USR-11] Failed to get the Org data for this user.`, err, user);
        }
      }
    );
  }

  private _showRecentStatsSection(name, results) {
    let e = s => {
      return Coveo.Utils.encodeHTMLEntities(s || '');
    };

    const max = Math.max(...results.map(v => v.numberOfResults));

    let aRows = results
      .sort((a, b) => {
        return a.numberOfResults < b.numberOfResults ? 1 : -1;
      })
      .slice(0, 7)
      .map(v => {
        let color = COLORS[this.colorIdx++ % COLORS.length],
          xPos = Math.min(160, (160 * v.numberOfResults) / max); // Max value will be set at 160px
        return `<div class="userpage-stats-item">
            <div class="userpage-stats-label" title="${e(v.value)}">${e(v.value)}</div>
            <svg width="200" height="20" viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="10" x2="${xPos}" data-value="${
          v.numberOfResults
        }" data-max="${max}" y2="10" stroke-width="10" stroke="${color}"></line>
              <text x="${xPos + 10}" y="15" fill="${color}">${v.numberOfResults}</text>
            </svg>
          </div>`;
      });
    return results.length ? `<div class="userpage-stats-section"><h2>${name}</h2>${aRows.join('')}</div>` : '';
  }

  private showRecentStats(results) {
    const groupByResults = results.groupByResults || [];

    $('#userpage-stats').empty();
    if (groupByResults.length) {
      this.colorIdx = 0;
      var html = [];
      var i=0;
      for (i=0;i<this.options.activityCaption.length;i++){
        html.push(this._showRecentStatsSection(this.options.activityCaption[i], groupByResults[i].values));
      }
      

      $('#userpage-stats').html(`${html.join('')}`);
    }
  }

  private showRecentDocs(users: MyUserInfo[], sId: string, filterquery: string, onSuccess = null, onError = null) {
    // get docs for peers:
    let emails = users.map(p => p[this.options.userEmailField.replace('@', '')]),
      authors = users.map(p => p && p[this.options.userAuthorField.replace('@', '')]),
      loginnames = users.map(p => p && p[this.options.userLoginField.replace('@', '')]);

    let getExpr = (field: string, op: string, values: string[]) => {
      let expr = new Coveo.ExpressionBuilder();
      expr.addFieldExpression('@' + field.replace('@',''), op, values);
      return expr;
    };

    if (!(emails.length || authors.length || loginnames.length)) {
      return;
    }

    let emailExprs = this.options.emailFields.map((field: string) => {
      return getExpr(field, '==', emails);
    });
    let authorExprs = this.options.authorFields.map((field: string) => {
      return getExpr(field, '==', authors);
    });
    let loginExprs = this.options.loginFields.map((field: string) => {
      return getExpr(field, '==', loginnames);
    });

    let filterExpr = new Coveo.ExpressionBuilder();

    let qbRecentContributions = new Coveo.QueryBuilder();
    qbRecentContributions.enableQuerySyntax = true;
    qbRecentContributions.sortCriteria = 'datedescending';
    qbRecentContributions.expression = Coveo.ExpressionBuilder.merge(
      filterExpr,
      Coveo.ExpressionBuilder.mergeUsingOr.apply(null, emailExprs.concat(authorExprs).concat(loginExprs))
    );
    qbRecentContributions.advancedExpression.add(filterquery);
    qbRecentContributions.groupByRequests = [];
    var i=0;
    for (i=0;i<this.options.activityFields.length;i++){
      qbRecentContributions.groupByRequests.push({ field:this.options.activityFields[i] , injectionDepth: 1000 });
    }
    

    let defaultSearchEndpoint: SearchEndpoint = Coveo.SearchEndpoint.endpoints['default'];
    //Check if we need to set the scope
    if (this.options.scopeDocuments != '') {
      Coveo.SearchEndpoint.endpoints['default'].options.queryStringArguments.scope = this.options.scopeDocuments;
    }
    defaultSearchEndpoint.search(qbRecentContributions.build()).then(data => {
      const container = document.querySelector(`${sId} .user-results-list`);
      container.innerHTML = '';

      const ResultList = Coveo.get(document.querySelector('.CoveoResultList')) as Coveo.ResultList;
      ResultList.buildResults(data).then(async (elements: HTMLElement[]) => {
        for (let element of elements) {
          container.append(element);
        }
      });

      if (onSuccess) {
        onSuccess(data);
      }
    });
  }
}

Initialization.registerAutoCreateComponent(UserInfo);
