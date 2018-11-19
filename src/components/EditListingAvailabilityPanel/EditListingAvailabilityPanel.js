import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { ensureOwnListing } from '../../util/data';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '../../components';
import { EditListingAvailabilityForm } from '../../forms';

import css from './EditListingAvailabilityPanel.css';

const EditListingAvailabilityPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    availabilityCalendar,
    onSubmit,
    onChange,
    onMonthChanged,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const availabilityPlan = currentListing.attributes.availabilityPlan;
  const defaultAvailabilityPlan = {
    "type": "availability-plan/night",
    "entries": [
      {"dayOfWeek": "mon", "seats": 1},
      {"dayOfWeek": "tue", "seats": 1},
      {"dayOfWeek": "wed", "seats": 1},
      {"dayOfWeek": "thu", "seats": 1},
      {"dayOfWeek": "fri", "seats": 1},
      {"dayOfWeek": "sat", "seats": 1},
      {"dayOfWeek": "sun", "seats": 1},
    ],
  };

  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingAvailabilityPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditListingAvailabilityPanel.createListingTitle" />
  );

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditListingAvailabilityForm
        className={css.form}
        initialValues={{ availabilityPlan, blockedDates: [] }}
        availabilityCalendar={availabilityCalendar}
        onSubmit={() => {
          // We save default availability plan
          // I.e. every night this listing is available
          // (exceptions handled with live edit through calendar)
          onSubmit({ availabilityPlan: defaultAvailabilityPlan });
        }}
        onChange={onChange}
        onMonthChanged={onMonthChanged}
        saveActionMsg={submitButtonText}
        updated={panelUpdated}
        updateError={errors.updateListingError}
        updateInProgress={updateInProgress}
      />
    </div>
  );
};

const { func, object, string, bool } = PropTypes;

EditListingAvailabilityPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingAvailabilityPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  availabilityCalendar: object.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  onMonthChanged: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingAvailabilityPanel;
