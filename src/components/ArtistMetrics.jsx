import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';
import { Card } from 'react-bootstrap';
import styled from 'styled-components';

const MetricsCard = styled(Card)`
  background: var(--color-card);
  margin-bottom: var(--space-lg);
  box-shadow: var(--shadow-md);
  border-radius: var(--radius-md);
`;

const ChartTitle = styled.h5`
  color: var(--color-text);
  margin-bottom: var(--space-md);
  font-weight: 600;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
  margin: var(--space-md) 0;
`;

const ArtistMetrics = ({ albums }) => {
  const timelineData = useMemo(() => {
    return albums
      .filter(album => album.popularity !== undefined)
      .map(album => ({
        name: album.name.length > 20 ? album.name.substring(0, 20) + '...' : album.name,
        fullName: album.name,
        year: new Date(album.release_date).getFullYear(),
        popularity: album.popularity
      }))
      .sort((a, b) => a.year - b.year);
  }, [albums]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          background: 'var(--color-surface)',
          border: '1px solid var(--color-primary)',
          padding: 'var(--space-sm)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <p style={{ 
            margin: '0 0 4px', 
            fontWeight: '600',
            color: 'var(--color-text)'
          }}>{payload[0].payload.fullName}</p>
          <p style={{ 
            margin: '0 0 4px',
            color: 'var(--color-text-secondary)'
          }}>Year: {payload[0].payload.year}</p>
          <p style={{ 
            margin: '0',
            color: 'var(--color-primary)'
          }}>Popularity: {payload[0].payload.popularity}%</p>
        </div>
      );
    }
    return null;
  };

  if (timelineData.length === 0) {
    return null;
  }

  const chartCommonProps = {
    stroke: 'var(--color-text-secondary)',
    fontSize: 12,
    fontFamily: 'Inter, sans-serif',
    fill: 'var(--color-text-secondary)'
  };

  return (
    <MetricsCard>
      <Card.Body>
        <ChartTitle>Album Popularity Timeline</ChartTitle>
        <ChartContainer>
          <ResponsiveContainer>
            <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 45 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="year" 
                {...chartCommonProps}
                height={60}
                padding={{ left: 20, right: 20 }}
                tick={{ textAnchor: 'middle' }}
              />
              <YAxis 
                {...chartCommonProps}
                domain={[0, 100]} 
                tickCount={6}
                label={{ 
                  value: 'Popularity', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { ...chartCommonProps, fill: 'var(--color-text-secondary)' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="popularity" 
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ r: 4, fill: 'var(--color-primary)', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: 'var(--color-primary-hover)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartTitle style={{ marginTop: 'var(--space-xl)' }}>
          Album Popularity Comparison
        </ChartTitle>
        <ChartContainer>
          <ResponsiveContainer>
            <BarChart 
              data={timelineData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              barGap={8}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="name" 
                height={0}
                tick={false}
              />
              <YAxis 
                {...chartCommonProps}
                domain={[0, 100]} 
                tickCount={6}
                label={{ 
                  value: 'Popularity', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { ...chartCommonProps, fill: 'var(--color-text-secondary)' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="popularity" 
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Card.Body>
    </MetricsCard>
  );
};

export default ArtistMetrics;
