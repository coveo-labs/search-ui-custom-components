declare function require(svgPath: string): string;

export class SVGIcons {
  public static icons = {
    facetClear: require(`../assets/svg/facet-clear.svg`),
    calendar: require(`../assets/svg/calendar.svg`)
  };
}
