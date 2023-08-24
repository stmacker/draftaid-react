import React from 'react';

import PlayerTable from './PlayerTable'
import PropTypes from "prop-types";
import Settings from "./Settings";

function Drafted(props) {
    let players = props.players.slice().filter(p => p.drafted);
    players = players.sort((a, b) => b.drafted - a.drafted);

    return (
        <div className='col-25 drafted'>
            <div className='aid-title hidden-xs'>
                Draft History
            </div>

            <Settings
                currentDraft={props.currentDraft}
                settings={props.settings}
                undo={props.undo}
                reset={props.reset}
                expandSettings={props.expandSettings}
                teams={props.teams}
                updateTeams={props.updateTeams}
                pick={props.pick}
                updatePick={props.updatePick}
                buffer={props.buffer}
                updateBuffer={props.updateBuffer}
                format={props.format}
                updateFormat={props.updateFormat}
                downloadCSV={props.downloadCSV}
                fileUpload={props.fileUpload}
            />

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
    settings: PropTypes.func.isRequired,
    players: PropTypes.array.isRequired,
    expandSettings: PropTypes.bool.isRequired,
    teams: PropTypes.number.isRequired,
    updateTeams: PropTypes.func.isRequired,
    pick: PropTypes.number.isRequired,
    updatePick: PropTypes.func.isRequired,
    buffer: PropTypes.number.isRequired,
    updateBuffer: PropTypes.func.isRequired,
    format: PropTypes.string.isRequired,
    updateFormat: PropTypes.func.isRequired,
    downloadCSV: PropTypes.func.isRequired,
    fileUpload: PropTypes.func.isRequired,
};

export default Drafted
