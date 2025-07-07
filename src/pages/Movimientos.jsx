import { useEffect, useState } from "react";
import { Button, Table, Container, Modal, Form } from "react-bootstrap";
import Menu from "../components/Menu";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Movimientos = () => {
    const { getAuthUser } = useAuth();
    const navigate = useNavigate();
    const { token, role } = getAuthUser(); // Obtener el token y el rol del usuario

    const [movimientos, setMovimientos] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMovimiento, setSelectedMovimiento] = useState(null);
    const [formData, setFormData] = useState({ nombre: "", poder: "", categoria: "", tipoId: "" });
    const [pokemonIds, setPokemonIds] = useState({}); 

    const categorias = ["físico", "especial"]; 

    useEffect(() => {
        
        if (!token || role !== "admin") {
            navigate("/login");
            return;
        }

        // Obtener movimientos con el tipo asociado
        axios.get("http://localhost:3000/movimientos", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                setMovimientos(res.data);
            })
            .catch((err) => {
                console.error("Error fetching movimientos:", err);
                alert("Error al obtener la lista de movimientos.");
            });

        
        axios.get("http://localhost:3000/tipos", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                setTipos(res.data);
            })
            .catch((err) => {
                console.error("Error fetching tipos:", err);
                alert("Error al obtener la lista de tipos.");
            });
    }, [token, role, navigate]);

    const handleCreateOrUpdateMovimiento = () => {
        const url = selectedMovimiento ? `http://localhost:3000/movimientos/${selectedMovimiento.id}` : "http://localhost:3000/movimientos";
        const method = selectedMovimiento ? "put" : "post";

        axios[method](url, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                alert(selectedMovimiento ? "Movimiento actualizado correctamente" : "Movimiento creado correctamente");
                setShowModal(false);
                setFormData({ nombre: "", poder: "", categoria: "", tipoId: "" });
                setSelectedMovimiento(null);
                axios.get("http://localhost:3000/movimientos", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then((res) => setMovimientos(res.data));
            })
            .catch((err) => {
                console.error("Error creating/updating movimiento:", err);
                alert("Error al crear/actualizar el movimiento.");
            });
    };

    const handleDeleteMovimiento = (id) => {
        axios.delete(`http://localhost:3000/movimientos/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                alert("Movimiento eliminado correctamente");
                setMovimientos(movimientos.filter(movimiento => movimiento.id !== id));
            })
            .catch((err) => {
                console.error("Error deleting movimiento:", err);
                alert("Error al eliminar el movimiento.");
            });
    };

    const handleAsociarMovimientoAPokemon = (id) => {
        const pokemonId = pokemonIds[id]; // Obtener el ID del Pokémon específico para este movimiento
        if (!pokemonId) {
            alert("Por favor, ingrese un ID de Pokémon válido.");
            return;
        }

        axios.post(`http://localhost:3000/movimientos/${id}/asociar`, { pokemonId }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                alert(`Movimiento asociado al Pokémon con ID ${pokemonId}`);
                setPokemonIds((prev) => ({ ...prev, [id]: "" })); // Limpiar el campo después de asociar
            })
            .catch((err) => {
                console.error("Error asociando movimiento al Pokémon:", err);
                alert("Error al asociar movimiento al Pokémon.");
            });
    };

    const openModal = (movimiento = null) => {
        setSelectedMovimiento(movimiento);
        setFormData(movimiento ? { nombre: movimiento.nombre, poder: movimiento.poder, categoria: movimiento.categoria, tipoId: movimiento.tipoId } : { nombre: "", poder: "", categoria: "", tipoId: "" });
        setShowModal(true);
    };

    return (
        <>
            <Menu />
            <Container className="mt-3">
                <h2>Gestión de Movimientos</h2>
                <Button variant="primary" onClick={() => openModal()}>Crear Movimiento</Button>
                <Table striped bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Poder</th>
                            <th>Categoría</th>
                            <th>Tipo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movimientos.map(movimiento => (
                            <tr key={movimiento.id}>
                                <td>{movimiento.id}</td>
                                <td>{movimiento.nombre}</td>
                                <td>{movimiento.poder}</td>
                                <td>{movimiento.categoria}</td>
                                <td>{movimiento.tipo?.nombre || "Sin tipo"}</td>
                                <td>
                                    <Button variant="info" onClick={() => openModal(movimiento)}>Editar</Button>
                                    <Button variant="danger" onClick={() => handleDeleteMovimiento(movimiento.id)}>Eliminar</Button>
                                    <Form.Control
                                        type="text"
                                        placeholder="ID del Pokémon"
                                        value={pokemonIds[movimiento.id] || ""}
                                        onChange={(e) => setPokemonIds((prev) => ({ ...prev, [movimiento.id]: e.target.value }))}
                                        className="mt-2"
                                    />
                                    <Button variant="success" onClick={() => handleAsociarMovimientoAPokemon(movimiento.id)}>Asociar a Pokémon</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>

            {/* Modal para crear/editar movimiento */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedMovimiento ? "Editar Movimiento" : "Crear Movimiento"}</Modal.Title>
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
                            <Form.Label>Poder</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.poder}
                                onChange={(e) => setFormData({ ...formData, poder: e.target.value })}
                                placeholder="Ingrese el poder"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Categoría</Form.Label>
                            <Form.Control
                                as="select"
                                value={formData.categoria}
                                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                            >
                                <option value="">Seleccione una categoría</option>
                                {categorias.map(categoria => (
                                    <option key={categoria} value={categoria}>{categoria}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Tipo</Form.Label>
                            <Form.Control
                                as="select"
                                value={formData.tipoId}
                                onChange={(e) => setFormData({ ...formData, tipoId: e.target.value })}
                            >
                                <option value="">Seleccione un tipo</option>
                                {tipos.map(tipo => (
                                    <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleCreateOrUpdateMovimiento}>Guardar</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Movimientos;