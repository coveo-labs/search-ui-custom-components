import {
  ComponentOptions,
  Component,
  Initialization,
  l,
  $$,
  DateUtils,
  IComponentBindings,
  IPopulateBreadcrumbEventArgs,
  BreadcrumbEvents,
  IQuerySuccessEventArgs,
  QueryEvents,
  IBuildingQueryEventArgs,
  IAttributeChangedEventArg,
  Model
} from 'coveo-search-ui';

declare const require: (module: string) => any;
require('./sass/DateRangePicker.scss');
import * as DateRange from 'daterangepicker';
import * as moment from 'moment';
import {SVGIcons } from './utils/SVGIcons';

export interface IInputChangeEventArgs {
  from: number;
  to: number;
  this: any;
}

export class DateRangePickerEvent {
  static inputChange = 'inputChange';
  static clear = 'clear';
}

export interface IDateRangePickerOptions {
  id?: string;
  title?: string;
  field: string;
  format?: string;
  inputPlaceholder?: string;
}

export class DateRangePicker extends Component {
  /**
   * @componentOptions
   */
  static options: IDateRangePickerOptions = {
    /**
     * Specifies a unique identifier for the Component. Among other things, this identifier serves the purpose of saving the
     * component state in the URL hash.
     *
     * Default value is the concatenation of {@link DateRangePicker.options.fieldFrom} and {@link DateRangePicker.options.fieldTo} option value.
     */
    id: ComponentOptions.buildStringOption({
      postProcessing: (value: string, options: IDateRangePickerOptions) => value || _.unique(options.field).join('')
    }),

    /**
     * Specifies the title to display at the top of the Component.
     *
     * Default value is the localized string for `"NoTitle"`.
     */
    title: ComponentOptions.buildLocalizedStringOption({ defaultValue: l('NoTitle') }),

    /**
     * Specifies the index field whose values the Facet should use.
     * This field will be used to filter out all results with inferior value.
     *
     * The field should represent numerical values for this component to work.
     *
     * Default value is the string `"@sysdate"`.
     */
    field: ComponentOptions.buildLocalizedStringOption({ defaultValue: '@sysdate', required: true }),

    /*langCode: ComponentOptions.buildStringOption({ defaultValue: 'en' }),*/

    format: ComponentOptions.buildStringOption({ defaultValue: 'DD-MM-YYYY' }),

    inputPlaceholder: ComponentOptions.buildStringOption({ defaultValue: 'Select a date...' })
  };

  static ID: string = 'DateRangePicker';
  // Default value for from and to
  static DEFAULT: number = -1;

  private pickerFrom: DateRange;
  private inputValue: HTMLInputElement;
  private from: number = DateRangePicker.DEFAULT;
  private to: number = DateRangePicker.DEFAULT;
  //private facetHeader: Coveo.FacetHeader;
  private eraserElement: HTMLElement | undefined;
  private rangePickerQueryStateAttribute: string = '';
 
  /**
   * Creates an instance of RangePicker. Binds multiple query events as well.
   *
   * @param {HTMLElement} element The HTMLElement on which to instantiate the component.
   * @param {IRangePickerOptions} options The options for the Facet component.
   * @param {IComponentBindings} [bindings] The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options: IDateRangePickerOptions, bindings?: IComponentBindings) {
    super(element, DateRangePicker.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, DateRangePicker, options);

    this.initQueryEvents();
    this.initQueryStateEvents();
  }

  createDom() {
    this.buildFacetContent();
    this.updateAppearanceDependingOnState();
  }

  /**
   * Resets the Component by reseting its inputs and redrawing the component.
   *
   * @param {boolean} [executeQuery=true] Specifies whether to execute the query once the component has been reset
   */
  reset(executeQuery: boolean = true) {
    this.ensureDom();
    this.pickerFrom.setStartDate(undefined);
    this.pickerFrom.setEndDate(undefined);
    const range = { from: DateRangePicker.DEFAULT, to: DateRangePicker.DEFAULT, this: this };
    this.inputValue.value = (this.options.inputPlaceholder);
    this.logger.info('reset', executeQuery);
    this.onChange(range, true);
    this.updateAppearanceDependingOnState();
  }

  private buildFacetContent() {

    this.element.appendChild(this.buildHeader());

    this.buildContent();
  }

  private buildContent() {
    const innerContent = $$('div', { className: 'inner-content' });

    innerContent.append(this.buildPickerInputSection());
    this.element.appendChild(innerContent.el);


    this.buildInputFrom(document.getElementById(this.getId('start')));
  }

  private buildPickerInputSection() {
    const inputSection = $$('div', { className: 'coveo-facet-values CoveoInputDateRangePicker' });

    inputSection.append(this.buildPickerinputRow('Start', this.getId('start')));
    return inputSection.el;
  }

