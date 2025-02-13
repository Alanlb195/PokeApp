/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { PokedexApp } from '../src/PokedexApp';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<PokedexApp />);
  });
});
