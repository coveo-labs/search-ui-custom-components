import Component = Coveo.Component;
import Initialization = Coveo.Initialization;
import ComponentOptions = Coveo.ComponentOptions;
import IComponentBindings = Coveo.IComponentBindings;
import $$ = Coveo.$$;

export interface ISortDropdownOptions {
  caption: string;
  displayCaption?: boolean;
  displayAsSelect?: boolean;
}

declare const require: (module: string) => any;
require('./SortDropdown.scss');

export class SortDropdown extends Component {
  static ID = 'SortDropdown';
  static options: ISortDropdownOptions = {
    caption: ComponentOptions.buildStringOption({ defaultValue: Coveo.l('SortBy') }),
    displayCaption: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    displayAsSelect: ComponentOptions.buildBooleanOption({ defaultValue: false })
  };

  private currentSearchSort: string;
  private select: HTMLSelectElement;
  private selectStyled: Coveo.Dom;
  private listOptions: Coveo.Dom;

  constructor(public element: HTMLElement, public options: ISortDropdownOptions, public bindings: IComponentBindings) {
    super(element, SortDropdown.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, SortDropdown, options);
    // Init Events
    this.bind.onRootElement(Coveo.InitializationEvents.afterInitialization, this.handleAfterInit);
    // State Events
    let changeSortEvtName = this.getStateEventName(Coveo.QueryStateModel.eventTypes.changeOne + Coveo.QueryStateModel.attributesEnum.sort);
    this.bind.onRootElement(changeSortEvtName, (args: Coveo.IAttributeChangedEventArg) => this.handleCoveoStateChanged(args));
    // Query Events
    this.bind.onRootElement(Coveo.QueryEvents.querySuccess, (args: Coveo.IQuerySuccessEventArgs) => this.handleQuerySuccess(args));
    this.bind.onRootElement(Coveo.QueryEvents.queryError, (args: Coveo.IQueryErrorEventArgs) => this.handleQueryError(args));
    if (this.options.displayCaption) {
      Coveo.$$(this.element).append(this.buildLabel());
    }
    this.select = this.buildSelectElement();
    if (!this.options.displayAsSelect) {
      Coveo.$$(this.select).addClass('coveo-custom-select-hidden');
    }
    Coveo.$$(this.element).append(this.select);
  }

  private handleCoveoStateChanged(args: Coveo.IAttributeChangedEventArg) {
    this.currentSearchSort = args.value;
  }

  private handleQuerySuccess(data: Coveo.IQuerySuccessEventArgs) {
    if (data.results.results.length == 0) {
      $$(this.element).addClass('coveo-sort-hidden');
    } else {
      $$(this.element).removeClass('coveo-sort-hidden');
    }
  }

  private handleQueryError(data: Coveo.IQueryErrorEventArgs) {
    $$(this.element).addClass('coveo-sort-hidden');
  }

  private getStateEventName(event: string) {
    return Coveo.QueryStateModel.ID + ':' + event;
  }

  private handleAfterInit() {
    this.buildSelectOptions();
    if (!this.options.displayAsSelect) {
      this.buildStyledSelect();
    }
  }

  private buildStyledSelect() {
    const wrapper = Coveo.$$('div', { className: 'coveo-custom-select' });
    this.select.parentNode.insertBefore(wrapper.el, this.select);
    wrapper.append(this.select);
    this.selectStyled = Coveo.$$('div', { className: 'coveo-custom-select-styled' });
    this.listOptions = Coveo.$$('ul', { className: 'coveo-custom-select-options' });
    wrapper.append(this.selectStyled.el);
    wrapper.append(this.listOptions.el);
    this.renderSelectStyled();

    this.selectStyled.on('click', (e) => {
      e.stopPropagation();
      this.selectStyled.toggleClass('active');
      this.listOptions.toggle();
    });

    document.addEventListener('click', () => {
      this.selectStyled.removeClass('active');
      this.listOptions.hide();
    });
  }

  private renderSelectStyled() {
    const self = this;
    self.listOptions.empty();
    // Hack for Typescript issue
    var opt: any = this.select.options;
    const current = opt.length ? opt[self.select.selectedIndex].text : '';
    self.selectStyled.text(current);

    for (var i = 0; i < opt.length; i++) {
      const listItem = Coveo.$$('li', {
        value: opt.item(i).value
      }, opt.item(i).text);
      self.listOptions.append(listItem.el);

      if (current == opt.item(i).text) {
        listItem.addClass('active');
      }
      listItem.on('click', (e) => {
        e.stopPropagation();
        self.select.value = listItem.getAttribute('value');
        self.updateSort(listItem.getAttribute('value'));
        self.selectStyled.text(listItem.text());
        self.selectStyled.removeClass('active');
        _.each(self.listOptions.children(), (li) => { Coveo.$$(li).removeClass('active'); });
        listItem.addClass('active');
        self.listOptions.hide();
      });
    }
  }

  private buildLabel() {
    const label = Coveo.$$('span', { className: 'coveo-custom-sort-dropdown-text' }, this.options.caption).el;
    return label;
  }

  private buildSelectElement() {
    const selectEl = Coveo.$$('select', { className: 'coveo-custom-sort-dropdown-picker' });
    const changeAction = () => this.handleSelectChangeCriteria();
    selectEl.on('change', changeAction);
    return <HTMLSelectElement>selectEl.el;
  }

  private buildSelectOptions() {
    Coveo.$$(this.select).empty();
    let sorts = this.element.querySelectorAll('.CoveoSort:not(.coveo-tab-disabled):not(.coveo-sort-hidden)');
    _.each(sorts, (Sort) => {
      const sort = <Coveo.Sort>Coveo.get(<HTMLElement>Sort, 'Sort');
      let selectedOption: boolean;
      sort.options.sortCriteria.forEach(crit => {
        const key = (crit.sort + ' ' + crit['direction']).trim();
        if (key == this.currentSearchSort) {
          selectedOption = true;
        }
      });

      const optionLink = <HTMLOptionElement>Coveo.$$('option', { value: sort.options.caption }, sort.options.caption).el;
      if (selectedOption) {
        optionLink.selected = true;
      }
      Coveo.$$(this.select).append(optionLink);
    });
  }
  private handleSelectChangeCriteria() {
    var sortCaption = (<HTMLSelectElement>(event.currentTarget)).value;
    this.updateSort(sortCaption);
  };

  private updateSort(value: string) {
    let sorts = this.element.querySelectorAll('.CoveoSort:not(.coveo-tab-disabled):not(.coveo-sort-hidden)');
    _.each(sorts, (Sort) => {
      const sort = <Coveo.Sort>Coveo.get(<HTMLElement>Sort, 'Sort');
      if (value == sort.options.caption) {
        sort.element.click();
      }
    });
  }
}

Initialization.registerAutoCreateComponent(SortDropdown);
