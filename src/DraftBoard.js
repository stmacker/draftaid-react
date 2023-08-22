import React, {Component} from 'react';
import UndraftedAll from './UndraftedAll'
import UndraftedPositions from './UndraftedPositions'
import Drafted from './Drafted'
import std from '../data/std.csv'
import halfppr from '../data/halfppr.csv'
import ppr from '../data/ppr.csv'
import Papa from 'papaparse'



class DraftBoard extends Component {

    constructor(props) {
      super(props);

      this.state = {
          players: [],
          undraftedPlayers: [],
          filteredPlayers: [],
          nextAvailable: [],
          isLoading: true,
          currentDraft: 0,
          fetchError: null,
          format: 'std',
          query: '',
          teams: 12,
          pick: 1,
          picks:[1,24,25,48,49,72,73,96,97,120,121,144,145,168,169,192],
          nextPick: 1,
          pickAfter: 24,
          maxDiff: 0,
          expandSettings: true,
          buffer: 0.25,
          data: null
      };

      this.updateData = this.updateData.bind(this);
    }

    componentDidMount() {
      this.fetchPlayers(this.state.format);
    }

    updateFormat(format){
        this.setState({
            format: format
        }, function () {this.componentDidMount()});
    }

    fileUpload(f){
        if (f) {
            Papa.parse(f[0], {
                header: true,
                dynamicTyping: true,
                complete: this.updateData
            })
        }
    }

    updateData(result){
        this.setState({data: result.data},
            function () {this.fetchPlayers('custom')})
    }
    fetchPlayers(format) {
        let data = null;
        switch (format){
            case 'std':
                data = std;
                break;
            case 'halfppr':
                data = halfppr;
                break;
            case 'ppr':
                data = ppr;
                break;
            case 'custom':
                if(this.state.data != null) {
                    data = this.state.data.sort((a, b) => a.adp - b.adp);
                    break;
                }
                data = std;
                break;
        }

        this.setState({
            players: data,
            filteredPlayers: data,
            undraftedPlayers: data,
            isLoading: false,
            query: '',
        }, function () {this.updatePlayerValues()});
    }


    updateTeams(teamIn) {
        teamIn = Number(teamIn);
        this.setState({
            teams: teamIn,
        }, function () {this.setPicks()});
    }

    updatePick(pickIn) {
        pickIn = Number(pickIn);
        if (pickIn > this.state.teams) {
            pickIn = null;
        }
        if (pickIn < 1) {
            pickIn = null;
        }
        this.setState({
            pick: pickIn,
        }, function () {this.setPicks()})
    }

    async updateBuffer(bufferIn){
        await this.setState({
          buffer: bufferIn
        })
        await this.updatePlayerValues();
        return Promise.resolve("buffer updated")
    }

    setPicks() {
        let newPicks = [];
        for (let round = 1; round <= 16; round++) {
            let draftpick;
            if (round % 2 === 0) {
                draftpick = (round * this.state.teams) - this.state.pick + 1
            } else {
                draftpick = (round - 1) * this.state.teams + Number(this.state.pick);
            }
            newPicks.push(draftpick);
        }
        this.setState({picks: newPicks}, function () {this.setNextPicks()})
    }
    setNextPicks() {
        for (let round = 1; round <= 16; round++) {
            if (this.state.picks[round-1] >= this.state.currentDraft+1) {
                if(this.state.picks[round-1]+1===this.state.picks[round]){
                    this.setState({
                        nextPick: this.state.picks[round-1]+','+this.state.picks[round],
                        pickAfter: this.state.picks[round+1]
                    }, function () {this.updatePlayerValues()}
                    )}
                else{
                this.setState({
                    nextPick: this.state.picks[round-1],
                    pickAfter: this.state.picks[round]
                }, function () {this.updatePlayerValues()}
                )}
                break;
            }
        }
    }

    updatePlayerValues() {
        let pPlayers = this.state.players.slice().filter(p => !p.drafted);
        this.setState({undraftedPlayers: pPlayers}, function () {this.updateNextAvailableValues()})
    }

    updateNextAvailableValues(){
        let next = []
        next['QB'] = 0;
        next['RB'] = 0;
        next['WR'] = 0;
        next['TE'] = 0;
        next['K'] = 0;
        next['DST'] = 0;
        let pickAfter = Number(this.state.pickAfter) - Number(this.state.currentDraft) + (Number(this.state.pickAfter)-Number(this.state.currentDraft))*this.state.buffer;
        let pPlayers = this.state.undraftedPlayers;
        pPlayers.forEach((player, index) => {
            let adp = index+1;
            if (next[player.pos] < player.fpts && adp > pickAfter) {
                next[player.pos] = player.fpts;
            }
        })
        this.setState({nextAvailable: next}, function() {this.updateValvsNextAvailable()})
    }

    updateValvsNextAvailable(){
        let pPlayers = this.state.undraftedPlayers;
        let next = this.state.nextAvailable;
        pPlayers.forEach((player) => {
            player.diff = Math.round(player.fpts - next[player.pos])
        })
        this.setState({
            player: pPlayers,
            filteredPlayers: pPlayers,
        }, function () {this.render()})
    }

