// Libs
import React from 'react';

const INITIAL_STATE = {
  players: [
    {
      name: 'Marc Laughton',
      score: 31,
      id: 1,
    },
    {
      name: 'Becky Laughton',
      score: 47,
      id: 2,
    },
    {
      name: 'Geddy Laughton',
      score: 16,
      id: 3,
    },
  ],
}

INITIAL_STATE.nextId = INITIAL_STATE.players[INITIAL_STATE.players.length - 1].id + 1;

const Scoreboard = React.createClass({
  getInitialState: function () {
    return INITIAL_STATE;
  },

  propTypes: {
    title: React.PropTypes.string,
  },

  getDefaultProps: function () {
    return {
      title: 'My Scoreboard',
    }
  },

  onScoreChange: function (playerIndex, delta) {
    this.state.players[playerIndex].score += delta;
    this.setState(this.state);
  },

  onAddPlayer: function (name) {
    let nameIsDifferentFromExisting = true;

    this.state.players.map((player) => {
      if (player.name.toLowerCase() === name.toLowerCase()) {
        nameIsDifferentFromExisting = false;
      }
    });

    if (name && nameIsDifferentFromExisting) {
      this.state.players.push({ name: name, score: 0, id: this.state.nextId });
      this.state.nextId += 1;
      this.setState(this.state);
    }
  },

  onRemovePlayer: function (playerIndex, name) {
    /* console.log('Player removed:', name);*/
    this.state.players.splice(playerIndex, 1);
    this.setState(this.state);
  },

  render: function () {
    return (
      <div className="scoreboard">
        <Header title={this.props.title} players={this.state.players} />
        <div className="players">
          {this.state.players.map((player, idx) => {
             return (
               <Player
                   name={player.name}
                   score={player.score}
                   key={player.id}
                   onScoreChange={(delta) => this.onScoreChange(idx, delta)}
                   onRemove={(playerToRemove) => this.onRemovePlayer(idx, playerToRemove)}
               />
             );
           }, this)}
        </div>
        <AddPlayerForm onAdd={this.onAddPlayer}/>
      </div>
    );
  },
});

function Header(props) {
  return (
    <div className="header">
      <Stats players={props.players} />
      <h1>{props.title}</h1>
      <Stopwatch />
    </div>
  );
}

Header.propTypes = {
  title: React.PropTypes.string.isRequired,
  players: React.PropTypes.array.isRequired,
};

function Stats(props) {
  const totalPlayers = props.players.length;
  const totalPoints = props.players.reduce((total, player) => {
    return total + player.score;
  }, 0);

  return (
    <table className="stats">
      <tbody>
        <tr>
          <td>Players</td>
          <td>{totalPlayers}</td>
        </tr>
        <tr>
          <td>Total Points</td>
          <td>{totalPoints}</td>
        </tr>
      </tbody>
    </table>
  );
}

Stats.propTypes = {
  players: React.PropTypes.array.isRequired,
};

const Stopwatch = React.createClass({
  getInitialState: function () {
    return ({
      running: false,
      elapsedTime: 0,
      previousTime: 0,
    });
  },

  componentDidMount: function () {
    this.interval = setInterval(this.onTick, 100);
  },

  componentWillUnmount: function () {
    clearInterval(this.interval);
  },

  onStart: function () {
    this.setState({
      running: true,
      previousTime: Date.now(),
    });
  },

  onStop: function () {
    this.setState({
      running: false
    });
  },

  onReset: function () {
    this.setState({
      elapsedTime: 0,
      previousTime: Date.now(),
    });
  },

  onTick: function () {
    if (this.state.running) {
      var now = Date.now();
      this.setState({
        elapsedTime: this.state.elapsedTime + (now - this.state.previousTime),
        previousTime: now,
      });
    }
  },

  render: function () {
    var seconds = Math.floor(this.state.elapsedTime / 1000);

    return (
      <div className="stopwatch">
        <h2>Stopwatch</h2>
        <div className="stopwatch-time">{seconds}</div>
        {this.state.running ?
         <button onClick={this.onStop}>Stop</button>
         :
         <button onClick={this.onStart}>Start</button>}
        <button onClick={this.onReset}>Reset</button>
      </div>
   )
  },
});

function Player(props) {
  return (
    <div className="player">
      <div className="player-name">
        <a className="remove-player" onClick={function () { props.onRemove(props.name); }}>✖</a>
        {props.name}
      </div>
      <div className="player-score">
        <Counter score={props.score} onChange={props.onScoreChange}/>
      </div>
    </div>
  );
}

Player.propTypes = {
  name: React.PropTypes.string.isRequired,
  score: React.PropTypes.number.isRequired,
  onRemove: React.PropTypes.func.isRequired,
  onScoreChange: React.PropTypes.func.isRequired,
};

function Counter(props) {
  return (
    <div className="counter">
      <button className="counter-action decrement" onClick={() => {props.onChange(-1);}}> - </button>
      <div className="counter-score"> {props.score} </div>
      <button className="counter-action increment" onClick={() => {props.onChange(1);}}> + </button>
    </div>
  );
}

Counter.propTypes = {
  score: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired,
}

const AddPlayerForm = React.createClass({
  propTypes: {
    onAdd: React.PropTypes.func.isRequired,
  },

  getInitialState: function () {
    return { name: '' };
  },

  onNameChange: function (e) {
    const name = e.target.value;
    this.setState({ name: name });
  },

  onSubmit: function (e) {
    e.preventDefault();
    this.props.onAdd(this.state.name);
    this.setState({ name: '' });
  },

  render: function () {
    return (
      <div className="add-player-form">
        <form onSubmit={this.onSubmit}>
          <input
              type="text"
              value={this.state.name}
              onChange={this.onNameChange}
              placeholder="Player Name"
          />
          <input type="submit" value="Add Player" />
        </form>
      </div>
    );
  },
});

export default Scoreboard;
