export interface IRangePickerAnalyticsArgs {
  rangeFieldTo: string;
  rangeFieldFrom: string;
  rangePickerTitle: string;
  rangePickerState: string;
}

export interface IInputChangeEventArgs {
  from: number;
  to: number;
}

export interface IRadioSelectEventArgs extends IInputChangeEventArgs {
  radio: number;
}

export class RangePickerEvent {
  static inputChange = 'inputChange';
  static radioSelect = 'radioSelect';
  static clear = 'clear';
}

export class RangePickerActionCause {
  static facetRangeClear = 'facetRangeClear';
  static facetRangeRadioSelect = 'facetRangeRadioSelect';
  static facetRangeInputChange = 'facetRangeInputChange';
}
