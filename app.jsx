var PLAYERS = [
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
];

var nextId = 4;

function Stats(props) {
  var totalPlayers = props.players.length;
  var totalPoints = props.players.reduce(function (total, player) {
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

var AddPlayerForm = React.createClass({
  propTypes: {
    onAdd: React.PropTypes.func.isRequired,
  },

  getInitialState: function getInitialState() {
    return {
      name: '',
    };
  },

  onNameChange: function onNameChange(e) {
    this.setState({ name: e.target.value });
  },

  onSubmit: function onSubmit(e) {
    e.preventDefault();

    this.props.onAdd(this.state.name);
    this.setState({ name: '' });
  },

  render: function render() {
    return (
      <div className="add-player-form">
        <form onSubmit={this.onSubmit}>
          <input type="text" value={this.state.name} onChange={this.onNameChange} />
          <input type="submit" value="Add Player" />
        </form>
      </div>
    );
  },
});

Stats.propTypes = {
  players: React.PropTypes.array.isRequired,
};

function Header(props) {
  return (
    <div className="header">
      <Stats players={props.players} />
      <h1>{props.title}</h1>
    </div>
  );
}

Header.propTypes = {
  title: React.PropTypes.string.isRequired,
  players: React.PropTypes.array.isRequired,
};

function Counter(props) {
  return (
    <div className="counter">
      <button className="counter-action decrement" onClick={function decrement() {props.onChange(-1);}}> - </button>
      <div className="counter-score"> {props.score} </div>
      <button className="counter-action increment" onClick={function increment() {props.onChange(1);}}> + </button>
    </div>
  );
}

Counter.propTypes = {
  score: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired,
}

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

var Application = React.createClass({

  propTypes: {
    title: React.PropTypes.string,
    initialPlayers: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      score: React.PropTypes.number.isRequired,
      id: React.PropTypes.number.isRequired,
    })).isRequired,
  },

  getDefaultProps: function getDefaultProps() {
    return {
      title: 'My Scoreboard',
    };
  },

  getInitialState: function getInitialState() {
    return {
      players: this.props.initialPlayers,
    };
  },

  onScoreChange: function onScoreChange(playerIndex, delta) {
    this.state.players[playerIndex].score += delta;
    this.setState(this.state);
  },

  onPlayerAdd: function onPlayerAdd(name) {
    this.state.players.push({
      name: name,
      score: 0,
      id: nextId,
    });
    this.setState(this.state);
    nextId += 1;
  },

  onRemove: function onRemove(playerIndex, name) {
    /* console.log('Player removed:', name);*/

    this.state.players.splice(playerIndex, 1);
    this.setState(this.state);
  },

  render: function render() {
    return (
      <div className="scoreboard">
        <Header title={this.props.title} players={this.state.players} />
        <div className="players">
          {this.state.players.map(function (player, idx, arr) {
             return (
               <Player
                   onRemove={function (playerToRemove) { this.onRemove(idx, playerToRemove); }.bind(this)}
                   onScoreChange={function (delta) { this.onScoreChange(idx, delta); }.bind(this)}
                   name={player.name}
                   score={player.score}
                   key={player.id}
               />
             );
           }.bind(this))}
        </div>
        <AddPlayerForm onAdd={this.onPlayerAdd}/>
      </div>
    );
  },
});

ReactDOM.render(<Application initialPlayers={PLAYERS} />, document.getElementById('container'));
