import Component = Coveo.Component;
import Initialization = Coveo.Initialization;
import ComponentOptions = Coveo.ComponentOptions;
import IComponentBindings = Coveo.IComponentBindings;
import IStringMap = Coveo.IStringMap;

export interface ICustomContextOptions {
  context: IStringMap<any>
}

/**
* Required customization specifically applied for your implementation
*/
export class CustomContext extends Component {

  static ID = 'CustomContext';
  static options: ICustomContextOptions = {
    context: Coveo.ComponentOptions.buildJsonObjectOption()
  };

  private pipelineContext: Coveo.PipelineContext;

  constructor(public element: HTMLElement, public options: ICustomContextOptions, public bindings?: IComponentBindings) {
    super(element, CustomContext.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, CustomContext, options);
    this.pipelineContext = new Coveo.PipelineContext(this.element, {}, bindings);
    this.setupPipelineContext(this.options.context);
  }

  public setupPipelineContext(data: IStringMap<any>) {
    this.pipelineContext.setContext(_.pick(data, _.identity) || {});
  }

  public getPipelineContext() {
    return this.searchInterface.getQueryContext();
  }
};

Initialization.registerAutoCreateComponent(CustomContext);