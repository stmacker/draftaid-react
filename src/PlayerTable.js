import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class PlayerTable extends PureComponent {

  headers() {
    return this.props.headers.map(header => {
        return <th >{header}</th>
    });
  }
  rows() {
    let players = this.props.players.slice();

    if (this.props.size) {
      players = players.slice(0, this.props.size);
    }

    return players.map((player, i) => {
      return (
          <tr key={i}
              className={this.trClassName(player.diff, this.props.disableColor)}
              onClick={() => this.onClick(player)}>
            {this.columns(player)}
          </tr>
      )
    });
  }

  onClick(player) {
    if (this.props.onClick) {
      return this.props.onClick(player);
    }
  }

  trClassName(diff, disable) {
    if (disable) {
      return 'pointer'
    }
    if (diff < -2) {
      return 'red pointer'
    }
    if (diff < 2) {
      return 'white pointer'
    }
    if (diff < 10) {
      return 'orange pointer'
    }
    if (diff < 20) {
      return 'yellow pointer'
    }
    if (diff < 30) {
      return 'green pointer'
    }
    if (diff < 40) {
      return 'blue pointer'
    }
      return 'purple pointer'
  }

  columns(player) {
    return this.props.fields.map((f, i) => {
      if (f === 'fpts') {
        return <td key={i}> {Math.round(player[f])}</td>
      } else {
        return <td key={i}>{player[f]}</td>
      }
    });
  }

  render() {
    return (
        <table className='table table-condensed table-hover table-striped'>
          <thead><tr>{this.headers()}</tr></thead>
          <tbody>{this.rows()}</tbody>
        </table>
    );
  }
}

PlayerTable.propTypes = {
  players: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  onClick: PropTypes.func,
  size: PropTypes.number,
  disableColor: PropTypes.bool,
  maxDiff: PropTypes.number,
};

export default PlayerTable
