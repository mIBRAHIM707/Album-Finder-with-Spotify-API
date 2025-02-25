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
        <div className="tooltip-custom" style={{ 
          backgroundColor: '#232D3F', 
          padding: '10px', 
          border: '1px solid #005B41',
          color: '#FFFFFF'
        }}>
          <p className="mb-0">{payload[0].payload.fullName}</p>
          <p className="mb-0">Year: {payload[0].payload.year}</p>
          <p className="mb-0">Popularity: {payload[0].payload.popularity}</p>
        </div>
      );
    }
    return null;
  };

  const chartTextStyle = {
    fill: '#FFFFFF',
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif'
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <h5 className="mb-4">Album Popularity Timeline</h5>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 45 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#404040" opacity={0.5} />
              <XAxis 
                dataKey="year" 
                tick={chartTextStyle}
                tickLine={{ stroke: '#FFFFFF' }}
                axisLine={{ stroke: '#FFFFFF' }}
                height={50}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis 
                domain={[0, 100]} 
                tick={chartTextStyle}
                tickCount={6}
                tickLine={{ stroke: '#FFFFFF' }}
                axisLine={{ stroke: '#FFFFFF' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="popularity" 
                stroke="#008170"
                strokeWidth={2}
                dot={{ r: 4, fill: '#008170', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#005B41' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <h5 className="mb-4 mt-5">Album Popularity Comparison</h5>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#404040" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                tick={chartTextStyle}
                tickLine={{ stroke: '#FFFFFF' }}
                axisLine={{ stroke: '#FFFFFF' }}
                interval={0}
              />
              <YAxis 
                domain={[0, 100]} 
                tick={chartTextStyle}
                tickCount={6}
                tickLine={{ stroke: '#FFFFFF' }}
                axisLine={{ stroke: '#FFFFFF' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="popularity" 
                fill="#008170"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ArtistMetrics;
