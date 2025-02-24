import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { Card } from 'react-bootstrap';

const ArtistMetrics = ({ albums }) => {
  const timelineData = albums
    .map(album => ({
      name: album.name,
      year: new Date(album.release_date).getFullYear(),
      popularity: album.popularity || 0
    }))
    .sort((a, b) => a.year - b.year);

  return (
    <Card className="mb-4">
      <Card.Body>
        <h5 className="mb-4">Discography Timeline</h5>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="popularity" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <h5 className="mb-4 mt-5">Album Popularity</h5>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="popularity" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ArtistMetrics;
