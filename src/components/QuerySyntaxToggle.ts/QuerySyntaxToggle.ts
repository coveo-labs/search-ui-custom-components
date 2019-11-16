import {
  IResultsComponentBindings,
  ComponentOptions,
  Component,
  Initialization,
  $$,
  // IQuerySuccessEventArgs,
  IBuildingQueryEventArgs,
  QueryEvents
} from 'coveo-search-ui';
import { LocalStorageUtils } from './LocalStorageUtils';

declare const require: (module: string) => any;
require('./QuerySyntaxToggle.scss');

export class QuerySyntaxToggle extends Component {
  private localStorage: LocalStorageUtils<{ enableQuerySyntax: boolean }>;
  private syntaxPreferenceCache: boolean = undefined;
  static ID = 'QuerySyntaxToggle';

  constructor(public element: HTMLElement, public options: any, public bindings: IResultsComponentBindings) {
    super(element, QuerySyntaxToggle.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, QuerySyntaxToggle, options);
    this.bindQueryEvent();

    this.localStorage = new LocalStorageUtils<{ enableQuerySyntax: boolean }>(QuerySyntaxToggle.ID);

    this.element.appendChild(this.build());
    this.updateToggleBasedOnPreference();
  }

  private build(): HTMLElement {
    const toggle = $$('label', { className: 'custo-slide-toggle-label boxed' });
    const input = $$('input', { className: 'custo-slide-toggle', type: 'checkbox' });
    input.on('change', () => {
      this.handleInputChange();
    });
    const button = $$('button', { type: 'button' });
    button.on('click', () => {
      toggle.el.click();
    });

    toggle.append($$('span', { className: 'toggle-label', type: 'checkbox' }, 'Query Syntax').el);
    toggle.append(input.el);
    toggle.append(button.el);
    return toggle.el;
  }

  private bindQueryEvent() {
    // this.bind.onRootElement(QueryEvents.deferredQuerySuccess, (arg: IQuerySuccessEventArgs) => this.handleDeferredQuerySuccess(arg));
    this.bind.onRootElement(QueryEvents.buildingQuery, (arg: IBuildingQueryEventArgs) => this.handleBuildingQuery(arg));
  }

  private handleBuildingQuery(arg: IBuildingQueryEventArgs) {
    arg.queryBuilder.enableQuerySyntax = this.getQuerySyntaxPreference();
  }

  private handleInputChange() {
    this.toggleQuerySyntax();
    // this.updateToggleBasedOnPreference();
    this.queryController.executeQuery({
      beforeExecuteQuery: () => {
        this.usageAnalytics.logCustomEvent(
          { name: 'toggleQuerySuggest', type: 'customEventType' },
          {
            facetTitle: this.options.title || 'Tab'
          },
          this.root
        );
      }
    });
  }

  private updateToggleBasedOnPreference() {
    const input: HTMLInputElement = this.element.querySelector('input');
    input.checked = this.getQuerySyntaxPreference();
  }

  private toggleQuerySyntax() {
    this.saveQuerySyntaxPreference(!this.getQuerySyntaxPreference());
  }

  private saveQuerySyntaxPreference(enable: boolean) {
    this.localStorage.save({ enableQuerySyntax: enable });
    this.syntaxPreferenceCache = enable;
  }
  private getQuerySyntaxPreference(): boolean {
    if (this.syntaxPreferenceCache) {
      return this.syntaxPreferenceCache;
    }

    const localStorage = this.localStorage.load();
    if (localStorage) {
      this.syntaxPreferenceCache = localStorage.enableQuerySyntax;
    } else {
      this.syntaxPreferenceCache = true;
    }

    return this.syntaxPreferenceCache;
  }
}

if (!Initialization.isComponentClassIdRegistered(QuerySyntaxToggle.ID)) {
  Initialization.registerAutoCreateComponent(QuerySyntaxToggle);
}
