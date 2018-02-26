import React, { PureComponent } from 'react'
// import { Table, Icon } from 'antd'
// import 'antd/dist/antd.css'
// import dragula from 'dragula'
// import 'dragula/dist/dragula.css'
// import './DraggableTable.css'
//
// class DraggableTable extends PureComponent {
//   constructor(props) {
//     super(props);
//     this.state = {
//       data: props.data,
//       columns: props.columns
//     }
//   }
//   componentWillReceiveProps(np) {
//     this.setState({data: np.data})
//   }
//   componentDidMount() {
//     const container = document.querySelector('.ant-table-tbody');
//     const drake = dragula([container], {
//       moves: (el, container, handle, sibling) => {
//         this.start = this.getIndexInParent(el);
//         return true;
//       },
//     });
//
//     drake.on('drop', (el, target, source, sibling) => {
//       this.end = this.getIndexInParent(el);
//       this.props.handleReorder(this.start, this.end);
//     });
//   }
//   getIndexInParent = el => {
//     return Array.from(el.parentNode.children).indexOf(el);
//   };
//
//   render() {
//     console.log(this.state.data)
//     let columns = this.state.columns.map(column => {
//       return <th>{column.title}</th>
//     })
//     let datas = this.state.data.map(task => {
//       return (
//         <tr>
//           <td>{task.description}</td>
//           <td>{task.percentage}</td>
//           <td>{task.ethReward}</td>
//           <td>{task.deleteTask}</td>
//         </tr>
//       )
//     })
//     let Table = <table>
//       <tr>
//         {columns}
//       </tr>
//       {datas}
//     </table>
//     return (
//       <div>
//         {Table}
//         {/* <Table
//           columns={this.state.columns}
//           pagination={false}
//           dataSource={this.state.data}
//         /> */}
//       </div>
//     );
//   }
// }
// export default DraggableTable;
import { Table } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';

function dragDirection(
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset,
) {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
}

let BodyRow = (props) => {
  const {
    isOver,
    connectDragSource,
    connectDropTarget,
    moveRow,
    dragRow,
    clientOffset,
    sourceClientOffset,
    initialClientOffset,
    ...restProps
  } = props;
  const style = { ...restProps.style, cursor: 'move' };

  let className = restProps.className;
  if (isOver && initialClientOffset) {
    const direction = dragDirection(
      dragRow.index,
      restProps.index,
      initialClientOffset,
      clientOffset,
      sourceClientOffset
    );
    if (direction === 'downward') {
      className += ' drop-over-downward';
    }
    if (direction === 'upward') {
      className += ' drop-over-upward';
    }
  }

  return connectDragSource(
    connectDropTarget(
      <tr
        {...restProps}
        className={className}
        style={style}
      />
    )
  );
};

const rowSource = {
  beginDrag(props) {
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

BodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset(),
}))(
  DragSource('row', rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
  }))(BodyRow)
);

class DragSortingTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: props.data,
      columns: props.columns
    }
  }
  
  componentWillReceiveProps(np) {
    this.setState({data: np.data})
  }

  components = {
    body: {
      row: BodyRow,
    },
  }

  render() {
    return (
      <Table
        columns={this.state.columns}
        dataSource={this.state.data}
        components={this.components}
        onRow={(record, index) => ({
          index,
          moveRow: this.props.moveRow,
        })}
      />
    );
  }
}

export default DragDropContext(HTML5Backend)(DragSortingTable);
