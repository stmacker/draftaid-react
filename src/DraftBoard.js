import React, { Component } from 'react';

import UndraftedAll from './UndraftedAll'
import UndraftedPositions from './UndraftedPositions'
import Drafted from './Drafted'
import data from '../data/players.json';

class DraftBoard extends Component {

    constructor(props) {
      super(props);

      this.state = {
          players: [],
          filteredPlayers: [],
          isLoading: true,
          currentDraft: 0,
          fetchError: null,
          format: 'standard',
          query: '',
          teams: 12,
          pick: 1,
          picks:[1,24,25,48,49,72,73,96,97,120,121,144,145,168,169,192],
          nextPick: 1,
          pickAfter: 2,
      };
    }

    componentDidMount() {
      this.fetchPlayers(this.state.format);
      this.setNextPicks();
      this.updatePlayerValues();

    }
    fetchPlayers(format) {
        const self = this;
                self.setState({
                    players: data.rankings,
                    filteredPlayers: data.rankings,
                    isLoading: false,
                    format: format,
                    query: '',
                });
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
            pickIn = this.state.teams;
        }
        if (pickIn < 1) {
            pickIn = 1;
        }
        await this.setState({
            pick: pickIn,
        })
        await this.setPicks()
        return Promise.resolve("pick position updated");
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
            if (this.state.picks[round - 1] >= this.state.currentDraft+1) {
                if(this.state.picks[round-1]+1===this.state.picks[round]){
                    await this.setState({
                        nextPick: this.state.picks[round-1],
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
        let pPlayers = this.state.filteredPlayers;
        let pickAfter = Number(this.state.pickAfter);
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
        })

        await this.setState({
            filteredPlayers: pPlayers
        })

        return Promise.resolve("players updated");

    }



    searchPlayers(query) {
      let players = this.state.players.filter(player =>
        player.name.toUpperCase().includes(query.toUpperCase())
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
        });
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
        return Promise.resolve("players reset");
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
                <UndraftedAll
                    players={this.state.filteredPlayers}
                    draft={(p) => this.draft(p).then(()=>this.setNextPicks())}
                    fetch={(e) => this.fetchPlayers(e.target.value)}
                    search={(e) => this.searchPlayers(e.target.value)}
                    updateTeams={(e) => this.updateTeams(e.target.value).then(()=>this.setPicks())}
                    updatePick={(e) => this.updatePick(e.target.value).then(()=>this.setPicks())}
                    format={this.state.format}
                    query={this.state.query}
                    teams={this.state.teams}
                    pick={this.state.pick}
                />

                <UndraftedPositions
                    players={this.state.players}
                    draft={(p) => this.draft(p).then(()=>this.setNextPicks())}
                    picks={this.state.picks}
                />

                <Drafted
                    currentDraft={this.state.currentDraft}
                    players={this.state.players}
                    currentPick={this.state.currentDraft}
                    nextPick={this.state.nextPick}
                    pickAfter={this.state.pickAfter}
                    undo={(c) => this.undo(c).then((p)=>this.setNextPicks()).then((v)=>this.updatePlayerValues)}
                    reset={() => this.reset().then(()=>this.setNextPicks()).then(()=>this.updatePlayerValues)}
                />
            </div>
        );
    }
}

export default DraftBoard;
