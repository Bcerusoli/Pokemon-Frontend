import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Table, Container, Modal, Form } from "react-bootstrap";
import Menu from "../components/Menu";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Admin = () => {
    const { getAuthUser, isAuthenticated } = useAuth();
    const { token, role } = getAuthUser();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [newPassword, setNewPassword] = useState("");

    
    useEffect(() => {
        if (!isAuthenticated || !token || role !== "admin") {
            navigate('/login');
        }
    }, [isAuthenticated, token, role, navigate]);

   
    useEffect(() => {
        if (isAuthenticated && token && role === "admin") {
            axios.get('http://localhost:3000/usuarios', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((res) => {
                    setUsers(res.data);
                }).catch((err) => {
                    console.error("Error fetching users:", err);
                    alert("Error al obtener la lista de usuarios. Verifica tu conexión o permisos.");
                });
        }
    }, [token, isAuthenticated, role]);

    const changeRole = (id, role) => {
        axios.put(`http://localhost:3000/usuarios/${id}/role`, { role }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                alert(`Rol actualizado a ${role}`);
                setUsers(users.map(user => user.id === id ? { ...user, role } : user));
            }).catch((err) => {
                console.error("Error updating user role:", err);
                alert("Error al actualizar el rol del usuario.");
            });
    };

    const updatePassword = () => {
        axios.put(`http://localhost:3000/usuarios/${selectedUserId}/password`, { password: newPassword }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                alert("Contraseña actualizada correctamente");
                setShowModal(false);
                setNewPassword("");
            }).catch((err) => {
                console.error("Error updating user password:", err);
                alert("Error al actualizar la contraseña del usuario.");
            });
    };

    const openPasswordModal = (id) => {
        setSelectedUserId(id);
        setShowModal(true);
    };

    return (
        <>
            <Menu />
            <Container className="mt-3">
                <h2>Lista de Usuarios</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Nombre de Usuario</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.email}</td>
                                <td>{user.nombreUsuario}</td>
                                <td>{user.role}</td>
                                <td>
                                    {user.role !== 'admin' && (
                                        <Button variant="success" onClick={() => changeRole(user.id, 'admin')}>Hacer Admin</Button>
                                    )}
                                    {user.role !== 'user' && (
                                        <Button variant="warning" onClick={() => changeRole(user.id, 'user')}>Hacer Usuario</Button>
                                    )}
                                    <Button variant="info" onClick={() => openPasswordModal(user.id)}>Editar Contraseña</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>

            {/* Modal para editar contraseña */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Contraseña</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Nueva Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Ingrese la nueva contraseña"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={updatePassword}>Guardar</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Admin;