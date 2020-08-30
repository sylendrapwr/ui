import React from 'react';
import { Card, CardBody } from 'reactstrap';
import PropTypes from 'prop-types';
import styles from './CardComponent.css';

const CardComponent = props => {
  const { children } = props;

  return (
    <div>
      <Card className={styles.shadow}>
        <CardBody className="p-3">
          <div className="mt-4">{children}</div>
        </CardBody>
      </Card>
    </div>
  );
};

CardComponent.propTypes = {
  children: PropTypes.node
};


export default CardComponent;