  private getId(extra?: string): string {
    let id = `${this.options.id}${extra ? '-' + extra : ''}`;
    return id.replace('@', '');
  }

  private buildPickerinputRow(labelCaption: string, id: string): any {
    const inputRow = $$('div', { className: 'flex input-row' });
    //inputRow.append($$('div', { className: 'input-label' }, '').el);
    this.inputValue = <HTMLInputElement>$$('input', {
      className: 'coveo-facet-search-input',
      type: 'text',
      autocapitalize: 'off',
      autocorrect: 'off',
      id: id,
      value: this.options.inputPlaceholder
  }).el;
    inputRow.append(this.inputValue);
    
    return inputRow.el;
}

private buildHeader(): HTMLElement {
  const header = $$('div', { className: 'coveo-facet-header' });

  const titleSection = $$('div', { className: 'coveo-facet-header-title-section' });
  titleSection.append($$('div', { className: 'coveo-facet-header-title' }, this.options.title as string).el);
  titleSection.append($$('div', { className: 'coveo-facet-header-wait-animation', style: 'visibility:hidden' }).el);
  header.append(titleSection.el);

  header.append(this.buildEraser());
  return header.el;
}

  private buildEraser(): HTMLElement {
    this.eraserElement = $$(
      'div',
      { title: l('Clear', this.options.title), className: 'coveo-facet-header-eraser' },
      SVGIcons.icons.facetClear
    ).el;

    const svgElement = this.eraserElement.querySelector('svg');
    if (svgElement) {
      svgElement.classList.add('coveo-facet-header-eraser-svg');
    }

    

    $$(this.eraserElement).on('click', () => {
      //this.usageAnalytics.logCustomEvent({ name: RangePickerActionCause.facetRangeClear, type: 'customEventType' }, args, this.root);
      this.reset();
    });
    return this.eraserElement;
  }
  private buildInputFrom(id: HTMLElement) {
    var _this = this;
    this.pickerFrom = new DateRange(
      id,
      {
        ranges: {
          Today: [moment(), moment()],
          Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [
            moment()
              .subtract(1, 'month')
              .startOf('month'),
            moment()
              .subtract(1, 'month')
              .endOf('month')
          ]
        },
        autoUpdateInput: false,
        locale: {
          format: this.options.format
        },
        startDate: moment(),
        endDate: moment()
      },
      function(start, end, label) {
        //console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
        const range = {
          from: start ? start.valueOf() : DateRangePicker.DEFAULT,
          to: end ? end.valueOf() : DateRangePicker.DEFAULT,
          this: this,
          executeQuery: false
        };
        $(this.element).val(
          _this.pickerFrom.startDate.format(_this.options.format) + ' - ' + _this.pickerFrom.endDate.format(_this.options.format)
        );
        const executeQuery = range.from !== this.from || range.to !== this.to;
        range.executeQuery = executeQuery;
        _this.onChange(range, executeQuery);
      }
    );
  }

  private updateAppearanceDependingOnState() {
    if (document.getElementById(this.getId('start'))) {
      const isActive = this.from != DateRangePicker.DEFAULT && this.to != DateRangePicker.DEFAULT;
      
      $$(this.eraserElement as HTMLElement).toggleClass('coveo-facet-header-eraser-visible', isActive);
    }
  }

  private onChange(range: IInputChangeEventArgs, executeQuery): void {
    this.queryStateModel.set(this.rangePickerQueryStateAttribute, [range.from,range.to]);
    //Coveo.$(this.element).trigger(DateRangePickerEvent.inputChange, range);
    if (executeQuery) {
      this.triggerNewQuery(function() {
        return '';
      });
    }
  }

  public triggerNewQuery(beforeExecuteQuery: () => void) {
    this.queryController.executeQuery({ ignoreWarningSearchEvent: true, beforeExecuteQuery: beforeExecuteQuery });
  }

  private getQuery(): string | null {
    if (this.from === DateRangePicker.DEFAULT && this.to === DateRangePicker.DEFAULT) {
      return null;
    }

    const query = [];
    if (this.from !== DateRangePicker.DEFAULT) {
      const fromDate = new Date(this.from);
      query.push(this.options.field + ' >= ' + moment(fromDate).format('YYYY/MM/DD'));
    }
    if (this.to !== DateRangePicker.DEFAULT) {
      const toDate = new Date(this.to);
      query.push(this.options.field + ' <= ' + moment(toDate).format('YYYY/MM/DD'));
    }
    return query.join(' AND ');
  }

  private handleBuildingQuery(args: IBuildingQueryEventArgs) {
    const query = this.getQuery();
    if (query !== null) {
      args.queryBuilder.advancedExpression.add(query);
    }
  }

