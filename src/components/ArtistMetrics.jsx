import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';
import { Card } from 'react-bootstrap';

const ArtistMetrics = ({ albums }) => {
  const timelineData = useMemo(() => {
    return albums
      .filter(album => album.popularity !== undefined) // Only include albums with popularity data
      .map(album => ({
        name: album.name.length > 20 ? album.name.substring(0, 20) + '...' : album.name,
        fullName: album.name,
        year: new Date(album.release_date).getFullYear(),
        popularity: album.popularity
      }))
      .sort((a, b) => a.year - b.year);
  }, [albums]);

  if (timelineData.length === 0) {
    return null;
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border">
          <p className="mb-0">{payload[0].payload.fullName}</p>
          <p className="mb-0">Year: {payload[0].payload.year}</p>
          <p className="mb-0">Popularity: {payload[0].payload.popularity}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <h5 className="mb-4">Album Popularity Timeline</h5>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="year" 
                angle={-45}
                textAnchor="end"
              />
              <YAxis domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="popularity" 
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <h5 className="mb-4 mt-5">Album Popularity Comparison</h5>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={100}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="popularity" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ArtistMetrics;
