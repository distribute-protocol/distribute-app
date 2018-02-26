import React, { PureComponent } from 'react'
import { Table, Icon } from 'antd'
import 'antd/dist/antd.css'
import dragula from 'dragula'
import 'dragula/dist/dragula.css'
import './DraggableTable.css'

class DraggableTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data
    }
  }
  componentWillReceiveProps(np) {
  }
  componentDidMount() {
    const container = document.querySelector('.ant-table-tbody');
    const drake = dragula([container], {
      moves: (el, container, handle, sibling) => {
        this.start = this.getIndexInParent(el);
        return true;
      },
    });

    drake.on('drop', (el, target, source, sibling) => {
      this.end = this.getIndexInParent(el);
      this.props.handleReorder(this.start, this.end);
    });
  }
  getIndexInParent = el => {
    return Array.from(el.parentNode.children).indexOf(el);
  };

  render() {
    return (
      <div>
        <Table
          columns={this.props.columns}
          pagination={false}
          dataSource={this.state.data}
        />
      </div>
    );
  }
}
export default DraggableTable;