  private handleDeferredQuerySuccess(args: IQuerySuccessEventArgs) {
    this.ensureDom();
    if (this.from === DateRangePicker.DEFAULT) {
      this.pickerFrom.setStartDate(undefined);
    } else {
      this.pickerFrom.setStartDate(new Date(this.from));
    }

    if (this.to === DateRangePicker.DEFAULT) {
      this.pickerFrom.setEndDate(undefined);
    } else {
      this.pickerFrom.setEndDate(new Date(this.to));
    }

    this.updateAppearanceDependingOnState();
  }

  private initQueryEvents() {
    //this.bind.onRoot(RangePickerEvent.inputChange, (args: RangePickerEvent) => {
      // this.queryStateModel.set(this.rangePickerQueryStateAttribute, args);
    //});
    this.bind.onRootElement(QueryEvents.deferredQuerySuccess, (args: IQuerySuccessEventArgs) => this.handleDeferredQuerySuccess(args));
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(BreadcrumbEvents.populateBreadcrumb, (args: IPopulateBreadcrumbEventArgs) =>
      this.handlePopulateBreadcrumb(args)
    );
    this.bind.onRootElement(BreadcrumbEvents.clearBreadcrumb, () => this.handleClearBreadcrumb());

  }

  private initQueryStateEvents() {
    this.rangePickerQueryStateAttribute = this.options.id + ':daterangePicker';

    this.queryStateModel.registerNewAttribute(this.rangePickerQueryStateAttribute,[]);
    //DateRangePicker.DEFAULT, to: DateRangePicker.DEFAULT }]);
    const eventName = this.queryStateModel.getEventName(Model.eventTypes.changeOne + this.rangePickerQueryStateAttribute);

    this.bind.onRootElement(eventName, (args: IAttributeChangedEventArg) => {
      this.handleQueryStateChanged(args.value);
    });
  }

  private handleQueryStateChanged(state: IInputChangeEventArgs) {
    this.ensureDom();
    const from = Number(state[0]);
    const to = Number(state[1]);

    if (!isNaN(from) && DateUtils.isValid(new Date(from))) {
      this.from = from;
    } else {
      this.from = DateRangePicker.DEFAULT;
    }

    if (!isNaN(to) && DateUtils.isValid(new Date(to))) {
      this.to = to;
    } else {
      this.to = DateRangePicker.DEFAULT;
    }
  }

  private handlePopulateBreadcrumb(args: IPopulateBreadcrumbEventArgs) {
    const breadcrumb = this.populateBreadcrumb();
    if (breadcrumb !== null) {
      args.breadcrumbs.push({
        element: breadcrumb
      });
    }
  }

  private hasEmptyState(): boolean {
    return this.from === DateRangePicker.DEFAULT && this.to === DateRangePicker.DEFAULT;
  }

  private populateBreadcrumb(): HTMLElement | null {
    if (this.hasEmptyState()) {
      return null;
    }

    const range: string[] = [];

    /* Here, handling date format;
        - we dont have at this level the same library as in CustomDatePicker to handle the date format string
        - we are therefore using the values generated by CustomDatePicker
    */
    if (this.from !== DateRangePicker.DEFAULT) {
      const fromDate = new Date(this.from);
      try {
        range.push(l('From').toLowerCase() + ' ' + moment(fromDate).format(this.options.format));
      } catch (e) {
        //range.push('from ' + DateUtils.dateForQuery(fromDate));
      }
    }

    if (this.to !== DateRangePicker.DEFAULT) {
      const toDate = new Date(this.to);
      try {
        range.push(l('To').toLowerCase() + ' ' + moment(toDate).format(this.options.format));
      } catch (e) {
        //range.push('to ' + DateUtils.dateForQuery(toDate));
      }
    }

    const element = $$('div', { className: 'coveo-facet-breadcrumb coveo-breadcrumb-item vin-breadcrumb' });

    const title = $$('span', { className: 'coveo-facet-breadcrumb-title' }, this.options.title + ': ');
    element.append(title.el);
    
    const value = $$('span', { className: 'coveo-facet-breadcrumb-value coveo-selected' });
    title.append(value.el);

    value.on('click', () => {
      this.reset();
    });

    const caption = $$('span', { className: 'coveo-facet-breadcrumb-caption' }, range.join(' - '));
    value.append(caption.el);

    const eraser = $$('span', { className: 'coveo-facet-breadcrumb-clear' }, SVGIcons.icons.facetClear);
    value.append(eraser.el);

    return element.el;
    
    //return element.get(0);
  }

  private handleClearBreadcrumb() {
    this.reset(false);
  }
}


Initialization.registerAutoCreateComponent(DateRangePicker);
