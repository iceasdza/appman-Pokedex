import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import img from "./cute.png";
const COLORS = {
  Psychic: "#f8a5c2",
  Fighting: "#f0932b",
  Fairy: "#c44569",
  Normal: "#f6e58d",
  Grass: "#badc58",
  Metal: "#95afc0",
  Water: "#3dc1d3",
  Lightning: "#f9ca24",
  Darkness: "#574b90",
  Colorless: "#FFF",
  Fire: "#eb4d4b"
};

class App extends Component {
  state = {
    pokemons: [],
    hidden: true,
    myPokemons: [],
    text: ""
  };

  getData = async () => {
    const resp = await axios.get("http://localhost:3030/api/cards");
    this.setState({ pokemons: resp.data.cards });
  };

  closeModal = e => {
    if (e.target.className === "modal") this.setState({ hidden: true });
  };

  showModal = () => {
    this.setState({ hidden: false });
  };

  componentDidMount() {
    this.getData();
  }

  search = e => {
    this.setState({ text: e });
    if (e.length === 0) {
      this.getData();
    } else {
      const input = e;
      let result = this.state.pokemons.filter(data => {
        let searchName = data.name.toLowerCase().search(input);
        let searchType = data.type.toLowerCase().search(input);
        if (searchName !== -1 || searchType !== -1) {
          return data.name;
        }
      });
      this.setState({ pokemons: result });
    }
  };

  renderPokemonCard = () => {
    return (
      <div>
        {this.state.pokemons.map((data, index) => (
          <div key={index} className="pokenmon-cards-container" >
            <img src={data.imageUrl} className="modal-img" />
            <div className="data">
              <span className="name">{data.name}</span>
              <span
                className="add-pokemon"
                onClick={e => this.addPokemon(index)}
              >
                ADD
              </span>
              <div className="stat-container">
              <div className="status-wrapper">
                <span className="stat">HP :</span>
                {this.renderGuage(data.hp, "hp")}
              </div>
              <div className="status-wrapper">
                <span className="stat">STR :</span>{" "}
                {this.renderGuage(data.attacks, "str")}
              </div>
              <div className="status-wrapper">
                <span className="stat">WEAK :</span>
                {this.renderGuage(data.weaknesses, "weakness")}
              </div>
              <div className="status-wrapper">
                {this.renderGuage(
                  [data.hp, data.attacks, data.weakness],
                  "happiness"
                )}
              </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  addPokemon = index => {
    const myPokemons = this.state.myPokemons;
    const pokemons = this.state.pokemons;
    const selectedPokemon = this.state.pokemons[index];
    pokemons.splice(index, 1);
    myPokemons.push(selectedPokemon);
    this.setState({ myPokemons, pokemons });
  };

  removePokemon = index => {
    const myPokemons = this.state.myPokemons;
    const pokemons = this.state.pokemons;
    const selectedPokemon = this.state.myPokemons[index];
    myPokemons.splice(index, 1);
    pokemons.push(selectedPokemon);
    this.setState({ myPokemons, pokemons });
  };

  renderGuage = (guage, stat) => {
    switch (stat) {
      case "hp": {
        if (guage >= 100) {
          guage = 100;
        }
        if (guage === 0 || guage === "None") {
          guage = 0;
        }
        let style = guage.toString() + "%";
        return (
          <div className="guage-container">
            <div className="guage" style={{ width: style }} />
          </div>
        );
      }
      case "str": {
        let attacks = 0;
        if (guage) {
          attacks = guage.length * 50;
        } else {
          attacks = 0;
        }
        const style = attacks.toString() + "%";
        return (
          <div className="guage-container">
            <div className="guage" style={{ width: style }} />
          </div>
        );
      }
      case "weakness": {
        let weakness = 0;
        if (guage) {
          weakness = 100;
        } else {
          weakness = 0;
        }
        const style = weakness.toString() + "%";
        return (
          <div className="guage-container">
            <div className="guage" style={{ width: style }} />
          </div>
        );
      }
      case "happiness": {
        let hp = 0;
        let attacks = 0;
        let weakness = 0;
        //hp
        if (guage[0] >= 100) {
          hp = 100;
        }
        if (guage[0] === 0 || guage[0] === "None") {
          hp = 0;
        }
        //attacks
        if (guage[1]) {
          attacks = guage[1].length * 50;
        } else {
          attacks = 0;
        }

        //weakness
        if (guage[2]) {
          weakness = 100;
        } else {
          weakness = 0;
        }

        let arr = [];
        const happiness = (hp / 10 + attacks / 10 + 10 - weakness) / 5;
        for (let x = 1; x <= happiness; x++) {
          arr.push(<img src={img} style={{ width: "40px" }} />);
        }
        return <div>{arr.map(data => data)}</div>;
      }
    }
  };

  render() {
    return (
      <div className="App">
        <div
          className="modal"
          hidden={this.state.hidden}
          onClick={e => this.closeModal(e)}
        >
          <div className="modal-content">
            <input
              type="text"
              onChange={e => this.search(e.target.value)}
              value={this.state.text}
              className="search-box"
              placeholder="find pokemon"
            />
            <div className="icon-search">
            <div style={{width:"2em",height:"2em",backgroundColor:'#ec5656',borderRadius:'2em',display:'flex',justifyContent:'center',alignItems:'center'}}>
                <div style={{width:"1.2em",height:"1.2em",backgroundColor:"white",borderRadius:'2em'}}></div>
              </div>
              <div style={{width:"0.4em",height:"1.3em",backgroundColor:'#ec5656'}} className="grip"></div>
              </div>
            {this.renderPokemonCard()}
          </div>
        </div>
        <h1 style={{ textAlign: "center" }}>My Pokedex</h1>
        <div className="show-my-pokemon" >
          {this.state.myPokemons.map((data, index) => (
            <div className="my-pokemon-card">
              <img src={data.imageUrl} className="img" />
              <div className="data">
                <span className="name">{data.name}</span>
                <span
                  className="remove-pokemon"
                  onClick={e => this.removePokemon(index)}
                >
                X
                </span>
                <div className="modal-info" />
                <div className="status-wrapper">
                  <span className="stat-mypokemon">HP :</span>{" "}
                  {this.renderGuage(data.hp, "hp")}
                </div>
                <div className="status-wrapper">
                  <span className="stat-mypokemon">STR :</span>{" "}
                  {this.renderGuage(data.attacks, "str")}
                </div>
                <div className="status-wrapper">
                  <span className="stat-mypokemon">WEAK :</span>
                  {this.renderGuage(data.weaknesses, "weakness")}
                </div>
                <div className="status-wrapper">
                  {this.renderGuage(
                    [data.hp, data.attacks, data.weakness],
                    "happiness"
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bottomBar">
          <div className="modal-btn" onClick={this.showModal}>
            <span className="icon">+</span>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
