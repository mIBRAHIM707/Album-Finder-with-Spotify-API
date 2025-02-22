// App.jsx
import './App.css'
import { FormControl, InputGroup, Container, Button } from "react-bootstrap";
import { useState, useEffect } from "react";

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

useEffect(() => {
  let authParams = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body:
      "grant_type=client_credentials&client_id=" +
      clientId +
      "&client_secret=" +
      clientSecret,
  };

  fetch("https://accounts.spotify.com/api/token", authParams)
    .then((result) => result.json())
    .then((data) => {
      setAccessToken(data.access_token);
    });
}, []);

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");

  return (
    <Container>
    <InputGroup style={{ display: 'flex', alignItems: 'center' }}>
      <FormControl
        placeholder="Search For Artist"
        type="input"
        aria-label="Search for an Artist"
        onKeyDown={() => {}} // search function
        onChange={() => {}} // setSearch
        style={{
          width: "300px",
          height: "38px",
          borderWidth: "0px",
          borderStyle: "solid",
          borderRadius: "5px",
          marginRight: "10px",
          paddingLeft: "10px",
        }}
      />
  
      <Button style={{height: "42px", padding: "0px 24px", fontSize: "17px"}} onClick={() => {}}>Search</Button>
    </InputGroup>
  </Container>
  )
}

export default App
