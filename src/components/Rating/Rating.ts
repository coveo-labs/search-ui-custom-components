import {
  Component,
  ComponentOptions,
  IComponentBindings,
  IFieldOption,
  IQueryResult,
  Utils,
} from 'coveo-search-ui';

require('./Rating.scss');

export interface IRatingOptions {
  field: IFieldOption;
}

export class Rating extends Component {
  static ID = 'Rating';
  static options: IRatingOptions = {
    field: ComponentOptions.buildFieldOption({
      defaultValue: '@ratings'
    })
  };
  public constructor(public element: HTMLElement, public options: IRatingOptions, public bindings: IComponentBindings, public result: IQueryResult) {
    super(element, Rating.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, Rating, options);
    this.result = result;

    const rating: number =  Utils.getFieldValue(this.result, this.options.field as string);

    const starsChar = '&bigstar;';
    let stars = '<span class="rating">';
    for (let i = 0; i < rating; i++) {
      stars += starsChar;
    }

    stars += '</span>';
    for (let i = rating; i < 5; i++) {
      stars += `&star;`;
    }

    // add the stars in the page
    this.element.innerHTML = stars;
  }
}

Coveo.Initialization.registerAutoCreateComponent(Rating);
Coveo.Initialization.registerComponentFields(Rating.ID, ['ratings']);
