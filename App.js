import React, { useEffect, useState } from "react";
import { MenuItem,FormControl,Select, Card, CardContent} from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from "./Map";
import "./App.css";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";



//https://disease.sh/v3/covid-19/countries 
   //USeEFFECT = Runs a piece of code,takes empty function
   //based on a given condition
  //if no variable inside array here,it will run once once when component loads and not again..useEffect
   //async --> send a request,wait for it,do something with it
    //STATE = how to write a variable in REACT <<<<<<<
    //change in array value can re-fire the code

function  App ()  {
   const [countries,setCountries] = useState([]); 
   const [country, setCountry] = useState("worldwide");
   const [countryInfo, setCountryInfo] = useState({});
   const [tableData, setTableData] = useState([]);
   const [mapCenter, setMapCenter] =
   useState({ lat: 34.80746, lng: -40.4796});
   const [mapZoom, setMapZoom] = useState(3);
   const [mapCountries, setMapCountries] = useState([]);
   const [casesType, setCasesType] = useState("cases");
    // WORLDWIDE keep track of what we selected..default will be selected and changing country
     //wont take effect and so listen function needs to be used
   useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {
        setCountryInfo(data);
    });
   }, []);



  useEffect(() => {                          
      const getCountriesData = async () => {
       await fetch("https://disease.sh/v3/covid-19/countries")           
       .then((response) => response.json())
       .then((data) => {
        const countries = data.map((country) => ({
            name: country.country,       //United States,India
            value: country.countryInfo.iso2   //UK,USA,FR
          }));

          const sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
       });
     };

     getCountriesData();
   }, []);
   //listening function

   const onCountryChange = async (event) => {
     const countryCode = event.target.value;
     //setCountry(countryCode);

     const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : 
     `https://disease.sh/v3/covid-19/countries/${countryCode}`;

     await fetch(url)
     .then((response) => response.json())
     .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);

      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
      //all of the data...from the country response 
     });
   };

  // console.log("COUNTRY INFO >>>", countryInfo);

  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">
      <h1> COVID-19 TRACKER</h1>
      <FormControl className="app__dropdown">   {/*bem naming convention...app represents file and dropdown the component used*/}
      <Select variant="outlined"   value={country} onChange={onCountryChange}  >
        {/* Loop through all the countries and show a dropdown list of all the options
        Using state ,kind of short term memory for react*/}
        <MenuItem value="worldwide">Worldwide</MenuItem>
        {countries.map((country) =>  (              //Map is essentially like an array..similar to for each..but returns the trans-
          <MenuItem value={country.value}>{country.name}</MenuItem> //formed array //mapping through countries and pop out value&name
        ))}
      </Select>
      </FormControl> 
      </div>       
       
        <div className="app__stats">
          <InfoBox
          isRed
          active={casesType === "cases"}
          onClick={(e) => setCasesType("cases")}
          title="+3-cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
          <InfoBox
          active={casesType === "recovered"}
          onClick={(e) => setCasesType("recovered")}
          title="Recovered"
          cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)} />
          <InfoBox 
          isRed
          active={casesType === "deaths"}
          onClick={(e) => setCasesType("deaths")}
          title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
        </div>

       <Map 
       casesType={casesType} 
       countries ={mapCountries} 
       center = {mapCenter}
        zoom = {mapZoom}
         />         {/* rendering map element */}
    </div>
    <Card className="app__right">
      <CardContent>
        <h3>Live Cases By Country</h3>
       <Table countries={tableData} />
       <h3 className="app__graphTitle"> Worldwide new {casesType}</h3>
       <LineGraph className="app__graph" casesType={casesType} />
      </CardContent>
    </Card>
  </div>
  );
}

export default App;
