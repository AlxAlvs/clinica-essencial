import React from 'react';
import Image from 'next/image';
import {
  CentralizedDiv,
} from '../public/static/css/styledComponents';

const App = () => (
  <CentralizedDiv>
    <Image src="/static/logo.jpg" alt="logo" width="500" height="500" responsive="true" />
  </CentralizedDiv>
);

export default App;
