import React from 'react';
import { storiesOf } from '@storybook/react';
import withState from '@wapps/storybook-addon-state';

import { Api, Container, RemoveRestorePanel } from './helper';
import Map from '../Map';
import BicyclingLayer from '../BicyclingLayer';

storiesOf('react-google-maps|BicyclingLayer', module)
  .add('default', () => (
    <Api>
      <Container>
        <Map
          center={{
            lat: 52.520008,
            lng: 13.404954,
          }}
          zoom={13}
        >
          <BicyclingLayer />
        </Map>
      </Container>
    </Api>
  ))
  .add(
    'with remove/restore',
    withState({ visible: true })(({ store }) => (
      <Api>
        <Container>
          <RemoveRestorePanel
            onRemoveClick={() => store.set({ visible: false })}
            onRestoreClick={() => store.set({ visible: true })}
          />
          <Map
            center={{
              lat: 52.520008,
              lng: 13.404954,
            }}
            zoom={13}
          >
            <BicyclingLayer visible={store.state.visible} />
          </Map>
        </Container>
      </Api>
    )),
  );
