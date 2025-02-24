import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const StyledButton = ({ children, variant = 'primary', ...props }) => {
  return (
    <Button
      {...props}
      style={{
        backgroundColor: variant === 'primary' ? 'black' : 'white',
        color: variant === 'primary' ? 'white' : 'black',
        fontWeight: 'bold',
        fontSize: '15px',
        borderRadius: '5px',
        padding: '10px',
        ...props.style,
      }}
    >
      {children}
    </Button>
  );
};

StyledButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  style: PropTypes.object,
};

export default StyledButton;
