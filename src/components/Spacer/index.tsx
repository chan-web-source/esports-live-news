import React from 'react';

interface SpacerProps {
  space: number
}

const Spacer: React.FC<SpacerProps> = ({ space }) => {
  return (
    <div style={{ paddingBottom: `${space}px` }}>
    </div>
  );
}

export default Spacer