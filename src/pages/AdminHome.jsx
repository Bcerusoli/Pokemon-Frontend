import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Menu from '../components/Menu';
import { useAuth } from '../../hooks/useAuth';
import listaImg from '../assets/lista.png'; 
import itemsImg from '../assets/items.jpg'; 
import movimientosImg from '../assets/movimientos.png'; 
import pokemonesImg from '../assets/pokemones.jpg'; 
import equiposImg from '../assets/equipos.jpg'; 
import { useEffect } from 'react';

const AdminHome = () => {
    const { isAuthenticated, getAuthUser } = useAuth();
    const navigate = useNavigate();
    const { token, role } = getAuthUser(); 

    useEffect(() => {
        
        if (!isAuthenticated || !token || role !== 'admin') {
            navigate('/login');
        }
    }, [isAuthenticated, token, role, navigate]);

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <>
            <Menu />
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={4}>
                        <Card className="text-center">
                            <Card.Body>
                                <img src={listaImg} alt="Lista de Usuarios" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                <Card.Title>Lista de Usuarios</Card.Title>
                                <Button variant="primary" onClick={() => handleNavigate('/admin')}>
                                    Ir a Lista de Usuarios
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center">
                            <Card.Body>
                                <img src={itemsImg} alt="Gestión de Ítems" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                <Card.Title>Gestión de Ítems</Card.Title>
                                <Button variant="primary" onClick={() => handleNavigate('/item')}>
                                    Ir a Gestión de Ítems
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-4">
                    <Col md={4}>
                        <Card className="text-center">
                            <Card.Body>
                                <img src={movimientosImg} alt="Movimientos" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                <Card.Title>Movimientos</Card.Title>
                                <Button variant="primary" onClick={() => handleNavigate('/movimientos')}>
                                    Ir a Movimientos
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center">
                            <Card.Body>
                                <img src={pokemonesImg} alt="Pokemones" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                <Card.Title>Pokemones</Card.Title>
                                <Button variant="primary" onClick={() => handleNavigate('/pokemones')}>
                                    Ir a Pokemones
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-4">
                    <Col md={4}>
                        <Card className="text-center">
                            <Card.Body>
                                <img src={equiposImg} alt="Administración de Equipos" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                <Card.Title>Administración de Equipos</Card.Title>
                                <Button variant="primary" onClick={() => handleNavigate('/equipos')}>
                                    Ir a Administración de Equipos
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AdminHome;