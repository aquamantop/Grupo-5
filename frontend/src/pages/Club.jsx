import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router';
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import { Container, Paper, Typography, Box, Button, Link, Grid } from '@mui/material'
import { PaperSXX } from '../components/customMui/CustomMui'
import { ClubInfo } from '../components/clubShowcase/ClubInfo'
import axiosInstance from "../hooks/api/axiosConfig";
import { BoxSX } from '../components/customMui/CustomMui';
const Club = () => {
    const { id } = useParams();

    const [club, setClub] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
            axiosInstance.get(`/club/${id}`)
            .then((response) => {
                setClub(response.data)
                setLoading(false)
            })
            .catch((error) => setError(error))
    }, [])

    return (
        <>
        {loading && <p>Loading...</p>}
        {
            !loading && (
                    <>
                    
                    <Container className="content" sx={{my:2}}>
              <Paper sx={PaperSXX}>
                  <Box sx={{...BoxSX}}>
                      <Typography variant="h5" color="primary.main">
                          { club.name } | { club.address }
                      </Typography>
                  </Box>
                  <ClubInfo club={ club }/>
              </Paper>
          </Container>
          
            </>
            )}
        </>
  );
}

export default Club