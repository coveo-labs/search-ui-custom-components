import {
  l,
  logCustomEvent,
  state,
  $$,
  LocalStorageUtils,
  StringUtils,
  IQuerySuccessEventArgs,
  QueryEvents,
  IComponentBindings,
  ComponentOptions,
  Component,
  Initialization
} from 'coveo-search-ui';

declare const require: (module: string) => any;
require('./SearchHistory.scss');

export interface ISearchHistoryOptions {
  caption: string;
  numberOfQueries: number;
}

export class SearchHistory extends Component {
  static ID = 'SearchHistory';

  static options: ISearchHistoryOptions = {
    caption: ComponentOptions.buildStringOption(),
    numberOfQueries: ComponentOptions.buildNumberOption({ defaultValue: 10 })
  };

  private queriesList: string[] = [];
  private queriesListHTMLElement: HTMLElement | null = null;
  private localStorage: any;
  private refreshList: boolean = true;

  constructor(public element: HTMLElement, public options: ISearchHistoryOptions, public bindings: IComponentBindings) {
    super(element, SearchHistory.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, SearchHistory, options);
    this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.handleQuerySuccess(args));

    this.hide();
    this.initLocalStorage();
    this.build();
  }

  private initLocalStorage() {
    this.localStorage = new LocalStorageUtils('SearchHistory');
    this.queriesList = JSON.parse(this.localStorage.load()) || [];
  }

  private hide() {
    $$(this.element).addClass('hidden');
  }

  private show() {
    $$(this.element).removeClass('hidden');
  }

  private handleQuerySuccess(args: IQuerySuccessEventArgs) {
    const query = args.queryBuilder.expression.build();
    if (this.refreshList && args.results.results.length > 0) {
      this.show();
      this.updateQueriesList(query);
    } else {
      this.hide();
    }

    $$(this.element).toggleClass('hidden', this.queriesList.length === 0);
    this.refreshList = true;
  }

  private handleHistoryClick(expression: string) {
    this.refreshList = false;
    state(this.root, 'q', expression);
    this.queryController.deferExecuteQuery({
      beforeExecuteQuery: () => {
        logCustomEvent(
          this.root,
          { name: 'searchFromHistory', type: 'customEventType' },
          {
            queryHistory: expression
          }
        );
      }
    });
  }

  private updateQueriesList(query: string) {
    this.queriesList = _.chain(this.queriesList)
      .push(query)
      .compact()
      .uniq()
      .last(this.options.numberOfQueries + 1)
      .value();
    this.localStorage.save(JSON.stringify(this.queriesList));

    this.buildPreviousQueries(this.queriesList);
  }

  public build() {
    this.queriesListHTMLElement = $$('ul', { class: 'coveo-facet-values' }).el;

    this.element.append(this.buildPanelHeading());
    this.element.append(this.queriesListHTMLElement);
  }

  public buildPanelHeading(): HTMLElement {

    const caption: string = this.options.caption || l('SearchHistory');

    const header = $$('div', { className: 'coveo-facet-header' });
    const titleSection = $$('div', { className: 'coveo-facet-header-title-section' });

    const titleCaption = $$('div', { className: 'coveo-facet-header-title' }, caption);
    titleCaption.prepend($$('i', { className: 'fas fa-history' }).el);
    titleSection.append(titleCaption.el);
    header.append(titleSection.el);

    return header.el;
  }

  public buildPreviousQueries(list: any[]) {
    if (this.queriesListHTMLElement) {
      this.queriesListHTMLElement.innerHTML = '';
      _.each(this.queriesList, expression => {
        // if (expression !== state(this.root, 'q')) {
        const listItemCaption = $$('label', { className: 'coveo-facet-value-label' }, StringUtils.htmlEncode(expression));
        const listItem = $$('li', { className: 'coveo-facet-value coveo-facet-selectable' });
        listItem.append(listItemCaption.el);

        listItem.on('click', () => this.handleHistoryClick(expression));

        $$(this.queriesListHTMLElement as HTMLElement).prepend(listItem.el);
        // }
      });
    } else {
      this.logger.error('queriesListHTMLElement is null');
    }
  }
}

Initialization.registerAutoCreateComponent(SearchHistory);
