## Basic Usage

RelevancyIndicator will display a progress bar based on the percentScore value.

```
<div class="CoveoRelevancyIndicator"></div>
```


## Options

### threshold (optional) : _number_
Specifies the threshold used to determine at which percentage the progress bar color should change. If the threshold is set to 50% for instance, the progress bar color will change to yellow for every document for which the `percentScore` value is under 50%.

Example: `data-threshold="75"`

Default value is the boolean `60`.

### caption (optional) : _string_
Specifies text caption to display beside the progress bar. This option will not work if the `hideCaption` option is set to `true`.

Example: `data-caption="Score"`

Default value is the boolean `Relevancy Indicator`.

### hideCaption (optional) : _boolean_

Whether to hide the text caption beside the rrogress bar.

Example: `data-hide-caption='true'`

Default value is the boolean `false`.

