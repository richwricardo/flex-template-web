import React from 'react';

// react-dates needs to be initialized before using any react-dates component
// Since this is currently only component using react-dates we can do it here
// https://github.com/airbnb/react-dates#initialize
import 'react-dates/initialize';
import { renderDeep } from '../../util/test-helpers';
import BookingDateRangeFilter from './BookingDateRangeFilter';

describe('BookingDateRangeFilter', () => {
  it('matches popup snapshot', () => {
    const tree = renderDeep(
      <BookingDateRangeFilter
        id="BookingDateRangeFilter"
        urlParam="dates"
        liveEdit={false}
        showAsPopup={true}
        contentPlacementOffset={-14}
        initialValues={{}}
        onSubmit={() => null}
      />
    );
    expect(tree).toMatchSnapshot();
  });

  it('matches plain snapshot', () => {
    const tree = renderDeep(
      <BookingDateRangeFilter
        id="BookingDateRangeFilter"
        urlParam="dates"
        liveEdit={true}
        showAsPopup={false}
        contentPlacementOffset={-14}
        initialValues={{}}
        onSubmit={() => null}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
