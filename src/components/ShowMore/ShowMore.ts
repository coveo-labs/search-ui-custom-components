import {
  get,
  Component,
  Dom,
  ComponentOptions,
  IComponentBindings,
  IQuerySuccessEventArgs,
  QueryEvents,
  ResultListEvents,
  InitializationEvents,
  ResultList,
  Initialization,
  $$
} from 'coveo-search-ui';

export interface ILoadMoreOptions {
  caption?: string;
  count?: number;
}

declare const require: (module: string) => any;
require('./ShowMore.scss');

export class ShowMore extends Component implements IComponentBindings {
  static ID = 'ShowMore';
  private button: Dom;

  static options: ILoadMoreOptions = {
    caption: ComponentOptions.buildStringOption(),
    count: ComponentOptions.buildNumberOption()
  };

  constructor(public element: HTMLElement, public options: ILoadMoreOptions, public bindings: IComponentBindings) {
    super(element, ShowMore.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, ShowMore, options);

    this.button = $$('div', { className: 'btn spaced-box' }, this.options.caption || 'Show More');
    this.button.on('click', () => this.loadMore());
    this.element.appendChild(this.button.el);

    this.bindEvents();
  }

  private bindEvents() {
    this.bind.onRootElement(ResultListEvents.newResultsDisplayed, () => this.handleNewResultsDisplayed());
    this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.handleQuerySuccess(args));
    this.bind.onRootElement(InitializationEvents.afterInitialization, () => this.handleAfterComponentsInitialization());
  }

  private handleQuerySuccess(args: IQuerySuccessEventArgs) {
    if (args.query.numberOfResults && args.results.totalCount > args.query.numberOfResults) {
      this.button.show();
    } else {
      this.button.hide();
    }
  }

  private handleAfterComponentsInitialization() {
    if (this.resultList) {
      this.resultList.options.enableInfiniteScroll = true;
    }
  }

  private handleNewResultsDisplayed() {
    if (this.resultList && !this.resultList.hasPotentiallyMoreResultsToDisplay()) {
      this.button.hide();
    }
  }

  public loadMore() {
    this.resultList ? this.resultList.displayMoreResults(this.options.count || 10) : null;
  }

  public get resultList(): ResultList | null {
    const resultListElement = $$(this.root).find('.CoveoResultList');
    if (resultListElement) {
      return get(resultListElement) as ResultList;
    }
    return null;
  }
}

Initialization.registerAutoCreateComponent(ShowMore);
