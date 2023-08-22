import React from 'react';

import Undrafted from './Undrafted'
import PropTypes from "prop-types";

function UndraftedAll(props) {
  return (
      <div className='col-25'>
          <div className="aid-title hidden-xs">
            <i className="fa fa-sort-amount-asc"></i> Overall Rankings
          </div>

          <div className="row form-group">
          <div className="col-100">
            <input
                type="text"
                className="form-control col-100"
                placeholder="Search"
                onChange={props.search}
                value={ props.query }
            />
          </div>
          </div>

        <div className='scrollable overall-rankings col-100'>
          <Undrafted
              headers={['ADP', 'FPts','Val',"Pos","Player","Team"]}
              fields={['adp', 'fpts','diff', 'pos', 'player', 'team']}
              players={props.players}
              draft={(p) => props.draft(p)}
          />
        </div>
      </div>
  )
}

UndraftedAll.propTypes = {
  players: PropTypes.array.isRequired,
  query: PropTypes.string.isRequired,
  search: PropTypes.func.isRequired,
};

export default UndraftedAll
