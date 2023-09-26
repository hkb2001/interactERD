import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as joint from 'jointjs';

function ERDVisualization() {
  const [tables, setTables] = useState([
    { id: 1, tableName: 'Table A', entityNames: ['Entity 1', 'Entity 2'] },
    { id: 2, tableName: 'Table B', entityNames: ['Entity 3', 'Entity 4'] },
  ]);

  const [newTableData, setNewTableData] = useState({
    tableName: '',
    entityNames: '', // Store it as a comma-separated string
  });

  const [selectedTableId, setSelectedTableId] = useState(null); // Store the selected table ID for linking

  const diagramRef = useRef(null); // Create a ref for the diagram container

  useEffect(() => {
    createDiagram();
  }, [tables]);

  function createCustomShape(x, y, tableName, entityNames) {
    const shape = new joint.shapes.basic.Rect({
      position: { x, y },
      size: { width: 250, height: 150 },
      attrs: {
        rect: { fill: 'white', stroke: 'black', 'stroke-width': 2 },
        text: { text: tableName, 'font-size': 14, 'font-weight': 'bold' },
      },
    });

    let entityNamesArray = [];

    // Check if entityNames is a string, then split it
    if (typeof entityNames === 'string') {
      entityNamesArray = entityNames.split(',');
    } else if (Array.isArray(entityNames)) {
      entityNamesArray = entityNames;
    }

    const contentText = new joint.shapes.basic.TextBlock({
      position: { x: x + 5, y: y + 30 },
      size: { width: 40, height: 40 },
      attrs: {
        text: {
          text: `Entities:\n${entityNamesArray.join('\n')}`, // Convert back to an array
          'font-size': 12,
        },
      },
    });

    shape.embed(contentText);

    return shape;
  }

  function createDiagram() {
    const graph = new joint.dia.Graph();
    const paper = new joint.dia.Paper({
      el: diagramRef.current, // Use the ref for the diagram container
      width: 1200,
      height: 600,
      model: graph,
    });

    tables.forEach((table, index) => {
      // Split the comma-separated string back into an array
      const entityNamesArray = Array.isArray(table.entityNames) ? table.entityNames : table.entityNames.split(',');

      const shape = createCustomShape(
        100 + index * 200,
        100 + index * 100,
        table.tableName,
        entityNamesArray
      );

      graph.addCell(shape);

      if (index > 0) {
        const link = new joint.dia.Link({
          source: { id: shape.id },
          target: { id: graph.getElements()[index - 1].id },
        });

        graph.addCell(link);
      }
    });
  }

  function handleAddTable() {
    // Push new table data to the tables array
    if (newTableData.tableName && newTableData.entityNames) {
      setTables([...tables, { id: tables.length + 1, ...newTableData }]);

      // Clear the newTableData state
      setNewTableData({
        tableName: '',
        entityNames: '',
      });
    }
  }

  function handleTableSelect(event) {
    setSelectedTableId(event.target.value);
  }

  function handleCreateLink() {
    // Create a link between the selected table and the new table
    if (selectedTableId) {
      const sourceTable = tables.find((table) => table.id === selectedTableId);
      const targetTable = tables[tables.length - 1]; // The newly added table

      if (sourceTable && targetTable) {
        const graph = diagramRef.current.model;

        const link = new joint.dia.Link({
          source: { id: targetTable.id },
          target: { id: sourceTable.id },
        });

        graph.addCell(link);
      }
    }
  }

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Table Name"
          value={newTableData.tableName}
          onChange={(e) =>
            setNewTableData({ ...newTableData, tableName: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Entity Names (comma-separated)"
          value={newTableData.entityNames}
          onChange={(e) =>
            setNewTableData({ ...newTableData, entityNames: e.target.value })
          }
        />
        <button
          style={{
            backgroundColor: 'blue',
            padding: '4px',
            cursor: 'pointer',
          }}
          onClick={handleAddTable}
        >
          Add
        </button>
      </div>
      <div>
        <select onChange={handleTableSelect}>
          <option value="">Select Table to Link</option>
          {tables.map((table) => (
            <option key={table.id} value={table.id}>
              {table.tableName}
            </option>
          ))}
        </select>
        <button
          style={{
            backgroundColor: 'green',
            padding: '4px',
            cursor: 'pointer',
          }}
          onClick={handleCreateLink}
        >
          Create Link
        </button>
      </div>
      <div ref={diagramRef} /> {/* Use the ref for the diagram container */}
    </div>
  );
}

export default ERDVisualization;

