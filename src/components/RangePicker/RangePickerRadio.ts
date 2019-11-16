import $$ = Coveo.$$;
import Dom = Coveo.Dom;
import Assert = Coveo.Assert;
import l = Coveo.l;
import { IRadioSelectEventArgs, RangePickerEvent } from './events/RangePickerEvents';

export interface IRangePickerRadioOptions {
  todayCaption?: string;
  thisWeekCaption?: string;
  lastWeekCaption?: string;
  thisMonthCaption?: string;
}

/**
 * Radio Option
 *
 * @class RadioOption
 */
class RadioOption {
  private element: Dom | undefined;
  private radioInput: Dom | undefined;

  constructor(private value: string, private label: string) {}

  getValue() {
    return this.value;
  }

  isChecked(): boolean {
    Assert.exists(this.radioInput);
    return ((this.radioInput as Dom).el as HTMLInputElement).checked;
  }

  check() {
    if (this.radioInput) {
      (this.radioInput.el as HTMLInputElement).checked = true;
    }
  }

  uncheck() {
    if (this.radioInput) {
      (this.radioInput.el as HTMLInputElement).checked = false;
    }
  }

  appendToParent(parent: Dom): void {
    Assert.exists(this.element);
    parent.append((this.element as Dom).el);
  }

  build() {
    this.element = $$('div', { className: 'radio-option' });
    this.radioInput = $$('input', { name: 'enabledOptions', type: 'radio', id: this.label });
    this.element.append(this.radioInput.el);
    this.element.append($$('label', { for: this.label }, this.label).el);
    return this.element;
  }
}

/**
 * Radio Option List
 *
 * @export
 * @class RangePickerRadio
 */
export class RangePickerRadio {
  static TODAY: string = 'today';
  static THIS_WEEK: string = 'thisweek';
  static LAST_WEEK: string = 'lastweek';
  static THIS_MONTH: string = 'thismonth';

  // Radio Button Element
  private radioOptions: RadioOption[] = [];

  constructor(private root: HTMLElement, private options: IRangePickerRadioOptions) {}

  build(): HTMLElement {
    const formGroup = $$('fieldset', { className: 'form-group' });
    const fromControl = $$('div', { className: 'form-control radio-select' });
    formGroup.append(fromControl.el);

    this.radioOptions = [
      this.buildRadioButton(RangePickerRadio.TODAY, this.options.todayCaption || l(RangePickerRadio.TODAY)),
      this.buildRadioButton(RangePickerRadio.THIS_WEEK, this.options.thisWeekCaption || l(RangePickerRadio.THIS_WEEK)),
      this.buildRadioButton(RangePickerRadio.LAST_WEEK, this.options.lastWeekCaption || l(RangePickerRadio.LAST_WEEK)),
      this.buildRadioButton(RangePickerRadio.THIS_MONTH, this.options.thisMonthCaption || l(RangePickerRadio.THIS_MONTH))
    ];

    _.each(this.radioOptions, (radio: RadioOption, idx: number) => {
      radio.appendToParent(fromControl);
    });

    return formGroup.el;
  }

  private buildRadioButton(value: string, label: string): RadioOption {
    const radioOption = new RadioOption(value, label);
    const radioOptionEl = radioOption.build();
    radioOptionEl.on('click', () => this.onRadioChange(radioOption));
    return radioOption;
  }

  reset() {
    _.each(this.radioOptions, (radioOption: RadioOption) => {
      radioOption.uncheck();
    });
  }

  setValue(position: number) {
    Assert.check(this.isValid(position), `Position should be a number from 0 and ${this.radioOptions.length}`);
    this.reset();
    this.radioOptions[position].check();
  }

  isValid(position: number): boolean {
    return position < this.radioOptions.length;
  }

  private onRadioChange(radioOption: RadioOption) {
    let radioFrom;
    let radioTo;

    const selectedFilter = radioOption.getValue();

    if (selectedFilter === RangePickerRadio.THIS_MONTH) {
      radioFrom = this.getThisMonthFirstDay().getTime();
      radioTo = this.getThisMonthLastDay().getTime();
    } else if (selectedFilter === RangePickerRadio.THIS_WEEK) {
      radioFrom = this.getThisWeekFirstDay().getTime();
      radioTo = this.getThisWeekLastDay().getTime();
    } else if (selectedFilter === RangePickerRadio.LAST_WEEK) {
      radioFrom = this.getLastWeekFirstDay().getTime();
      radioTo = this.getLastWeekLastDay().getTime();
    } else {
      // today
      radioFrom = new Date().getTime();
      radioTo = new Date().getTime();
    }

    const radioValue = this.radioOptions.indexOf(radioOption);

    const args: IRadioSelectEventArgs = {
      from: radioFrom,
      to: radioTo,
      radio: radioValue
    };

    $$(this.root).trigger(RangePickerEvent.radioSelect, args);
  }

  private getThisMonthFirstDay() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
  private getThisMonthLastDay() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }
  private getLastWeekFirstDay() {
    const date = new Date();
    return new Date(date.getTime() - (6 + (date.getDay() || 7)) * 24 * 60 * 60 * 1000);
  }
  private getLastWeekLastDay() {
    const date = new Date();
    return new Date(date.getTime() - date.getDay() * 24 * 60 * 60 * 1000);
  }
  private getThisWeekFirstDay() {
    const curr = new Date();
    return new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
  }
  private getThisWeekLastDay() {
    const curr = new Date();
    return new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));
  }
}
