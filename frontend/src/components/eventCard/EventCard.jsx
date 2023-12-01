import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    CardMedia,
    CardHeader,
    Button,
    Paper,
} from "@mui/material";

import eventoImagen from "../../assets/club-field.png"

function EventCard() {
    return (
        <>
            <Card 
            variant="outlined" 
            sx={{
                border: "1px solid #434242",
                transition: 'box-shadow 0.3s',
                '&:hover':{
                    boxShadow: '0 0 5px 5px rgb(195, 253, 116, 0.2)'
                }
                }}>
                <CardContent>
                    <Typography variant="h6" color="primary.main">
                        Club: Deportivo Test FC
                    </Typography>
                    <Typography variant="h6" color="primary.main">Nombre del Evento</Typography>
                    <Typography variant="body2" color="secondary.main">Fecha: DD/MM/AAAA</Typography>
                    <Typography variant="body2" color="secondary.main">
                        Lugares Disponibles: X
                    </Typography>
                </CardContent>
                <CardMedia
                    component="img"
                    alt="Imagen del Evento"
                    height="200"
                    image={eventoImagen}
                />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 2,
                        mb: 2,
                    }}
                >
                    <Button variant="contained" color="secondary">
                        Ver Detalles
                    </Button>
                </Box>
            </Card>
        </>
    );
}

export default EventCard;
