import React, { useState, useEffect } from 'react';
import { useUserContext } from '../hooks/userContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  TextField,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { styled } from '@mui/system'
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from "../hooks/api/axiosConfig";

const FormContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const FormGroupStyled = styled(FormGroup)({
  display: 'flex',
  flexWrap: 'wrap',
});

const FormControlStyled = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(1),
  minWidth: 120,
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const normalizeString = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const days = [
  { id: 1, name: 'Lunes' },
  { id: 2, name: 'Martes' },
  { id: 3, name: 'Miércoles' },
  { id: 4, name: 'Jueves' },
  { id: 5, name: 'Viernes' },
  { id: 6, name: 'Sábado' },
  { id: 7, name: 'Domingo' },
];

const Slot = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [clubId, setClubId] = useState('');
  const [canchas, setCanchas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [slotsAllowed, setSlotsAllowed] = useState(false);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (user) {
      axiosInstance.get(`/user/search-email?email=${user.email}`)
        .then((response) => {
          setUserInfo(response.data);
          if (response.data.role === 'ROLE_CLUB') {
            const name = response.data.firstName;
            axiosInstance.get(`/club/by-name/${name}`)
              .then((response) => {
                setClubId(response.data.id);
                if (response.data.id !== parseInt(id)) {
                  alert("No tiene permiso para acceder a esta página.");
                  navigate('/');
                } else {
                  setSlotsAllowed(true);
                  setIsLoading(false);
                }
              })
          } else {
            alert("No tiene permiso para acceder a esta página.");
            navigate('/');
          }
        })
        .catch((error) => setError(error));
    } else {
      alert("No tiene permiso para acceder a esta página.");
      navigate('/');
    }
  }, []);

  useEffect(() => {
    if (!isLoading && user && slotsAllowed) {
      fetchData();
    }
  }, [isLoading, user, slotsAllowed]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/club/${clubId}`);
      const club = response.data;
      const activities = club.activities;
      const canchasData = [];

      activities.forEach((activity) => {
        activity.courts.forEach((court) => {
          const canchaData = {
            cancha: court.name,
            id: court.id,
            conjuntosDias: [],
          };

          court.slots.forEach((slot) => {
            const conjuntoDias = slot.days.map((day) => days[day.id - 1].name).sort((a, b) => {
              const dayA = days.find((day) => normalizeString(day.name) === normalizeString(a));
              const dayB = days.find((day) => normalizeString(day.name) === normalizeString(b));
              return dayA.id - dayB.id;
            }).join(", ");

            const horario = `${slot.startTime} - ${slot.endTime}`;

            const conjuntoExistente = canchaData.conjuntosDias.find((conjunto) => conjunto.dias === conjuntoDias);
            if (conjuntoExistente) {
              conjuntoExistente.horarios.push({ id: slot.id, horario });
            } else {
              canchaData.conjuntosDias.push({ dias: conjuntoDias, horarios: [{ id: slot.id, horario }] });
            }
          });

          canchasData.push(canchaData);
        });
      });

      setCanchas(canchasData);
      setLoading(false);
    } catch (error) {
      setError(error);
    }
  };

  const handleGoBack = () => {
    if (location.pathname === '/booking/' + id) {
      navigate(-1);
    } else {
      navigate('/booking/' + id, { replace: true });
    }
  };

  const handleDeleteSlot = () => {
    axiosInstance
      .delete(`/slot/delete/${selectedSlot}`)
      .then((response) => {
        const updatedCanchas = canchas.map((cancha) => {
          const updatedConjuntosDias = cancha.conjuntosDias.map((conjunto) => {
            const updatedHorarios = conjunto.horarios.filter((horario) => horario.id !== selectedSlot);
            return { ...conjunto, horarios: updatedHorarios };
          });
          return { ...cancha, conjuntosDias: updatedConjuntosDias };
        });
        setCanchas(updatedCanchas);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setDialogOpen(false);
        setSelectedSlot(null);
      });
  };

  const handleOpenDialog = (slotId) => {
    setDialogOpen(true);
    setSelectedSlot(slotId);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSlot(null);
  };

  const handleAddSlot = () => {
    const daysToAdd = selectedDays.map((day) => ({ id: day }));
    const slotData = {
      court: { id: selectedCourt },
      capacity: 10,
      days: daysToAdd,
      startTime: startTime,
      endTime: endTime,
    };

    axiosInstance
      .post('/slot/add', slotData)
      .then((response) => {
        const updatedCanchas = canchas.map((cancha) => {
          if (cancha.id === selectedCourt) {
            const conjuntoDias = daysToAdd.map((day) => days[day.id - 1].name).sort((a, b) => {
              const dayA = days.find((day) => normalizeString(day.name) === normalizeString(a));
              const dayB = days.find((day) => normalizeString(day.name) === normalizeString(b));
              return dayA.id - dayB.id;
            }).join(", ");

            const horario = `${startTime} - ${endTime}`;

            const conjuntoExistente = cancha.conjuntosDias.find((conjunto) => conjunto.dias === conjuntoDias);
            if (conjuntoExistente) {
              conjuntoExistente.horarios.push({ id: response.data.id, horario });
            } else {
              cancha.conjuntosDias.push({ dias: conjuntoDias, horarios: [{ id: response.data.id, horario }] });
            }
          }
          return cancha;
        });

        setCanchas(updatedCanchas);
      })
      .catch((error) => console.error(error));

    setSelectedDays([]);
    setSelectedCourt('');
    setStartTime('');
    setEndTime('');
  };

  const handleDaySelection = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedDays((prevSelectedDays) => [...prevSelectedDays, value]);
    } else {
      setSelectedDays((prevSelectedDays) => prevSelectedDays.filter((day) => day !== value));
    }
  };

  const handleCourtSelection = (event) => {
    const selected = event.target.value;
    setSelectedCourt(selected);
  };

  const handleStartTimeChange = (event) => {
    const value = event.target.value;
    setStartTime(value);
  };

  const handleEndTimeChange = (event) => {
    const value = event.target.value;
    setEndTime(value);
  };

  return (
    <Container>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Paper>
          <Box p={2}>
            <Typography variant="h5">Horarios de turnos</Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cancha</TableCell>
                  <TableCell>Conjunto de Días</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {canchas.map((cancha, index) => (
                  <TableRow key={index}>
                    <TableCell>{cancha.cancha}</TableCell>
                    <TableCell>
                      {cancha.conjuntosDias.map((conjunto) => (
                        <div key={conjunto.dias}>
                          <strong>{conjunto.dias}:</strong>
                          {conjunto.horarios.map((horario) => (
                            <div key={horario.id} style={{ display: 'flex', alignItems: 'center' }}>
                              <div>{horario.horario}</div>
                              <IconButton onClick={() => handleOpenDialog(horario.id)}>
                                <DeleteIcon />
                              </IconButton>
                              <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                                <DialogTitle>Eliminar Horario</DialogTitle>
                                <DialogContent>
                                  <Typography variant="body1">¿Estás seguro de que deseas eliminar este horario?</Typography>
                                </DialogContent>
                                <DialogActions>
                                  <Button onClick={handleCloseDialog}>Cancelar</Button>
                                  <Button onClick={handleDeleteSlot} color="error">Eliminar</Button>
                                </DialogActions>
                              </Dialog>
                            </div>
                          ))}
                        </div>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box p={2}>
            <Typography variant="h5">---------------------------------</Typography>
          </Box>
          <FormContainer>
            <Typography variant="h5">Agregar Franja Horaria</Typography>
            <FormControlStyled component="fieldset">
              <FormLabel component="legend">Días</FormLabel>
              <FormGroup>
                {days.map((day) => (
                  <FormControlLabel
                    key={day.id}
                    control={<Checkbox checked={selectedDays.includes(day.id.toString())} onChange={handleDaySelection} value={day.id.toString()} />}
                    label={day.name}
                  />
                ))}
              </FormGroup>
            </FormControlStyled>
            <FormControlStyled>
              <InputLabel>Cancha</InputLabel>
              <Select value={selectedCourt} onChange={handleCourtSelection}>
                {canchas.map((cancha) => (
                  <MenuItem key={cancha.id} value={cancha.id}>
                    {cancha.cancha}
                  </MenuItem>
                ))}
              </Select>
            </FormControlStyled>
            <TextField
              label="Horario de Inicio"
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // Intervalo de 5 minutos
              }}
              sx={{ margin: '8px' }}
            />
            <TextField
              label="Horario de Fin"
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // Intervalo de 5 minutos
              }}
              sx={{ margin: '8px' }}
            />
            <ButtonStyled variant="contained" color="primary" onClick={handleAddSlot}>
              Agregar
            </ButtonStyled>
          </FormContainer>
        </Paper>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <IconButton onClick={handleGoBack} variant="contained" color="primary">
          Volver a reservas
        </IconButton>
      </div>
    </Container>
  );
};

export default Slot;