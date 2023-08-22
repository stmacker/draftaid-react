import React, {Component} from 'react';
import UndraftedAll from './UndraftedAll'
import UndraftedPositions from './UndraftedPositions'
import Drafted from './Drafted'
import std from '../data/std.csv'
import halfppr from '../data/halfppr.csv'
import ppr from '../data/ppr.csv'



class DraftBoard extends Component {

    constructor(props) {
      super(props);

      this.state = {
          players: [],
          filteredPlayers: [],
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
          buffer: 0.25
      };
    }

    async componentDidMount() {
      await this.fetchPlayers(this.state.format);
      await this.updatePlayerValues();
    }

    async updateFormat(format){
        this.setState({
            format: format
        });
        await this.componentDidMount();
        return Promise.resolve("new format loaded");
    }

    async fileUpload(f){

    }
    async fetchPlayers(format) {
        let data = null;
        switch (format){
            case 'std':
                data = std;
                break;
            case 'halfppr':
                data = halfppr;
                break;
            case 'ppr':
            default:
                data = ppr;
                break;

        }

        this.setState({
            players: data,
            filteredPlayers: data,
            isLoading: false,
            query: '',
        });
        await this.updatePlayerValues();
        return Promise.resolve("players imported");
    }


    async updateTeams(teamIn) {
        teamIn = Number(teamIn);
        await this.setState({
            teams: teamIn,
        });
        await this.setPicks();
        return Promise.resolve("number of teams updated");
    }

    async updatePick(pickIn) {
        pickIn = Number(pickIn);
        if (pickIn > this.state.teams) {
            await this.setState({
                pick: null,
            })
            return Promise.resolve("invalid pick");
        }
        if (pickIn < 1) {
            await this.setState({
                pick: null,
            })
            return Promise.resolve("invalid pick");
        }
        await this.setState({
            pick: pickIn,
        })
        await this.setPicks()
        return Promise.resolve("pick position updated");
    }

    async updateBuffer(bufferIn){
        await this.setState({
          buffer: bufferIn
        })
        await this.updatePlayerValues();
        return Promise.resolve("buffer updated")
    }

    async setPicks() {
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
        await this.setState({picks: newPicks})
        await this.setNextPicks()
        return Promise.resolve("picks set");
    }
    async setNextPicks() {
        for (let round = 1; round <= 16; round++) {
            if (this.state.picks[round-1] >= this.state.currentDraft+1) {
                if(this.state.picks[round-1]+1===this.state.picks[round]){
                    await this.setState({
                        nextPick: this.state.picks[round-1]+','+this.state.picks[round],
                        pickAfter: this.state.picks[round+1]
                    });
                }else{
                await this.setState({
                    nextPick: this.state.picks[round-1],
                    pickAfter: this.state.picks[round]
                });}
                break;
            }
        }
        await this.updatePlayerValues();
        return Promise.resolve("picks updated");
    }

    async updatePlayerValues() {
        let nextQB = 0;
        let nextRB = 0;
        let nextWR = 0;
        let nextTE = 0;
        let nextK = 0;
        let nextDST = 0;
        let pPlayers = this.state.players.slice().filter(p => !p.drafted);
        let pickAfter = Number(this.state.pickAfter) - Number(this.state.currentDraft) + (Number(this.state.pickAfter)-Number(this.state.currentDraft))*this.state.buffer;
        await pPlayers.forEach((player, index) => {
            let adp = index+1;
            let pts = player.fpts;
            switch (player.position) {
                case 'QB':
                    if (nextQB < pts && adp > pickAfter) {
                        nextQB = pts;
                    }
                    break;
                case 'RB':
                    if (nextRB < pts && (adp > pickAfter)) {
                        nextRB = pts;
                    }
                    break;
                case 'WR':
                    if (nextWR < pts && (adp > pickAfter)) {
                        nextWR = pts;
                    }
                    break;
                case 'TE':
                        if (nextTE < pts && (adp > pickAfter)) {
                        nextTE = pts;
                    }
                    break;
                case 'K':
                    if (nextK < pts && (adp > pickAfter)) {
                        nextK = pts;
                    }
                    break;
                case 'DST':
                    if (nextDST < pts && (adp > pickAfter)) {
                        nextDST = pts;
                    }
                    break;
                default:
            }
        })
        let maxDiff = 0;
        await pPlayers.forEach((player) => {
            switch (player.position) {
                case 'QB':
                    player.diff = Math.round(player.fpts - nextQB)
                    break;
                case 'RB':
                    player.diff = Math.round(player.fpts - nextRB)
                    break;
                case 'WR':
                    player.diff = Math.round(player.fpts - nextWR)
                    break;
                case 'TE':
                    player.diff = Math.round(player.fpts - nextTE)
                    break;
                case 'K':
                    player.diff = Math.round(player.fpts - nextK)
                    break;
                case 'DST':
                    player.diff = Math.round(player.fpts - nextDST)
                    break;
                default:
            }
            if(player.diff > maxDiff){
                maxDiff = player.diff;
            }
        })

        await this.setState({
            filteredPlayers: pPlayers,
            maxDiff: maxDiff
        })
        await this.render();
        return Promise.resolve("players updated");

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

    async draft(player) {
        const players = this.state.players.slice();
        const index = players.indexOf(player);
        if (~index) {
            players[index].drafted = this.state.currentDraft + 1;
        }

        await this.setState({
            currentDraft: this.state.currentDraft + 1,
            players: players,
            filteredPlayers: players,
            query: '',
        });
        await this.setNextPicks();
        return Promise.resolve("player drafted");
    }

    async undo(currentDraft) {
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
        });
        await this.setNextPicks();
        return Promise.resolve("undo last pick");
    }

    async reset() {
        const players = this.state.players.slice();
        players.map((player, i) => {
            return player.drafted = null;
        });

        await this.setState({
            currentDraft: 0,
            players: players,
        });
        await this.setNextPicks();
        return Promise.resolve("players reset");
    }

    toggleSettings() {
        this.setState({
            expandSettings: !this.state.expandSettings
        });
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
                                        format:<select value={ this.state.format } onChange={(e)=> this.updateFormat(e.target.value).then(f=> this.componentDidMount())} >
                                        <option value="std">STD</option>
                                        <option value="halfppr">.5 PPR</option>
                                        <option value="ppr">PPR</option>
                                        {/*<option value="custom">custom</option>*/}
                                    </select>
                                        <div className={"collapse" + (String(this.state.format) === "custom" ? ' in' : '')}><input type="file" accept=".csv" onChange={(e) => this.fileUpload(e.target.value)}/></div>
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
                    format={this.state.format}
                    query={this.state.query}
                />

                <UndraftedPositions
                    players={this.state.players}
                    draft={(p) => this.draft(p)}
                    picks={this.state.picks}
                    maxDiff={this.state.maxDiff}
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
