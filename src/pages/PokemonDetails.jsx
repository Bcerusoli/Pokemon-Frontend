import { useEffect, useState } from "react";
import { Container, Card, Form, Button, CardTitle } from "react-bootstrap";
import Menu from "../components/Menu";
import { useAuth } from "../../hooks/useAuth";
import { useParams } from "react-router"; 
import axios from "axios";

const PokemonDetails = () => {
    const { getAuthUser } = useAuth();
    const { token } = getAuthUser();
    const params = useParams(); 

    const [pokemonDetails, setPokemonDetails] = useState(null); 
    const [nickname, setNickname] = useState(""); 
    const [sliderValues, setSliderValues] = useState({}); 
    const [items, setItems] = useState([]); 
    const [filteredItems, setFilteredItems] = useState([]); 
    const [searchItem, setSearchItem] = useState(""); 
    const [showItems, setShowItems] = useState(false); 
    const [habilidades, setHabilidades] = useState([]); 
    const [filteredHabilidades, setFilteredHabilidades] = useState([]); 
    const [searchHabilidad, setSearchHabilidad] = useState(""); 
    const [showHabilidades, setShowHabilidades] = useState(false); 
    const [movimientos, setMovimientos] = useState([]); 
    const [selectedMovimientos, setSelectedMovimientos] = useState([null, null, null, null]); 
    const [filteredMovimientos, setFilteredMovimientos] = useState([[], [], [], []]); 
    const [searchMovimientos, setSearchMovimientos] = useState(["", "", "", ""]); 
    const [showMovimientos, setShowMovimientos] = useState([false, false, false, false]); 
    
    useEffect(() => {
        axios.get(`http://localhost:3000/pokemonEquipos/${params.pokemonId}/details`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setPokemonDetails({
                   ...res.data.pokemon,
                    pokemonEquipoId: res.data.id, // Asignar el ID del Pokémon en el equipo
                    apodo: res.data.apodo || "Sin apodo",
                    imagen: res.data.pokemon.imagen,
                    ivHP: res.data.ivHP,
                    ivAtaque: res.data.ivAtaque,
                    ivDefensa: res.data.ivDefensa,
                    ivAtaqueEspecial: res.data.ivAtaqueEspecial,
                    ivDefensaEspecial: res.data.ivDefensaEspecial,
                    ivVelocidad: res.data.ivVelocidad,
                });
                setSliderValues({
                    baseHP: res.data.pokemon.baseHP,
                    baseAtaque: res.data.pokemon.baseAtaque,
                    baseDefensa: res.data.pokemon.baseDefensa,
                    baseAtaqueEspecial: res.data.pokemon.baseAtaqueEspecial,
                    baseDefensaEspecial: res.data.pokemon.baseDefensaEspecial,
                    baseVelocidad: res.data.pokemon.baseVelocidad,
                });
                setNickname(""); 
            })
            .catch((err) => {
                console.error("Error fetching pokemon details:", err);
                alert("Error al obtener los detalles del Pokémon");
            });
            
        // Obtener lista de ítems
        axios.get("http://localhost:3000/items", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setItems(res.data);
                setFilteredItems(res.data); 
            })
            .catch((err) => {
                console.error("Error fetching items:", err);
                alert("Error al obtener la lista de ítems");
            });
            axios.get(`http://localhost:3000/pokemonTipos/${params.pokemonId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => {
            setPokemonDetails((prevDetails) => ({
                ...prevDetails,
                tipos: res.data || [], // Añadir los tipos al estado
            }));
        })
        .catch((err) => {
            console.error("Error fetching pokemon types:", err);
            alert("Error al obtener los tipos del Pokémon");
        });

        // Obtener lista de habilidades
        axios.get(`http://localhost:3000/habilidades/${params.pokemonId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setHabilidades(res.data); 
                setFilteredHabilidades(res.data); 
            })
            .catch((err) => {
                console.error("Error fetching habilidades:", err);
                alert("Error al obtener la lista de habilidades");
            });

        // Obtener lista de movimientos
        axios.get(`http://localhost:3000/pokemonEquipoMovimientos/${params.pokemonId}/movimientos`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setMovimientos(res.data); 
                setFilteredMovimientos([res.data, res.data, res.data, res.data]);
            })
            .catch((err) => {
                console.error("Error fetching movimientos:", err);
                alert("Error al obtener la lista de movimientos");
            });
    }, [params.pokemonId, token]); 

    const handleSliderChange = (attribute, value) => {
        setSliderValues((prevValues) => ({
            ...prevValues,
            [attribute]: value,
        }));
    };

    const handleSaveChanges = () => {
        setPokemonDetails((prevDetails) => ({
            ...prevDetails,
            ...sliderValues,
        }));
        alert("Poderes actualizados correctamente");
    };

    const handleUpdateNickname = () => {
    const { id } = params; 

    if (!id) {
        alert("No se encontró el ID del Pokémon en el equipo");
        return;
    }

    if (!nickname.trim()) {
        alert("El apodo no puede estar vacío");
        return;
    }

    axios.put(`http://localhost:3000/pokemonEquipos/${id}/nickname`, { apodo: nickname }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then(() => {
            alert("Apodo actualizado correctamente");
            setPokemonDetails((prevDetails) => ({
                ...prevDetails,
                apodo: nickname, // Actualizar el estado con el nuevo apodo
            }));
            setNickname("");
        })
        .catch((err) => {
            console.error("Error updating nickname:", err);
            alert(`Error al actualizar el apodo: ${err.response?.data?.message || "Error desconocido"}`);
        });
};
    const handleSearchItem = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchItem(searchTerm);

        // Filtrar ítems en función del término de búsqueda
        const filtered = items.filter((item) =>
            item.nombre.toLowerCase().includes(searchTerm)
        );
        setFilteredItems(filtered);
    };

    const handleSearchHabilidad = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchHabilidad(searchTerm);

       
        const filtered = habilidades.filter((habilidad) =>
            habilidad.nombre.toLowerCase().includes(searchTerm)
        );
        setFilteredHabilidades(filtered);
    };

    const handleSelectItem = (itemId) => {
    const { id } = params; 

    if (!id) {
        alert("No se encontró el ID del Pokémon en el equipo");
        return;
    }

    axios.put(`http://localhost:3000/pokemonEquipos/${id}/item`, { itemId }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then(() => {
            alert("Ítem asignado correctamente");
            setPokemonDetails((prevDetails) => ({
                ...prevDetails,
                itemId, 
            }));
        })
        .catch((err) => {
            console.error("Error assigning item:", err);
            alert(`Error al asignar el ítem: ${err.response?.data?.message || "Error desconocido"}`);
        });
};
    const handleSelectHabilidad = (habilidadId) => {
    const { id } = params; 

    if (!id) {
        alert("No se encontró el ID del Pokémon en el equipo");
        return;
    }

    axios.put(`http://localhost:3000/pokemonEquipos/${id}/habilidad`, { habilidadId }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then(() => {
            alert("Habilidad asignada correctamente");
            setPokemonDetails((prevDetails) => ({
                ...prevDetails,
                habilidadId, 
            }));
        })
        .catch((err) => {
            console.error("Error assigning habilidad:", err);
            alert(`Error al asignar la habilidad: ${err.response?.data?.message || "Error desconocido"}`);
        });
};
    const handleSearchMovimiento = (slotIndex, e) => {
        const searchTerm = e.target.value.toLowerCase();
        const newSearchMovimientos = [...searchMovimientos];
        newSearchMovimientos[slotIndex] = searchTerm;
        setSearchMovimientos(newSearchMovimientos);

        
        const filtered = movimientos.filter((movimiento) =>
            movimiento.nombre.toLowerCase().includes(searchTerm)
        );
        
        const newFilteredMovimientos = [...filteredMovimientos];
        newFilteredMovimientos[slotIndex] = filtered;
        setFilteredMovimientos(newFilteredMovimientos);
    };

    const handleSelectMovimiento = (slotIndex, movimiento) => {
        const newSelectedMovimientos = [...selectedMovimientos];
        newSelectedMovimientos[slotIndex] = movimiento;
        setSelectedMovimientos(newSelectedMovimientos);

        
        const newShowMovimientos = [...showMovimientos];
        newShowMovimientos[slotIndex] = false;
        setShowMovimientos(newShowMovimientos);

        
        const newSearchMovimientos = [...searchMovimientos];
        newSearchMovimientos[slotIndex] = "";
        setSearchMovimientos(newSearchMovimientos);
    };

    const handleAssignMovimientos = () => {
        
        const movimientosIds = selectedMovimientos
            .filter(mov => mov !== null)
            .map(mov => mov.id);

        if (movimientosIds.length === 0) {
            alert("Selecciona al menos un movimiento");
            return;
        }

        axios.put(`http://localhost:3000/pokemonEquipoMovimientos/${params.id}/movimientos`, { movimientos: movimientosIds }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => {
                alert("Movimientos asignados correctamente");
            })
            .catch((err) => {
                console.error("Error assigning movimientos:", err);
                alert(`Error al asignar los movimientos: ${err.response?.data?.message || "Error desconocido"}`);
            });
    };



    if (!pokemonDetails) {
        return <p>Cargando detalles del Pokémon...</p>;
    }

    return (
        <>
            <Menu />
            <Container className="mt-5">
            <h2>Detalles del Pokémon</h2>
            <Card className="mt-3">
                <Card.Img
                    variant="top"
                    src={`http://localhost:3000${pokemonDetails.imagen}`}
                    alt={pokemonDetails.nombre}
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
                <Card.Title>
                {pokemonDetails.tipos && pokemonDetails.tipos.length > 0
                    ? pokemonDetails.tipos.map((tipo) => tipo.nombre).join(", ")
                    : "Sin tipos asignados"}
                 </Card.Title>
                    <Card.Body>
                        <Card.Title>{pokemonDetails.nombre}</Card.Title>
                            <Card.Text>
                            {/* Selector de Movimientos */}
                            <Form.Group className="mb-4">
                                <Form.Label><h5>Seleccionar Movimientos (máximo 4)</h5></Form.Label>
                                {[0, 1, 2, 3].map((slotIndex) => (
                                    <div key={slotIndex} className="mb-3">
                                        <Form.Label>Movimiento {slotIndex + 1}</Form.Label>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <Form.Control
                                                type="text"
                                                placeholder={`Buscar movimiento ${slotIndex + 1}...`}
                                                value={searchMovimientos[slotIndex]}
                                                onChange={(e) => handleSearchMovimiento(slotIndex, e)}
                                                onFocus={() => {
                                                    const newShowMovimientos = [...showMovimientos];
                                                    newShowMovimientos[slotIndex] = true;
                                                    setShowMovimientos(newShowMovimientos);
                                                }}
                                                onBlur={() => {
                                                    
                                                    setTimeout(() => {
                                                        const newShowMovimientos = [...showMovimientos];
                                                        newShowMovimientos[slotIndex] = false;
                                                        setShowMovimientos(newShowMovimientos);
                                                    }, 200);
                                                }}
                                                style={{ flex: 1 }}
                                            />
                                            <span style={{ minWidth: "200px", color: "#666" }}>
                                                {selectedMovimientos[slotIndex] 
                                                    ? `Seleccionado: ${selectedMovimientos[slotIndex].nombre}`
                                                    : "No seleccionado"
                                                }
                                            </span>
                                            {selectedMovimientos[slotIndex] && (
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => {
                                                        const newSelected = [...selectedMovimientos];
                                                        newSelected[slotIndex] = null;
                                                        setSelectedMovimientos(newSelected);
                                                    }}
                                                >
                                                    ✕
                                                </Button>
                                            )}
                                        </div>
                                        {showMovimientos[slotIndex] && searchMovimientos[slotIndex] && (
                                            <div style={{ 
                                                border: "1px solid #ccc", 
                                                borderRadius: "5px", 
                                                padding: "5px", 
                                                maxHeight: "200px", 
                                                overflowY: "auto",
                                                marginTop: "5px",
                                                backgroundColor: "white",
                                                position: "relative",
                                                zIndex: 1000
                                            }}>
                                                {filteredMovimientos[slotIndex].map((movimiento) => (
                                                    <div
                                                        key={movimiento.id}
                                                        onClick={() => handleSelectMovimiento(slotIndex, movimiento)}
                                                        style={{
                                                            padding: "8px",
                                                            cursor: "pointer",
                                                            borderBottom: "1px solid #eee",
                                                            backgroundColor: selectedMovimientos[slotIndex]?.id === movimiento.id ? "#e3f2fd" : "transparent"
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                                                        onMouseLeave={(e) => e.target.style.backgroundColor = selectedMovimientos[slotIndex]?.id === movimiento.id ? "#e3f2fd" : "transparent"}
                                                    >
                                                        <strong>{movimiento.nombre}</strong>
                                                        <br />
                                                        <small style={{ color: "#666" }}>
                                                           Poder: {movimiento.poder} | Categoría: {movimiento.categoria} | Tipo: {movimiento.tipo?.nombre || "Desconocido"}
                                                        </small>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <Button 
                                    variant="success" 
                                    onClick={handleAssignMovimientos}
                                    disabled={!selectedMovimientos.some(mov => mov !== null)}
                                    className="mt-2"
                                >
                                    Asignar Movimientos
                                </Button>
                            </Form.Group>
                            
                            <h5 style={{ marginBottom: "15px", textAlign: "right", marginRight: "10px" }}>IVs</h5> {}
                            <ul style={{ listStyleType: "none", padding: 0 }}>
                                <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                    <span style={{ flex: "0 0 150px" }}>HP: {pokemonDetails.baseHP}</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="200"
                                        value={sliderValues.baseHP}
                                        onChange={(e) => handleSliderChange("baseHP", e.target.value)}
                                        style={{ marginLeft: "auto", marginRight: "10px" }}
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        max="31"
                                        value={pokemonDetails.ivHP}
                                        onChange={(e) => setPokemonDetails((prevDetails) => ({
                                            ...prevDetails,
                                            ivHP: Math.max(0, Math.min(31, e.target.value)), 
                                        }))}
                                        style={{ width: "60px" }}
                                    />
                                </li>
                                <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                    <span style={{ flex: "0 0 150px" }}>Ataque: {pokemonDetails.baseAtaque}</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="200"
                                        value={sliderValues.baseAtaque}
                                        onChange={(e) => handleSliderChange("baseAtaque", e.target.value)}
                                        style={{ marginLeft: "auto", marginRight: "10px" }}
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        max="31"
                                        value={pokemonDetails.ivAtaque}
                                        onChange={(e) => setPokemonDetails((prevDetails) => ({
                                            ...prevDetails,
                                            ivAtaque: Math.max(0, Math.min(31, e.target.value)), 
                                        }))}
                                        style={{ width: "60px" }}
                                    />
                                </li>
                                <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                    <span style={{ flex: "0 0 150px" }}>Defensa: {pokemonDetails.baseDefensa}</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="200"
                                        value={sliderValues.baseDefensa}
                                        onChange={(e) => handleSliderChange("baseDefensa", e.target.value)}
                                        style={{ marginLeft: "auto", marginRight: "10px" }}
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        max="31"
                                        value={pokemonDetails.ivDefensa}
                                        onChange={(e) => setPokemonDetails((prevDetails) => ({
                                            ...prevDetails,
                                            ivDefensa: Math.max(0, Math.min(31, e.target.value)), 
                                        }))}
                                        style={{ width: "60px" }}
                                    />
                                </li>
                                <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                    <span style={{ flex: "0 0 150px" }}>Ataque Especial: {pokemonDetails.baseAtaqueEspecial}</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="200"
                                        value={sliderValues.baseAtaqueEspecial}
                                        onChange={(e) => handleSliderChange("baseAtaqueEspecial", e.target.value)}
                                        style={{ marginLeft: "auto", marginRight: "10px" }}
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        max="31"
                                        value={pokemonDetails.ivAtaqueEspecial}
                                        onChange={(e) => setPokemonDetails((prevDetails) => ({
                                            ...prevDetails,
                                            ivAtaqueEspecial: Math.max(0, Math.min(31, e.target.value)), 
                                        }))}
                                        style={{ width: "60px" }}
                                    />
                                </li>
                                <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                    <span style={{ flex: "0 0 150px" }}>Defensa Especial: {pokemonDetails.baseDefensaEspecial}</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="200"
                                        value={sliderValues.baseDefensaEspecial}
                                        onChange={(e) => handleSliderChange("baseDefensaEspecial", e.target.value)}
                                        style={{ marginLeft: "auto", marginRight: "10px" }}
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        max="31"
                                        value={pokemonDetails.ivDefensaEspecial}
                                        onChange={(e) => setPokemonDetails((prevDetails) => ({
                                            ...prevDetails,
                                            ivDefensaEspecial: Math.max(0, Math.min(31, e.target.value)), 
                                        }))}
                                        style={{ width: "60px" }}
                                    />
                                </li>
                                <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                    <span style={{ flex: "0 0 150px" }}>Velocidad: {pokemonDetails.baseVelocidad}</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="200"
                                        value={sliderValues.baseVelocidad}
                                        onChange={(e) => handleSliderChange("baseVelocidad", e.target.value)}
                                        style={{ marginLeft: "auto", marginRight: "10px" }}
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        max="31"
                                        value={pokemonDetails.ivVelocidad}
                                        onChange={(e) => setPokemonDetails((prevDetails) => ({
                                            ...prevDetails,
                                            ivVelocidad: Math.max(0, Math.min(31, e.target.value)), 
                                        }))}
                                        style={{ width: "60px" }}
                                    />
                                </li>
                            </ul>
                            <Button variant="primary" onClick={handleSaveChanges} className="mt-3">
                                Guardar Cambios
                            </Button>
                            <p><strong>Apodo:</strong> {pokemonDetails.apodo || "Sin apodo"}</p>
                            
                        </Card.Text>
                        <Form>
                        <Form.Group>
                            <Form.Label>Apodo</Form.Label>
                            <Form.Control
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="Ingrese un apodo para el Pokémon"
                            />
                            </Form.Group>
                            <Button variant="primary" onClick={handleUpdateNickname} className="mt-3">
                                Guardar Apodo
                            </Button>
                            {/* Selector de ítems */}
                            <Form.Group className="mt-3">
                                <Form.Label>Seleccionar Ítem</Form.Label>
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowItems(!showItems)} 
                                    style={{ marginBottom: "10px", width: "100%" }}
                                >
                                    {showItems ? "Ocultar Ítems" : "Mostrar Ítems"}
                                </Button>
                                {showItems && (
                                    <div>
                                        <Form.Control
                                            type="text"
                                            placeholder="Buscar ítem..."
                                            value={searchItem}
                                            onChange={handleSearchItem} // Actualizar el término de búsqueda
                                            style={{ marginBottom: "10px" }}
                                        />
                                        <div style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "10px", maxHeight: "300px", overflowY: "auto" }}>
                                            {filteredItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => handleSelectItem(item.id)} 
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        marginBottom: "10px",
                                                        cursor: "pointer",
                                                        padding: "5px",
                                                        borderBottom: "1px solid #eee",
                                                    }}
                                                >
                                                    <img
                                                        src={`http://localhost:3000${item.imagen}`}
                                                        alt={item.nombre}
                                                        style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "10px" }}
                                                    />
                                                    <span>{item.nombre} - {item.descripcion}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Form.Group>
                         <Form.Group className="mt-3">
                            <Form.Label>Seleccionar una habilidad</Form.Label>
                            <Button
                                variant="secondary"
                                onClick={() => setShowHabilidades(!showHabilidades)} // Alternar visibilidad de la lista
                                style={{ marginBottom: "10px", width: "100%" }}
                            >
                                {showHabilidades ? "Ocultar Habilidades" : "Mostrar Habilidades"}
                            </Button>
                            {showHabilidades && (
                                <div>
                                    <Form.Control
                                        type="text"
                                        placeholder="Buscar habilidad..."
                                        value={searchHabilidad}
                                        onChange={handleSearchHabilidad} 
                                        style={{ marginBottom: "10px" }}
                                    />
                                    <div style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "10px", maxHeight: "300px", overflowY: "auto" }}>
                                        {filteredHabilidades.map((habilidad) => (
                                            <div
                                                key={habilidad.id}
                                                onClick={() => handleSelectHabilidad(habilidad.id)} 
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginBottom: "10px",
                                                    cursor: "pointer",
                                                    padding: "5px",
                                                    borderBottom: "1px solid #eee",
                                                }}
                                            >
                                                <span>{habilidad.nombre}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default PokemonDetails;