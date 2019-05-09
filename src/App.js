import React from 'react';
import styled from 'styled-components';

const capitalize = ([first, ...rest]) =>
  `${first.toUpperCase()}${rest.join('')}`;

const getJson = url => fetch(url).then(r => r.json());

const shortPokeDescription = ({name, id, sprites: {front_default}}) => ({
  name: capitalize(name),
  id,
  url: front_default,
});
const ListItem = styled.div.attrs({
  className: 'fl w-20-l w-25-m w-50',
})``;

const Title = styled.h2.attrs({
  className: 'f6 f5-ns fw6 lh-title black mv0',
})``;

const SubTitle = styled.h3.attrs({
  className: 'f6 fw4 mt0 mb0 black-60',
})``;

const PokeList = ({pokemon = [], showDetails}) =>
  pokemon.map(shortPokeDescription).map(({name, url, id}) => (
    <ListItem key={name}>
      <a onClick={e => showDetails(id, name)}>
        <img alt={name} src={url} />
        <Title>{name}</Title>
        <SubTitle>{id}</SubTitle>
      </a>
    </ListItem>
  ));

const FullPokemon = ({pokemon = [], selected, closeDetails}) => {
  const full = pokemon.find(({id}) => id === selected);
  const {
    sprites: {front_default, back_default},
    height,
    weight,
    types,
    name,
    id
  } = full;

  return (
    <div key={id}>
      <div onClick={closeDetails}>X</div>
      <Title>{capitalize(name)}</Title>
      <img src={front_default} />
      <img src={back_default} />
      <p>Height: {height}</p>
      <p>Weight: {weight}</p>
    </div>
  );
};

class PokeDex extends React.Component {
  state = {
    loading: true,
    pokemon: [],
    selected: false,
  };

  async componentDidMount() {
    getJson('https://pokeapi.co/api/v2/pokemon/?limit=151')
      .then(({results: pokes}) =>
        Promise.all(pokes.map(({url}) => getJson(url))),
      )
      .then(pokemon =>
        this.setState({
          pokemon,
          loading: false,
        }),
      )
      .catch(error => console.log('parsing failed', error));
  }

  showDetails = (id, e) => {
    console.log({id})
    /* e.preventDefault() */ this.setState({selected: id});
    console.log(e);
  };

  closeDetails = e => {
    this.setState({selected:undefined})
  };

  render() {
    const {loading, pokemon, selected} = this.state;

    return (
      <div>
        {!loading ? (
          selected ? (
            <FullPokemon
              pokemon={pokemon}
              selected={selected}
              closeDetails={this.closeDetails}
            />
          ) : (
            <PokeList pokemon={pokemon} showDetails={this.showDetails} />
          )
        ) : null}
      </div>
    );
  }
}

export default PokeDex;
