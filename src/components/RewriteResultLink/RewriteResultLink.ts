import Component = Coveo.Component;
import ComponentOptions = Coveo.ComponentOptions;
import IQueryResult = Coveo.IQueryResult;
import IResultsComponentBindings = Coveo.IResultsComponentBindings;
import Initialization = Coveo.Initialization;

export interface IRewriteResultLinkOptions extends Coveo.IResultLinkOptions {
  find?: string[];
  replace?: string[];
}

export class RewriteResultLink extends Component {
  static ID = 'RewriteResultLink';

  static options: IRewriteResultLinkOptions = {
    find: Coveo.ComponentOptions.buildListOption(),
    replace: Coveo.ComponentOptions.buildListOption()
  };

  constructor(
    public element: HTMLElement,
    public options: IRewriteResultLinkOptions,
    bindings?: IResultsComponentBindings,
    public result?: IQueryResult
  ) {
    super(element, RewriteResultLink.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, RewriteResultLink, options);
    this.result = result;
    if (this.options.find.length!=this.options.replace.length){
      this.logger.info('Bad Configuration, Find and replace do not match', this.options);
    }
    this.applyUrlRewriter();
    new Coveo.ResultLink(this.element, this.options, bindings, result);
  }

  private rewrite( regex: RegExp, subst:string ){
    // The substituted value will be contained in the result variable
    this.result.clickUri = this.result['ClickUri'] = this.result.clickUri.replace(regex, subst);
    this.result.printableUri = this.result['PrintableUri'] = this.result.printableUri.replace(regex, subst);
    this.result.uri = this.result['Uri'] = this.result.uri.replace(regex, subst);
    // Change childs
    var child = this.result.childResults;
    if (child && child.length) {
      for (var i = 0; i < child.length; i++) {
        this.result.childResults[i].clickUri = this.result.childResults[i]['ClickUri'] = this.result.childResults[i].clickUri.replace(regex, subst);
        this.result.childResults[i].printableUri = this.result.childResults[i]['PrintableUri'] = this.result.childResults[i].printableUri.replace(regex, subst);
        this.result.childResults[i].uri = this.result.childResults[i]['Uri'] = this.result.childResults[i].uri.replace(regex, subst);
      }
    }
    // Change attachments
    var att = this.result.attachments;
    if (att && att.length) {
      for (var i = 0; i < att.length; i++) {
        this.result.attachments[i].clickUri = this.result.attachments[i]['ClickUri'] = this.result.attachments[i].clickUri.replace(regex, subst);
        this.result.attachments[i].printableUri = this.result.attachments[i]['PrintableUri'] = this.result.attachments[i].printableUri.replace(regex, subst);
        this.result.attachments[i].uri = this.result.attachments[i]['Uri'] = this.result.attachments[i].uri.replace(regex, subst);
      }
    }
  }

  private applyUrlRewriter() {
    for (var i = 0; i < this.options.find.length; i++) {
      this.rewrite( new RegExp(this.options.find[i], 'gm'), this.options.replace[i]);
    }
  }
}


Initialization.registerAutoCreateComponent(RewriteResultLink);
