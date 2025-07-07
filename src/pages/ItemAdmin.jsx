import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Table, Container, Modal, Form } from "react-bootstrap";
import Menu from "../components/Menu";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ItemAdmin = () => {
    const { getAuthUser } = useAuth();
    const { token, role } = getAuthUser(); 
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({ nombre: "", descripcion: "", imagen: null });

    useEffect(() => {
        
        if (!token || role !== "admin") {
            navigate("/login"); 
            return;
        }

        
        axios.get('http://localhost:3000/items', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                setItems(res.data);
            }).catch((err) => {
                console.error("Error fetching items:", err);
                alert("Error al obtener la lista de ítems. Verifica tu conexión o permisos.");
            });
    }, [token, role, navigate]);

    const handleCreateOrUpdateItem = () => {
        const url = selectedItem ? `http://localhost:3000/items/${selectedItem.id}` : 'http://localhost:3000/items';
        const method = selectedItem ? 'put' : 'post';

        const formDataToSend = new FormData();
        formDataToSend.append("nombre", formData.nombre);
        formDataToSend.append("descripcion", formData.descripcion);
        if (formData.imagen) {
            formDataToSend.append("imagen", formData.imagen);
        }

        axios[method](url, formDataToSend, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            }
        })
            .then(() => {
                alert(selectedItem ? "Ítem actualizado correctamente" : "Ítem creado correctamente");
                setShowModal(false);
                setFormData({ nombre: "", descripcion: "", imagen: null });
                setSelectedItem(null);
                axios.get('http://localhost:3000/items', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then((res) => setItems(res.data));
            }).catch((err) => {
                console.error("Error creating/updating item:", err);
                alert("Error al crear/actualizar el ítem.");
            });
    };

    const handleDeleteItem = (id) => {
        axios.delete(`http://localhost:3000/items/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                alert("Ítem eliminado correctamente");
                setItems(items.filter(item => item.id !== id));
            }).catch((err) => {
                console.error("Error deleting item:", err);
                alert("Error al eliminar el ítem.");
            });
    };

    const openModal = (item = null) => {
        setSelectedItem(item);
        setFormData(item ? { nombre: item.nombre, descripcion: item.descripcion, imagen: null } : { nombre: "", descripcion: "", imagen: null });
        setShowModal(true);
    };

    return (
        <>
            <Menu />
            <Container className="mt-3">
                <h2>Gestión de Ítems</h2>
                <Button variant="primary" onClick={() => openModal()}>Crear Ítem</Button>
                <Table striped bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Imagen</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.nombre}</td>
                                <td>{item.descripcion}</td>
                                <td><img src={`http://localhost:3000${item.imagen}`} alt={item.nombre} style={{ width: "100px" }} /></td>
                                <td>
                                    <Button variant="info" onClick={() => openModal(item)}>Editar</Button>
                                    <Button variant="danger" onClick={() => handleDeleteItem(item.id)}>Eliminar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>

            {/* Modal para crear/editar ítem */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedItem ? "Editar Ítem" : "Crear Ítem"}</Modal.Title>
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
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                placeholder="Ingrese la descripción"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Imagen</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => setFormData({ ...formData, imagen: e.target.files[0] })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleCreateOrUpdateItem}>Guardar</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ItemAdmin;