    searchPlayers(query) {
      let players = this.state.players.filter(player =>
        player.player.toUpperCase().includes(query.toUpperCase())
      );

      this.setState({
        filteredPlayers: players,
        query: query,
      });
    }

    draft(player) {
        const players = this.state.players.slice();
        const index = players.indexOf(player);
        if (~index) {
            players[index].drafted = this.state.currentDraft + 1;
        }

        this.setState({
            currentDraft: this.state.currentDraft + 1,
            players: players,
            filteredPlayers: players,
            query: '',
        }, function () {this.setNextPicks()});
    }

    undo(currentDraft) {
        if (currentDraft === 0) {
            return
        }

        const players = this.state.players.slice();
        const index = players.findIndex(p => p.drafted === currentDraft);
        if (~index) {
            players[index].drafted = null;
        }

        this.setState({
            currentDraft: this.state.currentDraft - 1,
            players: players,
        }, function () {this.setNextPicks()});
    }

    reset() {
        const players = this.state.players.slice();
        players.map((player, i) => {
            return player.drafted = null;
        });

        this.setState({
            currentDraft: 0,
            players: players,
        }, function () {this.setNextPicks()});
    }

    downloadCSV()
    {
        let data = null
        switch (format){
            case 'std':
                data = std
                break;
            case 'halfppr':
                data = halfppr;
                break;
            case 'ppr':
                data = ppr;
                break;
            case 'custom':
                if(this.state.data != null) {
                    data = this.state.data.sort((a, b) => a.adp - b.adp);
                    break;
                }
                data = std;
                break;
        }

        let csv=  Papa.unparse(ppr);

        let csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        let csvURL =  null;
        if (navigator.msSaveBlob)
        {
            csvURL = navigator.msSaveBlob(csvData, 'template.csv');
        }
        else
        {
            csvURL = window.URL.createObjectURL(csvData);
        }

        let tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', 'template.csv');
        tempLink.click();
    }
    render() {
        if (this.state.isLoading) {
            return (<div className='row'>Loading...</div>)
        }

        if (this.state.fetchError) {
            return (<div className='row'>error fetching rankings...</div>)
        }

        return (
            <div className='row'>
                <div className="col-100">
                <div className="col-25">
                    <div>Current Pick:{this.state.currentDraft+1} | Upcoming Pick:{this.state.nextPick} | Next Pick:{this.state.pickAfter} </div>
                    <br />
                </div>
                    <div className="col-50">
                        <b>Value Based Draft Aid</b>: Value over Next Available (ADP+Proj source: FantasyPros.com)<br />
                        Thanks to jayzheng for his original and open sourcing his code: <a href='https://jayzheng.com/ff/'>JZ Draftaid</a>.<br />
                        Next Available: {this.state.undraftedPlayers[0].adp}
                    </div>
                    <div className="col-25">
                        <div className={"collapse" + (this.state.expandSettings ? ' in' : '')}>
                            <div className="row form-group">
                                <div className="form-group">
                                    #teams:<select value={ this.state.teams } onChange={(e) => this.updateTeams(e.target.value)} >
                                    <option value="2">2</option>
                                    <option value="4">4</option>
                                    <option value="6">6</option>
                                    <option value="8">8</option>
                                    <option value="10">10</option>
                                    <option value="12">12</option>
                                    <option value="14">14</option>
                                    <option value="16">16</option>
                                </select>
                                     #pick:<input type="number" value={ this.state.pick } onChange={(e) => this.updatePick(e.target.value)} >
                                </input>
                                     adpBuffer:<select value={ this.state.buffer } onChange={(e)=> this.updateBuffer(e.target.value)} >
                                    <option value="0">0%</option>
                                    <option value="0.25">+25%</option>
                                    <option value="0.5">+50%</option>
                                </select>
                                    <div>
                                        format:<select value={ this.state.format } onChange={(e)=> this.updateFormat(e.target.value)} >
                                        <option value="std">STD</option>
                                        <option value="halfppr">.5 PPR</option>
                                        <option value="ppr">PPR</option>
                                        <option value="custom">Custom</option>
                                    </select> <a href="" onClick={(e) => this.downloadCSV()}>Download template</a>
                                        <div><input type="file" accept=".csv" onChange={(e) => this.fileUpload(e.target.files)}/></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <UndraftedAll
                    players={this.state.filteredPlayers}
                    draft={(p) => this.draft(p)}
                    search={(e) => this.searchPlayers(e.target.value)}
                    query={this.state.query}
                />

                <UndraftedPositions
                    players={this.state.players}
                    draft={(p) => this.draft(p)}
                />

                <Drafted
                    currentDraft={this.state.currentDraft}
                    players={this.state.players}
                    undo={(c) => this.undo(c)}
                    reset={() => this.reset()}
                />
            </div>
        );
    }
}

export default DraftBoard;
