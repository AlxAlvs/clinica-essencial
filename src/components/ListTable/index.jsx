import {
  Container,
  Spinner,
  Table,
  Row,
  Col,
  Card,
  Button,
} from 'react-bootstrap';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  CardDiv,
  InsertBtnDiv,
  CardTitle,
} from '../../../public/static/css/styledComponents';
import formatterValue from '../../utils';
import getModel from '../../models/index';

const ListTable = ({
  data,
  table,
}) => {
  const renderTableHeader = () => (
    <thead>
      <tr>
        {getModel(table).map((property) => (
          <th>{Object.values(property)[0].displayName}</th>
        ))}
      </tr>
    </thead>
  );

  const renderProperty = (propToRender, databaseObj) => {
    switch (propToRender.type) {
      case 'monetary':
        return (
          formatterValue(databaseObj[propToRender.databaseName])
        );
      case 'date':
        return (
          databaseObj[propToRender.databaseName]
            ? moment(databaseObj[propToRender.databaseName], 'YYYY-MM-DD').format('DD MM YYYY')
            : null
        );
      default:
        return (
          databaseObj[propToRender.databaseName]
        );
    }
  };

  const renderTableBody = () => (
    <tbody>
      {data && Array.isArray(data.result) ? (
        data.result.map((databaseObject) => (
          <tr>
            {getModel(table).map((property) => (
              <td>{renderProperty(Object.values(property)[0], databaseObject)}</td>
            ))}
          </tr>
        ))
      ) : (
        <>
          <tr />
        </>
      )}
    </tbody>
  );

  const handleTitle = (string) => {
    const capitalizedWord = string.charAt(0).toUpperCase() + string.slice(1);
    return `${capitalizedWord}s`;
  };

  const renderTableTitle = () => (
    <CardTitle>
      {handleTitle(table)}
    </CardTitle>
  );

  return (
    <CardDiv>
      <Container fluid>
        <Row>
          <Col md={{ span: 10, offset: 1 }}>
            {data ? (
              <Card
                bg="dark"
              >
                <Card.Header>{renderTableTitle()}</Card.Header>
                <Card.Body>
                  <Row>
                    <InsertBtnDiv>
                      <Button variant="dark">
                        Cadastrar
                        {' '}
                        {table}
                      </Button>
                    </InsertBtnDiv>
                  </Row>
                  <Table striped bordered hover variant="dark">
                    {renderTableHeader()}
                    {renderTableBody()}
                  </Table>
                </Card.Body>
              </Card>
            ) : (
              <Spinner animation="border" />
            )}
          </Col>
        </Row>
      </Container>
    </CardDiv>
  );
};

ListTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  table: PropTypes.string,
};

ListTable.defaultProps = {
  data: [],
  table: '',
};

export default ListTable;
