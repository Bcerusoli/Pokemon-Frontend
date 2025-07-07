import axios from "axios";
import { useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, Row } from "react-bootstrap";
import Menu from "../components/Menu";
import { useNavigate } from "react-router";

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombreUsuario, setNombreUsuario] = useState('');

    const onFormSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/auth/register', { email, password, nombreUsuario })
            .then((res) => {
                console.log(res.data);
                navigate('/login');
            }).catch((err) => {
                console.log(err);
                if (err.response?.status === 400) {
                    alert("El nombre de usuario ya existe o los datos son inválidos");
                    return;
                }
                if (err.response?.status === 500) {
                    alert("Error en registrar usuario, por favor intente nuevamente");
                }
            });
    };

    return (
        <>
            <Menu />
            <Container className="mt-3">
                <Row>
                    <Col xs={6}>
                        <Card>
                            <Card.Header>Registro</Card.Header>
                            <Card.Body>
                                <div>
                                    <Form onSubmit={onFormSubmit}>
                                        <div>
                                            <label>Email</label>
                                            <FormControl required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                        <div>
                                            <label>Contraseña</label>
                                            <FormControl required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        </div>
                                        <div>
                                            <label>Nombre de Usuario</label>
                                            <FormControl required type="text" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} />
                                        </div>
                                        <div className="mt-2">
                                            <Button variant="primary" type="submit">Registro</Button>
                                        </div>
                                    </Form>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Register;