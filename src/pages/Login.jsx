import axios from "axios";
import { useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, Row } from "react-bootstrap";
import Menu from "../components/Menu";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
    const { loginUser } = useAuth();
    const navigate = useNavigate();
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [password, setPassword] = useState('');

    const onFormSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/auth/login', { nombreUsuario, password })
            .then((res) => {
                console.log(res.data);
                const token = res.data.token;
                const role = res.data.role; 
                loginUser(token, nombreUsuario, role); 
                if (role === 'admin') {
                    navigate('/adminHome'); 
                } else {
                    navigate('/equipos'); 
                }
            }).catch((err) => {
                console.log(err);
                if (err.response?.status === 401) {
                    alert("Nombre de usuario o contraseña incorrectos");
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
                            <Card.Header>Iniciar sesión</Card.Header>
                            <Card.Body>
                                <div>
                                    <Form onSubmit={onFormSubmit}>
                                        <div>
                                            <label>Nombre de Usuario</label>
                                            <FormControl required type="text" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} />
                                        </div>
                                        <div>
                                            <label>Contraseña</label>
                                            <FormControl required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        </div>
                                        <div className="mt-2">
                                            <Button variant="primary" type="submit">Enviar</Button>
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

export default Login;