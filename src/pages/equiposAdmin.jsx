import { useEffect, useState } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import Menu from "../components/Menu";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EquiposAdmin = () => {
    const { getAuthUser } = useAuth();
    const { token, role } = getAuthUser(); 
    const navigate = useNavigate();

    const [equipos, setEquipos] = useState([]);
    const [pokemonesPorEquipo, setPokemonesPorEquipo] = useState({}); 
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ nombre: "" });

    useEffect(() => {
        console.log("Token:", token);
        console.log("Role:", role);

        
        if (!token) {
            console.log("Redirigiendo al Login...");
            navigate("/login"); 
            return;
        }

       
        axios.get("http://localhost:3000/equipos", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setEquipos(res.data);
                res.data.forEach((equipo) => {
                    axios.get(`http://localhost:3000/pokemonEquipos/${equipo.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                        .then((res) => {
                            setPokemonesPorEquipo((prev) => ({
                                ...prev,
                                [equipo.id]: res.data, 
                            }));
                        })
                        .catch((err) => console.error(`Error fetching pokemones for equipo ${equipo.id}:`, err));
                });
            })
            .catch((err) => console.error("Error fetching equipos:", err));
    }, [token, navigate]);

    const handleCreateEquipo = () => {
        axios.post("http://localhost:3000/equipos", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                alert("Equipo creado correctamente");
                setEquipos([...equipos, res.data]);
                setShowModal(false);
                setFormData({ nombre: "" });
            })
            .catch((err) => {
                console.error("Error creating equipo:", err);
                alert("Error al crear el equipo");
            });
    };

    const openModal = () => {
        setShowModal(true);
    };

    const handleEditEquipo = (id) => {
        // Redirigir a la página de edición del equipo
        navigate(`/equipos/${id}`);
    };

    return (
        <>
            <Menu />
            <Container className="mt-5">
                <h2>Administración de Equipos</h2>
                {(role === "admin" || role === "user") && (
                    <Button variant="primary" onClick={openModal}>Crear Equipo</Button>
                )}
                <Table striped bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Pokémon</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipos.map((equipo) => (
                            <tr key={equipo.id}>
                                <td>{equipo.id}</td>
                                <td>{equipo.nombre}</td>
                                <td>
                                    {/* Mostrar imágenes de los Pokémon del equipo */}
                                    {pokemonesPorEquipo[equipo.id]?.map((pokemon) => (
                                        <img
                                            key={pokemon.id}
                                            src={`http://localhost:3000${pokemon.pokemon.imagen}`}
                                            alt={pokemon.pokemon.nombre}
                                            style={{ width: "50px", height: "50px", marginRight: "5px" }}
                                        />
                                    ))}
                                </td>
                                <td>
                                    <Button variant="info" onClick={() => handleEditEquipo(equipo.id)}>Editar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>

            {/* Modal para crear equipo */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Equipo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Nombre del Equipo</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ nombre: e.target.value })}
                                placeholder="Ingrese el nombre del equipo"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleCreateEquipo}>Guardar</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EquiposAdmin;