import "./App.css";
import {
  FormControl,
  InputGroup,
  Container,
  Button,
  Card,
  Row,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { useSpotifySearch } from "./hooks/useSpotifySearch"; // Import the custom hook

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const {
    albums,
    error,
    search,
    loading,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useSpotifySearch(accessToken); // Use the custom hook
  const [searchInitiated, setSearchInitiated] = useState(false);

  useEffect(() => {
    const getAccessToken = async () => {
      try {
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

        const result = await fetch(
          "https://accounts.spotify.com/api/token",
          authParams
        );
        const data = await result.json();
        if (!result.ok) {
          throw new Error(
            data.error_description || "Failed to fetch access token"
          );
        }
        setAccessToken(data.access_token);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching access token:", err);
      }
    };

    getAccessToken();
  }, []);

  const handleSearch = (page = 1) => {
    setSearchInitiated(true);
    search(searchInput, page);
  };

  return (
    <>
      <Container>
        <InputGroup>
          <FormControl
            placeholder="Search For Artist"
            type="input"
            aria-label="Search for an Artist"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
            style={{
              width: "300px",
              height: "35px",
              borderWidth: "0px",
              borderStyle: "solid",
              borderRadius: "5px",
              marginRight: "10px",
              paddingLeft: "10px",
            }}
          />
          <Button onClick={() => handleSearch()} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </InputGroup>
      </Container>
      {error && (
        <div style={{ color: "red", textAlign: "center" }}>Error: {error}</div>
      )}
      <Container>
        <Row
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
            alignContent: "center",
          }}
        >
          {loading && searchInitiated ? (
            <div style={{ textAlign: "center", color: "black" }}>
              Loading...
            </div>
          ) : albums.length === 0 && !error && searchInitiated ? (
            <div style={{ textAlign: "center", color: "black" }}>
              No albums found.
            </div>
          ) : (
            albums.map((album) => {
              return (
                <Card
                  key={album.id}
                  style={{
                    backgroundColor: "white",
                    margin: "10px",
                    borderRadius: "5px",
                    marginBottom: "30px",
                  }}
                >
                  <Card.Img
                    width={200}
                    src={album.images[0].url}
                    style={{
                      borderRadius: "4%",
                    }}
                  />
                  <Card.Body>
                    <Card.Title
                      style={{
                        whiteSpace: "wrap",
                        fontWeight: "bold",
                        maxWidth: "200px",
                        fontSize: "18px",
                        marginTop: "10px",
                        color: "black",
                      }}
                    >
                      {album.name}
                    </Card.Title>
                    <Card.Text
                      style={{
                        color: "black",
                      }}
                    >
                      Release Date: <br /> {album.release_date}
                    </Card.Text>
                    <Button
                      href={album.external_urls.spotify}
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "15px",
                        borderRadius: "5px",
                        padding: "10px",
                      }}
                    >
                      Album Link
                    </Button>
                  </Card.Body>
                </Card>
              );
            })
          )}
        </Row>
        {totalPages > 1 && (
          <Row
            style={{
              justifyContent: "center",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <Button
              onClick={() => handleSearch(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              style={{ marginRight: "10px" }}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => handleSearch(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              style={{ marginLeft: "10px" }}
            >
              Next
            </Button>
          </Row>
        )}
      </Container>
    </>
  );
}

export default App;