import {
  IQueryResult,
  $$,
  IComponentBindings,
  ComponentOptions,
  Component,
  Initialization
} from 'coveo-search-ui';

declare const require: (module: string) => any;
require('./RelevancyIndicator.scss');

export interface IRelevancyIndicatorOptions {
  threshold: number;
  caption: string;
  hideCaption: boolean;
}

export class RelevancyIndicator extends Component implements IComponentBindings {
  static ID = 'RelevancyIndicator';
  static options: IRelevancyIndicatorOptions = {
    threshold: ComponentOptions.buildNumberOption({ defaultValue: 60 }),
    caption: ComponentOptions.buildStringOption({ defaultValue: 'Relevancy Indicator' }),
    hideCaption: ComponentOptions.buildBooleanOption({ defaultValue: false })
  };

  constructor(
    public element: HTMLElement,
    public options: IRelevancyIndicatorOptions,
    public bindings?: IComponentBindings,
    public result?: IQueryResult
  ) {
    super(element, RelevancyIndicator.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, RelevancyIndicator, options);

    this.element.appendChild(this.build());
  }

  private build(): HTMLElement {
    const progressBlock = $$('div', { className: 'progress-block' });
    const progress = $$('div', { className: 'progress' });
    progress.append(
      $$('progress', { value: this.getScore(), className: `threshold-${this.isOverThreshold() ? 'over' : 'under'}`, max: 100 }).el
    );

    if (!this.options.hideCaption) {
      progressBlock.append($$('label', {}, this.options.caption).el);
    }
    progressBlock.append(progress.el);

    return progressBlock.el;
  }

  private isOverThreshold(): boolean {
    return this.getScore() > this.options.threshold;
  }
  private getScore(floor = false): number {
    const score = (this.result as any).percentScore;
    return floor ? Math.floor(score) : score;
  }
}

Initialization.registerAutoCreateComponent(RelevancyIndicator);
