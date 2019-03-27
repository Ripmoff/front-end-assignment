import React, { Component } from 'react';
import { PLAYERS_ENDPOINT, CALCULATE_ELO_ENDPOINT } from './util/constants';

class Sjakkify extends Component {

    constructor() {
        super();
        this.state = {
            players: [],
            options: [],

            playerAValue: 0,
            playerBValue: 0,

            playerAName: '',
            playerBName: '',

            playerARating: '',
            playerBRating: '',

            victoryValue: '1',

            rating: -1
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch(PLAYERS_ENDPOINT)
            .then(response => { return response.json() })
            .then(data => {
                let options = data.map( (player, i) => {
                    return <option key={player.name} value={i}>{player.name}</option>
                })

                // Default states
                this.setState({
                    players: data,
                    options: options,

                    playerAName: '' + data[0].name,
                    playerBName: '' + data[0].name,

                    playerARating: '' + data[0].rating,
                    playerBRating: '' + data[0].rating,
                });

                console.log(data);
            })
            .catch(error => console.error('Error:', error));;
    }

    /**
     * Handles changes in the select inputs
     * @param {SyntheticEvent} event Change event
     */
    handleChange(event) {
        const VALUE = event.target.value;

        this.setState({[event.target.name + 'Value']: VALUE});

        // Alternatly you can just always update pAN, pBN, pAR, and pBR here
        if (event.target.name !== 'victory') {
            this.setState({
                [event.target.name + 'Name']: this.state.players[VALUE].name,
                [event.target.name + 'Rating']: this.state.players[VALUE].rating
            });
        }
    }

    /**
     * Handles submitting
     * @param {SyntheticEvent} event Submit event
     */
    handleSubmit(event) {
        event.preventDefault();

        if (this.state.playerAValue === this.state.playerBValue) {
            alert("Please choose 2 people who are not the same person");
            return
        }

        fetch(`${CALCULATE_ELO_ENDPOINT}?myRating=${this.state.playerARating}&opponentRating=${this.state.playerBRating}&myGameResult=${this.state.victoryValue}`)
            .then(res => {return res.json()})
            .then(response => {
                console.log('New rating', response.newRating);
                this.setState({rating: response.newRating});
            })
            .catch(error => console.error('Error:', error));
    }

    render() {
        console.log(this.state);
        return (
            <div>
                <form onSubmit={this.handleSubmit}>

                    { /* PLAYER A */ }
                    <div>
                        <span>Player A: </span>
                        <select name="playerA" value={this.state.playerAValue} onChange={this.handleChange}>
                            {this.state.options}
                        </select>
                        <span>{this.state.playerARating}</span>
                    </div>

                    { /* PLAYER B */ }
                    <div>
                        <span>Player B: </span>
                        <select name="playerB" value={this.state.playerBValue} onChange={this.handleChange}>
                            {this.state.options}
                        </select>
                        <span>{this.state.playerBRating}</span>
                    </div>

                    { /* VICTORY STATE */ }
                    <div>
                        <span>Resultat: </span>
                        <select name="victory" value={this.state.victoryState} onChange={this.handleChange}>
                            <option value="1">Seier spiller A</option>
                            <option value="0.5">Uavgjort</option>
                            <option value="0">Seier spiller B</option>
                        </select>
                    </div>

                    { /* SUBMIT BUTTON */}
                    <button>Kalkuler ELO</button>
                </form>

                { /* RATING */}
                <b>Din nye rating: {this.state.rating !== -1 && this.state.rating}</b>

            </div>
        )
    }
}

export default Sjakkify;