export function fixBoundingBox(): void {
  /**
   * Sets the bounding box of the rendered SVG to neatly contain its contents.
   */
  setTimeout(() => {
    const svgs: NodeListOf<SVGGraphicsElement> = document.querySelectorAll("#render");
    // Get internal size of SVG
    svgs.forEach(svg => {
      const bbox = svg.getBBox();
      // Construct and set a viewBox for the SVG
      const viewBox = [bbox.x, bbox.y, bbox.width, bbox.height].join(" ");
      svg.setAttribute("viewBox", viewBox);
    })
  }, 1);
}
