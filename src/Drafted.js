import React from 'react';

import PlayerTable from './PlayerTable'
import PropTypes from "prop-types";

function Drafted(props) {
    let players = props.players.slice().filter(p => p.drafted);
    players = players.sort((a, b) => b.drafted - a.drafted);

    return (
        <div className='col-25 drafted'>
            <div className='aid-title hidden-xs'>
                Draft History
            </div>
            <div className="row form-group">
                <div className="col-md-12">
                    <button
                        className='pull-right btn btn-sm btn-warning btn-responsive red'
                        onClick={()=>props.reset()}>
                        Reset
                    </button>
                    <button
                        className='pull-right btn btn-sm btn-info btn-responsive yellow'
                        onClick={()=>props.undo(props.currentDraft)}>
                        Undo
                    </button>
                </div>
            </div>



            <PlayerTable
                headers={['Pick','Player','Pos','Team']}
                fields={['drafted', 'player', 'pos', 'team']}
                players={players}
                disableColor={true}
            />
        </div>
    );
}

Drafted.propTypes = {
    currentDraft: PropTypes.number.isRequired,
    reset: PropTypes.func.isRequired,
    undo: PropTypes.func.isRequired,
    players: PropTypes.array.isRequired,
    buffer: PropTypes.number
};

export default Drafted
