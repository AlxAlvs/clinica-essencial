/* eslint-disable no-undef */
import React from 'react';
import { ThemeProvider } from 'styled-components';
import {
  render,
} from '@testing-library/react';
import { GlobalStyle, theme } from '../../../public/static/css/globalStyles';
import ListTable from './index';

describe('Header', () => {
  describe('Overall', () => {
    it('should render successfully - base', async () => {
      const { container } = render(
        <ThemeProvider theme={theme}>
          <GlobalStyle>
            <ListTable />
          </GlobalStyle>
        </ThemeProvider>,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
