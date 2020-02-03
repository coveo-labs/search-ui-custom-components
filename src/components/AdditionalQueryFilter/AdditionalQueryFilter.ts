import {
  Initialization,
  Component,
  ComponentOptions,
  QueryEvents,
  IResultsComponentBindings,
  IBuildingQueryEventArgs,
  IInitializationEventArgs,
  InitializationEvents,
  Utils,
  Tab,
  $$
} from 'coveo-search-ui';

import { each,  map } from 'underscore';

export interface IAdditionalQueryFilterOptions {
  fields?: string[];
  query?: string;
  filterquery?: string;
  filterquerynoresults?: string;
  scope?: string;
  tabfield? : string;
}

export class AdditionalQueryFilter extends Component {
  static ID = 'AdditionalQueryFilter';

  private localStorage: Coveo.LocalStorageUtils<{}>;
  private retrievedInfo: any;

  static options: IAdditionalQueryFilterOptions = {
    fields: Coveo.ComponentOptions.buildListOption(),
    query: ComponentOptions.buildStringOption(),
    filterquery: ComponentOptions.buildStringOption({ defaultValue: '' }),
    filterquerynoresults: ComponentOptions.buildStringOption({ defaultValue: '' }),
    scope: ComponentOptions.buildStringOption({ defaultValue: '' }),
    tabfield: ComponentOptions.buildStringOption({ defaultValue: '' })
  };

  constructor(public element: HTMLElement, public options: IAdditionalQueryFilterOptions, public bindings: IResultsComponentBindings) {
    super(element, AdditionalQueryFilter.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, AdditionalQueryFilter, options);
    this.localStorage = new Coveo.LocalStorageUtils(AdditionalQueryFilter.ID);
    this.bindEvents();
  }

  private initInfo() {
    //Initialize retrievedInfo structure
    this.retrievedInfo = {};
    for (var i = 0; i < this.options.fields.length; i++) {
      this.retrievedInfo[this.options.fields[i]] = '';
    }
    this.retrievedInfo['Collected'] = false;
  }

  private bindEvents() {
    //Bind events
    this.bind.onRootElement(QueryEvents.buildingQuery, (arg: IBuildingQueryEventArgs) => this.handleQuery(arg));
    this.bind.onRootElement(InitializationEvents.afterInitialization, (arg: IInitializationEventArgs) =>
      this.handleAfterInitialization(arg)
    );
  }

  public isElementIncludedInTab(element: HTMLElement, value): boolean {
    if (value=="") return true;
    const includedTabs = this.splitListOfTabs(element.getAttribute('data-tab-show'));
    const excludedTabs = this.splitListOfTabs(element.getAttribute('data-tab-show-not'));
    const inIncluded = includedTabs.filter(p => value.includes(p)).length>0;
    const inExcluded = excludedTabs.filter(p => value.includes(p)).length>0;
    return (
      (includedTabs.length != 0 && inIncluded) ||
      (excludedTabs.length != 0 && !inExcluded) ||
      (includedTabs.length == 0 && excludedTabs.length == 0)
    );
  }

  public isElementInTab(element: HTMLElement, value): boolean {
    if (value=="") return false;
    const includedTabs = this.splitListOfTabs(element.getAttribute('data-tab-show-initial'));
    const inIncluded = includedTabs.filter(p => value.includes(p)).length>0;
    return (
      (includedTabs.length != 0 && inIncluded) ||
      (includedTabs.length == 0)
    );
  }

  private splitListOfTabs(value: string): string[] {
    if (Utils.exists(value)) {
      return map(value.split(','), tab => Utils.trim(tab));
    } else {
      return [];
    }
  }

  private enableDisableTabs(){
    console.log('Disable/enable tabs based on userprofile.');
    const showElements = [];
    const hideElements = [];
    var tabToActivate: HTMLElement;
    if (this.options.tabfield!=""){
      var tabFieldValue = this.retrievedInfo[this.options.tabfield];
      each($$(this.root).findAll('[data-tab-show],[data-tab-show-not]'), element => {
        if (this.isElementIncludedInTab(element, tabFieldValue)) {
          showElements.push(element);
        } else {
          hideElements.push(element);
        }
      });
      each($$(this.root).findAll('[data-tab-show-initial]'), element => {
        if (this.isElementInTab(element, tabFieldValue)) {
          tabToActivate = element;
        } 
      });

      each(showElements, elem => $$(elem).removeClass('coveo-tab-disabled'));
      each(hideElements, elem => $$(elem).addClass('coveo-tab-disabled'));
      //Activate tab
      if (tabToActivate!=undefined) {
        var myTabInstance = Coveo.get(tabToActivate);
        (myTabInstance as Tab).select();
      }
    }

  }

  private handleQuery(args: IBuildingQueryEventArgs) {
    //Add Advancedquery
    this.getStorage();
    if (this.retrievedInfo != null) {
      if (this.retrievedInfo['Collected'] == false) {
        //Cancel current query
        args.cancel = true;
        return;
      }
    }
    if (this.retrievedInfo['Collected'] == 'Empty') {
      if (this.options.filterquerynoresults != '') {
        args.queryBuilder.advancedExpression.add(this.options.filterquerynoresults);
      }
    } else {
      
      if (this.options.filterquery != '') {
        var query = this.options.filterquery;
        for (var i = 0; i < this.options.fields.length; i++) {
          query = query.replace('{FIELD' + (i + 1) + '}', this.retrievedInfo[this.options.fields[i]]);
        }
        args.queryBuilder.advancedExpression.add(query);
      }
    }
  }

  private getStorage() {
    if (this.retrievedInfo == null) {
      this.retrievedInfo = this.localStorage.load();
    }
  }

  private getFieldsFromIndex() {
    //Check if present in local storage
    var _this = this;
    new Promise(function(deferred) {
      _this.retrievedInfo = _this.localStorage.load();
      if (_this.retrievedInfo == null) {
        //Get it from the index
        _this.initInfo();
        var query = new Coveo.QueryBuilder();
        query.numberOfResults = 1;
        query.expression.add(_this.options.query);

        var builtQuery = query.build();

        if (_this.options.scope != '') {
          Coveo.SearchEndpoint.endpoints.default.options.queryStringArguments.scope = _this.options.scope;
        }
        var resultPromise = _this.queryController.getEndpoint().search(builtQuery);
        
        if (resultPromise) {
          resultPromise
            .then(function(results) {
              if (results.totalCount > 0) {
                for (var i = 0; i < _this.options.fields.length; i++) {
                  _this.retrievedInfo[_this.options.fields[i]] = results.results[0].raw[_this.options.fields[i].replace('@', '')];
                }
                _this.retrievedInfo['Collected'] = true;
                _this.localStorage.save([_this.retrievedInfo]);
              } else {
                _this.retrievedInfo['Collected'] = 'Empty';
              }
              _this.enableDisableTabs();
              deferred(_this.queryController.executeQuery());
            })
            .catch(function(e) {
              console.log(e);
              _this.retrievedInfo['Collected'] == false;
              _this.enableDisableTabs();
              deferred();
            });
        }
      } else {
        deferred();
      }
    });
  }

  private handleAfterInitialization(args: IInitializationEventArgs) {
    //Clear local storage
    this.localStorage.remove();
    //Get item from query
    this.getFieldsFromIndex();
  }
}

Initialization.registerAutoCreateComponent(AdditionalQueryFilter);
