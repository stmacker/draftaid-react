import React from 'react';

import Undrafted from './Undrafted'

function UndraftedPositions(props) {
    const fields = ['rank', 'fpts','diff', 'position', 'name', 'team'];

    return (
        <div className='col-md-6 col-sm-12 hidden-xs'>
           <br /> <br />
            <div className='aid-title'>
                <i className='fa fa-signal'></i> Top Picks By Position
            </div>
            <div className='col-sm-6'>
                <span className="col-sm-12 position-title">Running Backs</span>
                <Undrafted
                    fields={fields}
                    players={props.players}
                    draft={(p) => props.draft(p)}
                    size={17}
                    position='RB'
                />
            </div>

            <div className='col-sm-6'>
                <span className="col-sm-12 position-title">Wide Receivers</span>
                <Undrafted
                    fields={fields}
                    players={props.players}
                    draft={(p) => props.draft(p)}
                    size={17}
                    position='WR'
                />
            </div>

            <div className='col-sm-6'>
                <span className="col-sm-12 position-title">Quarterbacks</span>
                <Undrafted
                    fields={fields}
                    players={props.players}
                    draft={(p) => props.draft(p)}
                    size={10}
                    position='QB'
                />
            </div>

            <div className='col-sm-6'>
                <span className="col-sm-12 position-title">Tightends</span>
                <Undrafted
                    fields={fields}
                    players={props.players}
                    draft={(p) => props.draft(p)}
                    size={10}
                    position='TE'
                />
            </div>
            <div className='col-sm-6'>
                <span className="col-sm-12 position-title">Kickers</span>
                <Undrafted
                    fields={fields}
                    players={props.players}
                    draft={(p) => props.draft(p)}
                    size={3}
                    position='K'
                />
            </div>
            <div className='col-sm-6'>
                <span className="col-sm-12 position-title">DST</span>
                <Undrafted
                    fields={fields}
                    players={props.players}
                    draft={(p) => props.draft(p)}
                    size={3}
                    position='DST'
                />
            </div>
        </div>
    )
}

UndraftedPositions.propTypes = {
    draft: React.PropTypes.func.isRequired,
    players: React.PropTypes.array.isRequired,
};

export default UndraftedPositions
