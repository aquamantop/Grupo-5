import { useState } from "react";
import { Grid, Typography } from "@mui/material";
import BookingShowcase from "../components/bookingShowcase/BookingShowcase";
import BookingSearch from "../components/bookingSearch/BookingSearch";


function Disponibility() {
  const [selectedFilters, setSelectedFilters] = useState({
    activityId: null,
    clubId: null,
  });

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
  };

  return (
    <>
      <Grid
        container
        className="content"
        sx={{
          height: "auto",
          mx: "auto",
          maxWidth: "1400px",
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: '30px'
        }}
      >
        <Grid item xs={12} sm={3}>
          <BookingSearch onUpdateFilters={handleFilterChange} />
        </Grid>
        <Grid item xs={12} sm={9} sx={{ overflowY: 'auto', scrollbarWidth: 'thin' }}>
          <BookingShowcase
            activityId={selectedFilters.activityId}
            clubId={selectedFilters.clubId}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default Disponibility;
