import Component = Coveo.Component;
import Initialization = Coveo.Initialization;
import ComponentOptions = Coveo.ComponentOptions;
import IComponentBindings = Coveo.IComponentBindings;
import IBuildingQueryEventArgs = Coveo.IBuildingQueryEventArgs;

export interface ICustomContextOptions {
  context: any
}

/**
* Required customization specifically applied for your implementation
*/
export class CustomContext extends Component {

  static ID = 'CustomContext';
  static options: ICustomContextOptions = {
    context: ComponentOptions.buildJsonObjectOption({
      defaultValue: {}
    })
  };

  constructor(public element: HTMLElement, public options: ICustomContextOptions, public bindings?: IComponentBindings) {
    super(element, CustomContext.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, CustomContext, options);
    this.bind.onRootElement(Coveo.QueryEvents.buildingQuery, (data: IBuildingQueryEventArgs) => this.handleBuildingQuery(data));
  }

  /**
  * Building Query
  */
  private handleBuildingQuery(args: IBuildingQueryEventArgs) {
    var i = this.options.context.length;
    while (i--) {
      if (this.options.context[i] === "" || this.options.context[i] === null) {
        this.options.context.splice(i, 1);
      }
    }
    args.queryBuilder.addContext(this.options.context);
  }
};

Initialization.registerAutoCreateComponent(CustomContext);