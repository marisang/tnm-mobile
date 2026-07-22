# 📖 Exemplos de Uso - Integração Supabase

## 🎯 Como Usar os Custom Hooks

### Exemplo 1: Listar Shows Publicados (Vitrine)

```jsx
import { useShows } from '../hooks/useShows';

function VitrineShows() {
  const { shows, loading, error } = useShows(true); // true = apenas publicados

  if (loading) return <div>Carregando shows...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="vitrine-shows">
      <h1>Shows Disponíveis</h1>
      <div className="grid-shows">
        {shows.map(show => (
          <div key={show.id} className="card-show">
            <img src={show.banner_url} alt={show.titulo_evento} />
            <h3>{show.titulo_evento}</h3>
            <p>{show.artistas?.pseudonimo_artistico}</p>
            <p>{new Date(show.data_evento).toLocaleDateString()}</p>
            <p>{show.local_nome}</p>
            {show.link_ingressos && (
              <a href={show.link_ingressos} target="_blank" rel="noopener">
                Comprar Ingressos
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Exemplo 2: Cadastrar Novo Show

```jsx
import { useState } from 'react';
import { useShows } from '../hooks/useShows';
import { useArtistas } from '../hooks/useArtistas';

function CadastrarNovoShow() {
  const { criarShow } = useShows();
  const { artistas } = useArtistas();
  
  const [formData, setFormData] = useState({
    titulo_evento: '',
    data_evento: '',
    local_nome: '',
    banner_url: '',
    link_ingressos: '',
    contato_whatsapp: '',
    release_texto: '',
    status_publicacao: 'rascunho',
    artista_id: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const novoShow = await criarShow(formData);
      alert('Show cadastrado com sucesso!');
      // Redirecionar ou limpar formulário
    } catch (error) {
      alert('Erro ao cadastrar show: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastrar Novo Show</h2>
      
      <input
        type="text"
        placeholder="Título do Evento"
        value={formData.titulo_evento}
        onChange={(e) => setFormData({...formData, titulo_evento: e.target.value})}
        required
      />

      <input
        type="date"
        value={formData.data_evento}
        onChange={(e) => setFormData({...formData, data_evento: e.target.value})}
        required
      />

      <input
        type="text"
        placeholder="Local do Evento"
        value={formData.local_nome}
        onChange={(e) => setFormData({...formData, local_nome: e.target.value})}
        required
      />

      <select
        value={formData.artista_id}
        onChange={(e) => setFormData({...formData, artista_id: e.target.value})}
        required
      >
        <option value="">Selecione o Artista</option>
        {artistas.map(artista => (
          <option key={artista.id} value={artista.id}>
            {artista.pseudonimo_artistico || artista.nome_completo}
          </option>
        ))}
      </select>

      <input
        type="url"
        placeholder="URL do Banner"
        value={formData.banner_url}
        onChange={(e) => setFormData({...formData, banner_url: e.target.value})}
      />

      <input
        type="url"
        placeholder="Link para Ingressos"
        value={formData.link_ingressos}
        onChange={(e) => setFormData({...formData, link_ingressos: e.target.value})}
      />

      <input
        type="tel"
        placeholder="WhatsApp para Contato"
        value={formData.contato_whatsapp}
        onChange={(e) => setFormData({...formData, contato_whatsapp: e.target.value})}
      />

      <textarea
        placeholder="Release / Descrição do Evento"
        value={formData.release_texto}
        onChange={(e) => setFormData({...formData, release_texto: e.target.value})}
        rows={5}
      />

      <select
        value={formData.status_publicacao}
        onChange={(e) => setFormData({...formData, status_publicacao: e.target.value})}
      >
        <option value="rascunho">Rascunho</option>
        <option value="publicado">Publicado</option>
      </select>

      <button type="submit">Cadastrar Show</button>
    </form>
  );
}
```

### Exemplo 3: Listar Obras do Artista

```jsx
import { useObras } from '../hooks/useObras';

function MeusLancamentos({ artistaId }) {
  const { obras, loading, error, deletarObra } = useObras(artistaId);

  if (loading) return <div>Carregando obras...</div>;
  if (error) return <div>Erro: {error}</div>;

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir esta obra?')) {
      try {
        await deletarObra(id);
        alert('Obra excluída com sucesso!');
      } catch (error) {
        alert('Erro ao excluir: ' + error.message);
      }
    }
  };

  return (
    <div>
      <h1>Meus Lançamentos</h1>
      {obras.length === 0 ? (
        <p>Nenhuma obra cadastrada ainda.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>ISRC</th>
              <th>Álbum</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {obras.map(obra => (
              <tr key={obra.id}>
                <td>{obra.titulo}</td>
                <td>{obra.isrc || '-'}</td>
                <td>{obra.albuns?.titulo || '-'}</td>
                <td>{obra.status}</td>
                <td>
                  <button onClick={() => handleDelete(obra.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

### Exemplo 4: Cadastrar Nova Obra

```jsx
import { useState } from 'react';
import { useObras } from '../hooks/useObras';
import { useArtistas } from '../hooks/useArtistas';

function CadastrarNovaObra() {
  const { criarObra } = useObras();
  const { artistas } = useArtistas();
  
  const [formData, setFormData] = useState({
    titulo: '',
    isrc: '',
    letra: '',
    status: 'cadastrada',
    artista_id: '',
    album_id: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await criarObra(formData);
      alert('Obra cadastrada com sucesso!');
      setFormData({
        titulo: '',
        isrc: '',
        letra: '',
        status: 'cadastrada',
        artista_id: '',
        album_id: null
      });
    } catch (error) {
      alert('Erro ao cadastrar obra: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastrar Nova Obra</h2>
      
      <input
        type="text"
        placeholder="Título da Obra"
        value={formData.titulo}
        onChange={(e) => setFormData({...formData, titulo: e.target.value})}
        required
      />

      <input
        type="text"
        placeholder="ISRC (Código Internacional)"
        value={formData.isrc}
        onChange={(e) => setFormData({...formData, isrc: e.target.value})}
      />

      <select
        value={formData.artista_id}
        onChange={(e) => setFormData({...formData, artista_id: e.target.value})}
        required
      >
        <option value="">Selecione o Artista</option>
        {artistas.map(artista => (
          <option key={artista.id} value={artista.id}>
            {artista.pseudonimo_artistico || artista.nome_completo}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Letra da Música"
        value={formData.letra}
        onChange={(e) => setFormData({...formData, letra: e.target.value})}
        rows={10}
      />

      <select
        value={formData.status}
        onChange={(e) => setFormData({...formData, status: e.target.value})}
      >
        <option value="cadastrada">Cadastrada</option>
        <option value="em_analise">Em Análise</option>
        <option value="aprovada">Aprovada</option>
        <option value="rejeitada">Rejeitada</option>
      </select>

      <button type="submit">Cadastrar Obra</button>
    </form>
  );
}
```

## 🔄 Uso Direto da API (sem hooks)

Se preferir usar diretamente os serviços:

```jsx
import { showsService, obrasService, artistasService } from '../services/api';

// Buscar todos os shows
const shows = await showsService.listar();

// Buscar show por ID
const show = await showsService.buscarPorId('uuid-do-show');

// Criar novo show
const novoShow = await showsService.criar({
  titulo_evento: 'Rock in Rio',
  data_evento: '2024-09-15',
  local_nome: 'Cidade do Rock',
  artista_id: 'uuid-do-artista',
  status_publicacao: 'publicado'
});

// Atualizar show
await showsService.atualizar('uuid-do-show', {
  status_publicacao: 'publicado'
});

// Deletar show
await showsService.deletar('uuid-do-show');
```

## 🎨 Dicas de Estilização

Os componentes acima são apenas estruturais. Você pode estilizá-los usando:

- CSS Modules
- Styled Components
- Tailwind CSS
- CSS puro

Exemplo com classes CSS:

```css
.vitrine-shows {
  padding: 20px;
}

.grid-shows {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.card-show {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}

.card-show:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card-show img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-show h3 {
  padding: 15px;
  margin: 0;
}
```

## 📱 Responsividade

Os exemplos são mobile-first. Adicione media queries para desktop:

```css
@media (max-width: 768px) {
  .grid-shows {
    grid-template-columns: 1fr;
  }
}
```
