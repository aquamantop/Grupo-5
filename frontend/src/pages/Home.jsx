import {useState} from "react";
import EventSearch from "../components/EventSearch/EventSearch";
import EventShowcase from "../components/eventShowcase/EventShowcase";
import { Grid, Tabs, Tab } from "@mui/material";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import ClubShowcase from "../components/clubShowcase/ClubShowcase";
import { TabsSX } from "../components/customMui/CustomMui";


function Home() {
  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <>
      <Header />
      <Grid
        container
        className="content"
        sx={{ height:"auto", mx: "auto", maxWidth: "1400px", display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop:'30px'}}
      >
        <Grid item xs={12} sm={3}>
          <EventSearch />
        </Grid>
        <Grid item xs={16} sm={9} sx={{ overflowY: 'auto', scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: '8px', // Ancho de la barra de desplazamiento
          height: '60px'
        },
        '&::-webkit-scrollbar-thumb': {
          background: "#D6FF4E", // Color del pulgar (barra deslizante)
        },
        '&::-webkit-scrollbar-thumb:hover': {
        background: '#555', // Color del pulgar al pasar el ratón
        },
        '&::-webkit-scrollbar-track': {
          background: '#eee', // Color de la pista (fondo de la barra)
        },
      }}> 
          <Tabs 
          textColor="secondary"
          indicatorColor="secondary"
          sx={{...TabsSX}}
          value={tabValue} 
          onChange={handleChangeTab}>
            <Tab sx={{color:"#62E8FF" }} label="Eventos"/>
            <Tab sx={{color:"#62E8FF" }} label="Clubes"/>
          </Tabs>
          {tabValue === 0 && (
            <>
              <EventShowcase keyword="menos" />
              <EventShowcase keyword="más" />
            </>
          )}
          {tabValue === 1 && <ClubShowcase />}
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default Home;





// function Home() {
//   const [tabValue, setTabValue] = useState(0);

//   const handleChangeTab = (event, newValue) => {
//     setTabValue(newValue);
//   };
//   return (
//     <>
//       <Header />
//       <Grid
//         container
//         className="content"
//         sx={{ mx: "auto", maxWidth: "1200px" }}
//       >
//         <Grid item xs={12} sm={3}>
//           <EventSearch />
//         </Grid>
//         <Grid item xs={12} sm={9}>
//           <Tabs 
//           textColor="secondary"
//           indicatorColor="secondary"
//           sx={{ml:4}} 
//           value={tabValue} 
//           onChange={handleChangeTab}>
//             <Tab sx={{color:"#62E8FF" }} label="Eventos"/>
//             <Tab sx={{color:"#62E8FF" }} label="Clubes"/>
//           </Tabs>
//           {tabValue === 0 && (
//             <>
//               <EventShowcase keyword="menos" />
//               <EventShowcase keyword="más" />
//             </>
//           )}
//           {tabValue === 1 && <ClubShowcase />}
//         </Grid>
//       </Grid>
//       <Footer />
//     </>
//   );
// }

// export default Home;

