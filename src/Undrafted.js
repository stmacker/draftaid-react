import React from 'react';

import PlayerTable from './PlayerTable'
import PropTypes from "prop-types";

function Undrafted(props) {
  let players = props.players.slice().filter(p => !p.drafted);

  if (props.position) {
    players = players.filter(p => p.pos.includes(props.position));
  }

  players = players.sort((a, b) => a.adp - b.adp);

  return (
    <PlayerTable
      size={props.size}
      headers={props.headers}
      fields={props.fields}
      players={players}
      onClick={(p) => props.draft(p)}
      maxDiff={props.maxDiff}
    />
  );
}


Undrafted.propTypes = {
  draft: PropTypes.func.isRequired,
  players: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  maxDiff: PropTypes.number,
  size: PropTypes.number,
  position: PropTypes.string,
};

export default Undrafted
