export class Scroller {
  node: any = null;
  constructor($node) {
    this.node = $node;
    this.$('.s-left').on('click', this.scroll.bind(this, -315));
    this.$('.s-right').on('click', this.scroll.bind(this, 315));
    this.$('.s-content').on('scroll', this.updateScroll.bind(this));
  }

  $(str) {
    return this.node.find(str);
  }
  scroll(delta) {
    let $c = this.$('.s-content');
    let pos = $c.scrollLeft() + (delta || 50);
    $c.animate({ scrollLeft: pos }, 200);
  }

  updateScroll() {
    let $c = this.$('.s-content');
    let pos = $c.scrollLeft();
    let w = $c.width();
    this.$('.s-left').toggle(pos > 0);
    this.$('.s-right').toggle(pos < $c[0].scrollWidth - w);
  }
}
