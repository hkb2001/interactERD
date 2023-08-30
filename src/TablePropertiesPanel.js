// TablePropertiesPanel.js
import React, { Component } from 'react';

class TablePropertiesPanel extends Component {
  render() {
    const { selectedTable } = this.props;

    return (
      <div className={`side-panel ${selectedTable ? 'open' : ''}`}>
        <h2>Table Properties</h2>
        {selectedTable && (
          <div>
            <h3>{selectedTable.name}</h3>
            <ul>
              {selectedTable.entities.map((entity, index) => (
                <li key={index}>{entity}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default TablePropertiesPanel;
