import React from "react";
import PropTypes from "prop-types";

function Settings(props) {

    return (
        <div className="row form-group">
            <div className="col-md-12">
                <button
                    className='pull-right btn btn-sm btn-info btn-responsive red'
                    onClick={() => props.reset()}>
                    <p className='p-grey'>Reset↪️</p>
                </button>
                <button
                    className='pull-right btn btn-sm btn-info btn-responsive yellow'
                    onClick={() => props.undo(props.currentDraft)}>
                    <p className='p-grey'>Undo⏪</p>
                </button>
                <button
                    className={"collapse" + (props.expandSettings ? ' in' : ' ') + ' pull-right btn btn-sm btn-info btn-responsive blue'}
                    onClick={() => props.settings(false)}>
                    <p className='p-grey'>Hide⚙️</p>
                </button>
                <button
                    className={"collapse" + (!props.expandSettings ? ' in' : ' ') + ' pull-right btn btn-sm btn-info btn-responsive blue'}
                    onClick={() => props.settings(true)}>
                    <p className='p-grey'>Show⚙️</p>
                </button>
            </div>
            <div>
                <div className={"settings collapse" + (props.expandSettings ? ' in' : '')}>
                    <div className='settings-warning'>Set your League Settings before you start!</div>
                    <div className='window-warning'>Note: try expanding your window to see more data</div>
                    <div className="row form-group">
                        <div className="form-group">
                            <div>
                                #teams:<select value={props.teams}
                                               onChange={(e) => props.updateTeams(e.target.value)}>
                                <option value="2">2</option>
                                <option value="4">4</option>
                                <option value="6">6</option>
                                <option value="8">8</option>
                                <option value="10">10</option>
                                <option value="12">12</option>
                                <option value="14">14</option>
                                <option value="16">16</option>
                            </select>
                            </div>
                            <div>
                                #pick:<input type="number" value={props.pick}
                                             onChange={(e) => props.updatePick(e.target.value)}>
                            </input>
                            </div>
                            <div>
                                adpBuffer:<select value={props.buffer}
                                                  onChange={(e) => props.updateBuffer(e.target.value)}>
                                <option value="0">0%</option>
                                <option value="0.25">+25%</option>
                                <option value="0.5">+50%</option>
                                <option value="0.75">+75%</option>
                                <option value="1">+100%</option>
                            </select>
                            </div>
                            <div>
                                format:<select value={props.format}
                                               onChange={(e) => props.updateFormat(e.target.value)}>
                                <option value="std">STD</option>
                                <option value="halfppr">.5 PPR</option>
                                <option value="ppr">PPR</option>
                                <option value="custom">Custom</option>
                            </select>
                            </div>
                            <div><a href="" onClick={(e) => props.downloadCSV()}>Download template</a></div>
                            <div><input type="file" accept=".csv" onChange={(e) => props.fileUpload(e.target.files)}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Settings.propTypes = {
    currentDraft: PropTypes.number.isRequired,
    reset: PropTypes.func.isRequired,
    undo: PropTypes.func.isRequired,
    settings: PropTypes.func.isRequired,
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

export default Settings