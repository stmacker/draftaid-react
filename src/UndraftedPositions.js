import React from 'react';

import Undrafted from './Undrafted'
import PropTypes from "prop-types";

function UndraftedPositions(props) {
    const headers = ['ADP', 'FPts','Val',"Pos","Player","Team"]
    const fields = ['adp', 'fpts','diff', 'pos', 'player', 'team'];

    return (
        <div className='col-50'>
            <div className='aid-title'>
                <i className='fa fa-signal'></i> Top Picks By Position
            </div>
            <div className='col-50'>
                <span className="col-sm-12 position-title">Running Backs</span>
                <Undrafted
                    headers={headers}
                    fields={fields}
                    players={props.players}
                    draft={(p) => props.draft(p)}
                    size={20}
                    position='RB'
                    maxDiff={props.maxDiff}
                />
            </div>

            <div className='col-50'>
                <span className="col-sm-12 position-title">Wide Receivers</span>
                <Undrafted
                    headers={headers}
                    fields={fields}
                    players={props.players}
                    draft={(p) => props.draft(p)}
                    size={20}
                    position='WR'
                    maxDiff={props.maxDiff}
                />
            </div>

            <div className='col-50'>
                <span className="col-sm-12 position-title">Quarterbacks</span>
                <Undrafted
                    headers={[]}
                    fields={fields}
                    players={props.players}
                    draft={(p) => props.draft(p)}
                    size={12}
                    position='QB'
                    maxDiff={props.maxDiff}
                />
            </div>

            <div className='col-50'>
                <span className="col-sm-12 position-title">Tightends</span>
                <Undrafted
                    headers={[]}
                    fields={fields}
                    players={props.players}
                    draft={(p) => props.draft(p)}
                    size={12}
                    position='TE'
                    maxDiff={props.maxDiff}
                />
            </div>
            <div className='col-50'>
                <span className="col-sm-12 position-title">Kickers</span>
                <Undrafted
                    headers={[]}
                    fields={fields}
                    players={props.players}
                    draft={(p) => props.draft(p)}
                    size={3}
                    position='K'
                    maxDiff={props.maxDiff}
                />
            </div>
            <div className='col-50'>
                <span className="col-sm-12 position-title">DST</span>
                <Undrafted
                    headers={[]}
                    fields={fields}
                    players={props.players}
                    draft={(p) => props.draft(p)}
                    size={3}
                    position='DST'
                    maxDiff={props.maxDiff}
                />
            </div>
        </div>
    )
}

UndraftedPositions.propTypes = {
    draft: PropTypes.func.isRequired,
    players: PropTypes.array.isRequired,
    maxDiff: PropTypes.number,
};

export default UndraftedPositions
