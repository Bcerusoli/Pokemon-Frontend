import { useEffect, useState } from 'react';
import { Table, Button, Container, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Menu from '../components/Menu';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const PokemonAdmin = () => {
    const { getAuthUser } = useAuth();
    const navigate = useNavigate();
    const { token, role } = getAuthUser(); 

    const [pokemones, setPokemones] = useState([]);
    const [tipos, setTipos] = useState([]); 
    const [showModal, setShowModal] = useState(false);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        baseHP: '',
        baseAtaque: '',
        baseDefensa: '',
        baseAtaqueEspecial: '',
        baseDefensaEspecial: '',
        baseVelocidad: '',
        imagen: null, 
    });

    useEffect(() => {
        
        if (!token || role !== 'admin') {
            navigate('/login');
            return;
        }

        
        axios.get('http://localhost:3000/pokemones', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => setPokemones(res.data))
            .catch((err) => console.error('Error fetching pokemones:', err));

        
        axios.get('http://localhost:3000/tipos', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => setTipos(res.data))
            .catch((err) => console.error('Error fetching tipos:', err));
    }, [token, role, navigate]);

    const handleCreateOrUpdatePokemon = () => {
        const url = selectedPokemon
            ? `http://localhost:3000/pokemones/${selectedPokemon.id}`
            : 'http://localhost:3000/pokemones';
        const method = selectedPokemon ? 'put' : 'post';

        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('baseHP', formData.baseHP);
        data.append('baseAtaque', formData.baseAtaque);
        data.append('baseDefensa', formData.baseDefensa);
        data.append('baseAtaqueEspecial', formData.baseAtaqueEspecial);
        data.append('baseDefensaEspecial', formData.baseDefensaEspecial);
        data.append('baseVelocidad', formData.baseVelocidad);
        if (formData.imagen) {
            data.append('imagen', formData.imagen); 
        }

        axios[method](url, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(() => {
                alert(selectedPokemon ? 'Pokémon actualizado correctamente' : 'Pokémon creado correctamente');
                setShowModal(false);
                setFormData({
                    nombre: '',
                    baseHP: '',
                    baseAtaque: '',
                    baseDefensa: '',
                    baseAtaqueEspecial: '',
                    baseDefensaEspecial: '',
                    baseVelocidad: '',
                    imagen: null,
                });
                setSelectedPokemon(null);
                axios.get('http://localhost:3000/pokemones', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then((res) => setPokemones(res.data));
            })
            .catch((err) => {
                if (err.response && err.response.status === 400 && err.response.data.message) {
                    alert(err.response.data.message); // Mostrar el mensaje del backend
                } else {
                    console.error('Error creating/updating Pokémon:', err);
                    alert('Error al crear o actualizar el Pokémon');
                }
            });
    };

    const handleDeletePokemon = (id) => {
        axios.delete(`http://localhost:3000/pokemones/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => {
                alert('Pokémon eliminado correctamente');
                setPokemones(pokemones.filter((pokemon) => pokemon.id !== id));
            })
            .catch((err) => console.error('Error deleting Pokémon:', err));
    };

    const handleAssignTipo = (pokemonId, tipoId) => {
        if (!pokemonId || !tipoId) {
            alert('Por favor seleccione un tipo válido');
            return;
        }

        axios.post(`http://localhost:3000/pokemonTipos/${pokemonId}/assign`, { tipoId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => {
                alert('Tipo asignado correctamente');
                axios.get('http://localhost:3000/pokemones', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then((res) => setPokemones(res.data));
            })
            .catch((err) => {
                console.error('Error assigning tipo:', err);
                if (err.response && err.response.status === 400 && err.response.data.message) {
                    alert(err.response.data.message);
                } else if (err.response && err.response.status === 404) {
                    alert('Pokémon o tipo no encontrado');
                } else {
                    alert('Error al asignar el tipo');
                }
            });
    };

    const openModal = (pokemon = null) => {
        setSelectedPokemon(pokemon);
        setFormData(
            pokemon
                ? { ...pokemon, imagen: null }
                : {
                      nombre: '',
                      baseHP: '',
                      baseAtaque: '',
                      baseDefensa: '',
                      baseAtaqueEspecial: '',
                      baseDefensaEspecial: '',
                      baseVelocidad: '',
                      imagen: null,
                  }
        );
        setShowModal(true);
    };

    return (
        <>
            <Menu />
            <Container className="mt-5">
                <h2>Gestión de Pokemones</h2>
                <Button variant="primary" onClick={() => openModal()}>Crear Pokémon</Button>
                <Table striped bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Imagen</th>
                            <th>Base HP</th>
                            <th>Base Ataque</th>
                            <th>Base Defensa</th>
                            <th>Base Ataque Especial</th>
                            <th>Base Defensa Especial</th>
                            <th>Base Velocidad</th>
                            <th>Tipos</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pokemones.map((pokemon) => (
                            <tr key={pokemon.id}>
                                <td>{pokemon.id}</td>
                                <td>{pokemon.nombre}</td>
                                <td><img src={`http://localhost:3000${pokemon.imagen}`} alt={pokemon.nombre} style={{ width: "100px" }} /></td>
                                <td>{pokemon.baseHP}</td>
                                <td>{pokemon.baseAtaque}</td>
                                <td>{pokemon.baseDefensa}</td>
                                <td>{pokemon.baseAtaqueEspecial}</td>
                                <td>{pokemon.baseDefensaEspecial}</td>
                                <td>{pokemon.baseVelocidad}</td>
                                <td>
                                    {pokemon.tipos?.map((tipo) => (
                                        <span key={tipo.id} style={{ marginRight: '5px' }}>{tipo.nombre}</span>
                                    ))}
                                </td>
                                <td>
                                    <Button variant="info" onClick={() => openModal(pokemon)}>Editar</Button>
                                    <Button variant="danger" onClick={() => handleDeletePokemon(pokemon.id)}>Eliminar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedPokemon ? 'Editar Pokémon' : 'Crear Pokémon'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                placeholder="Ingrese el nombre"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Imagen</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => setFormData({ ...formData, imagen: e.target.files[0] })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Base HP</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.baseHP}
                                onChange={(e) => setFormData({ ...formData, baseHP: e.target.value })}
                                placeholder="Base HP"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Base Ataque</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.baseAtaque}
                                onChange={(e) => setFormData({ ...formData, baseAtaque: e.target.value })}
                                placeholder="Base Ataque"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Base Defensa</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.baseDefensa}
                                onChange={(e) => setFormData({ ...formData, baseDefensa: e.target.value })}
                                placeholder="Base Defensa"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Base Ataque Especial</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.baseAtaqueEspecial}
                                onChange={(e) => setFormData({ ...formData, baseAtaqueEspecial: e.target.value })}
                                placeholder="Base Ataque Especial"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Base Defensa Especial</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.baseDefensaEspecial}
                                onChange={(e) => setFormData({ ...formData, baseDefensaEspecial: e.target.value })}
                                placeholder="Base Defensa Especial"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Base Velocidad</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.baseVelocidad}
                                onChange={(e) => setFormData({ ...formData, baseVelocidad: e.target.value })}
                                placeholder="Base Velocidad"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Tipos</Form.Label>
                            <Form.Select
                                onChange={(e) => handleAssignTipo(selectedPokemon.id, e.target.value)}
                                defaultValue=""
                            >
                                <option value="" disabled>Seleccione un tipo</option>
                                {tipos.map((tipo) => (
                                    <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleCreateOrUpdatePokemon}>Guardar</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default PokemonAdmin;