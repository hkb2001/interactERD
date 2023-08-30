import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as joint from 'jointjs';

class ERDVisualization extends Component {
  componentDidMount() {
    this.createDiagram();
  }

  createCustomShape(x, y, tableName, entityNames) {
    const shape = new joint.shapes.basic.Rect({
      position: { x, y },
      size: { width: 250, height: 150 }, // Adjust the size as needed
      attrs: {
        rect: { fill: 'white', stroke: 'black', 'stroke-width': 2 },
        text: { text: tableName, 'font-size': 14, 'font-weight': 'bold' },
      },
    });

    // Create a separate text block for displaying entities and attributes
    const contentText = new joint.shapes.basic.TextBlock({
      position: { x: x + 5, y: y + 30 }, // Adjust positioning
      size: { width: 40, height: 40 }, // Adjust size
      attrs: {
        text: {
          text: `Entities:\n${entityNames.join('\n')}`,
          'font-size': 12,
        },
      },
    });

    shape.embed(contentText); // Embed text block inside the shape

    return shape;
  }

  createDiagram() {
    const graph = new joint.dia.Graph();
    const paper = new joint.dia.Paper({
      el: ReactDOM.findDOMNode(this.refs.placeholder),
      width: 1200,
      height: 600,
      model: graph,
    });

    const shapeA = this.createCustomShape(100, 100, 'Table A', ['Entity 1', 'Entity 2']);
    const shapeB = this.createCustomShape(300, 300, 'Table B', ['Entity 3', 'Entity 4']);
    const shapeC = this.createCustomShape(400, 400, 'Table C', ['Entity 5', 'Entity 6']);

    const link = new joint.dia.Link({
      source: { id: shapeA.id },
      target: { id: shapeB.id },
    });

    graph.addCell(shapeA);
    graph.addCell(shapeB);
    graph.addCell(link);
  }

  render() {
    return <div ref="placeholder" />;
  }
}

export default ERDVisualization;
