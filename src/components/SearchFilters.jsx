import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

const SearchFilters = ({ filters, onFilterChange }) => {
  const years = Array.from({ length: 2024 - 1950 }, (_, i) => 2024 - i);

  return (
    <Form className="mb-4">
      <Row className="g-3">
        <Col xs={12} sm={6} md={4}>
          <Form.Group>
            <Form.Label>Year</Form.Label>
            <Form.Select
              value={filters.year}
              onChange={(e) => onFilterChange('year', e.target.value)}
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={12} sm={6} md={4}>
          <Form.Group>
            <Form.Label>Sort By</Form.Label>
            <Form.Select
              value={filters.sortBy}
              onChange={(e) => onFilterChange('sortBy', e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest</option>
              <option value="name">Name</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

SearchFilters.propTypes = {
  filters: PropTypes.shape({
    year: PropTypes.string,
    sortBy: PropTypes.string,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default SearchFilters;
