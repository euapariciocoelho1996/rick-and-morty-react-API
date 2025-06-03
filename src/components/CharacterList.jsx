import { useState, useEffect } from 'react';
import './CharacterList.css';

function CharacterList() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch('https://rickandmortyapi.com/api/character');
        if (!response.ok) {
          throw new Error('Erro ao buscar personagens');
        }
        const data = await response.json();
        setCharacters(data.results);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  const filteredCharacters = characters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || character.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
  };

  const closeModal = () => {
    setSelectedCharacter(null);
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">Erro: {error}</div>;

  return (
    <div className="character-list">
      <h1>Personagens de Rick and Morty</h1>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="all">Todos os status</option>
          <option value="alive">Vivo</option>
          <option value="dead">Morto</option>
          <option value="unknown">Desconhecido</option>
        </select>
      </div>

      <div className="character-grid">
        {filteredCharacters.map((character) => (
          <div
            key={character.id}
            className="character-card"
            onClick={() => handleCharacterClick(character)}
          >
            <img src={character.image} alt={character.name} />
            <h2>{character.name}</h2>
            <p>Status: {character.status}</p>
            <p>Espécie: {character.species}</p>
          </div>
        ))}
      </div>

      {selectedCharacter && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>×</button>
            <div className="modal-body">
              <img src={selectedCharacter.image} alt={selectedCharacter.name} />
              <h2>{selectedCharacter.name}</h2>
              <div className="character-details">
                <p><strong>Status:</strong> {selectedCharacter.status}</p>
                <p><strong>Espécie:</strong> {selectedCharacter.species}</p>
                <p><strong>Gênero:</strong> {selectedCharacter.gender}</p>
                <p><strong>Origem:</strong> {selectedCharacter.origin.name}</p>
                <p><strong>Localização:</strong> {selectedCharacter.location.name}</p>
                <p><strong>Episódios:</strong> {selectedCharacter.episode.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CharacterList; 