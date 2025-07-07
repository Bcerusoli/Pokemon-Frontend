import { useEffect, useState } from "react";
import { Container, Form, Button, Table } from "react-bootstrap";
import Menu from "../components/Menu";
import { useAuth } from "../../hooks/useAuth";
import { useParams, useNavigate } from "react-router"; 
import axios from "axios";

const EquipoEdit = () => {
    const { getAuthUser } = useAuth();
    const { token } = getAuthUser();
    const params = useParams(); 
    const navigate = useNavigate(); 

    const [formData, setFormData] = useState({ nombre: "" });
    const [pokemones, setPokemones] = useState([]); 
    const [allPokemones, setAllPokemones] = useState([]); 
    const [filteredPokemones, setFilteredPokemones] = useState([]); 
    const [selectedPokemonId, setSelectedPokemonId] = useState(""); 
    const [searchTerm, setSearchTerm] = useState(""); 

    
    useEffect(() => {
    
    if (!token) {
        console.log("Usuario no autenticado. Redirigiendo al Login...");
        navigate("/login"); 
        return;
    }

    
    axios.get(`http://localhost:3000/equipos/${params.id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => setFormData(res.data))
        .catch((err) => {
            console.error("Error fetching equipo:", err);
            alert("Error al obtener los detalles del equipo");
        });

    
    axios.get(`http://localhost:3000/pokemonEquipos/${params.id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => setPokemones(res.data))
        .catch((err) => console.error("Error fetching pokemones in equipo:", err));

    
    axios.get("http://localhost:3000/pokemones", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => {
            setAllPokemones(res.data);
            setFilteredPokemones(res.data); 
        })
        .catch((err) => console.error("Error fetching all pokemones:", err));
}, [params.id, token, navigate]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        const filtered = allPokemones.filter((pokemon) =>
            pokemon.nombre.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredPokemones(filtered);
    };

    const handleAddPokemon = () => {
        axios.post("http://localhost:3000/pokemonEquipos", { equipoId: params.id, pokemonId: selectedPokemonId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                alert("Pokémon añadido al equipo correctamente");
                setPokemones([...pokemones, res.data]); 
                setSelectedPokemonId("");
            })
            .catch((err) => {
                console.error("Error adding pokemon to equipo:", err);
                alert("Error al añadir el Pokémon al equipo");
            });
    };
        const handleUpdateEquipo = () => {
        // Actualizar el equipo
        axios.put(`http://localhost:3000/equipos/${params.id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => {
                alert("Equipo actualizado correctamente");
                navigate("/equipos"); 
            })
            .catch((err) => {
                console.error("Error updating equipo:", err);
                alert("Error al actualizar el equipo");
            });
    };

    const handleRemovePokemon = (id) => {
        
        axios.delete(`http://localhost:3000/pokemonEquipos/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => {
                alert("Pokémon eliminado del equipo correctamente");
                setPokemones(pokemones.filter((pokemon) => pokemon.id !== id));
            })
            .catch((err) => {
                console.error("Error removing pokemon from equipo:", err);
                alert("Error al eliminar el Pokémon del equipo");
            });
    };

    const handleSelectPokemon = (pokemonId) => {
        // Redirigir a la página de detalles del Pokémon
        navigate(`/equipos/${params.id}/pokemon/${pokemonId}`);
    };

    return (
        <>
            <Menu />
            <Container className="mt-5">
                <h2>Editar Equipo</h2>
                <Form>
                    <Form.Group>
                        <Form.Label>Nombre del Equipo</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            placeholder="Ingrese el nombre del equipo"
                        />
                    </Form.Group>
                    <Button variant="primary" onClick={handleUpdateEquipo} className="mt-3">Guardar Cambios</Button>
                </Form>

                <h3 className="mt-5">Pokémon en el Equipo</h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pokemones.map((pokemon) => (
                            <tr key={pokemon.id || pokemon.pokemon?.id}>
                                <td>{pokemon.pokemon?.id || "Sin ID"}</td>
                                <td>{pokemon.pokemon?.nombre || "Sin Nombre"}</td>
                                <td>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleRemovePokemon(pokemon.id || pokemon.pokemon?.id)}
                                        disabled={!pokemon.id && !pokemon.pokemon?.id} 
                                    >
                                        Eliminar
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={() => handleSelectPokemon(pokemon.pokemon?.id)}
                                        disabled={!pokemon.pokemon?.id}
                                        className="ms-2"
                                    >
                                        Seleccionar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <h3 className="mt-5">Añadir Pokémon al Equipo</h3>
                <Form>
                    <Form.Group>
                        <Form.Label>Buscar Pokémon</Form.Label>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Form.Control
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} 
                                placeholder="Ingrese el nombre del Pokémon"
                                style={{ marginRight: "10px" }}
                            />
                            <Button variant="primary" onClick={() => handleSearch(searchTerm)}>Buscar</Button>
                        </div>
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Seleccionar Pokémon</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedPokemonId}
                            onChange={(e) => setSelectedPokemonId(e.target.value)}
                        >
                            <option value="">Seleccione un Pokémon</option>
                            {filteredPokemones.map((pokemon) => (
                                <option key={pokemon.id} value={pokemon.id}>{pokemon.nombre}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Button variant="success" onClick={handleAddPokemon} className="mt-3">Añadir Pokémon</Button>
                </Form>
                    
            </Container>
        </>
    );
};

export default EquipoEdit;