import React, { Component } from 'react';
import { bool, func, object, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { Form, Button } from '../../components';

import ManageAvailabilityCalendar from './ManageAvailabilityCalendar';
import css from './EditListingAvailabilityForm.css';

const today = new Date();
const twoDigitPad = (num) => {
    return num < 10 ? '0' + num : num;
}
const monthString = (today) => `${today.getFullYear()}-${twoDigitPad(today.getMonth() + 1)}`;

const isSameDay = (a, b) => {
  if (!(a instanceof Date && b instanceof Date)) return false;
  // Compare least significant, most likely to change units first
  // Moment's isSame clones moment inputs and is a tad slow
  return a.getDate() === b.getDate()
    && a.getMonth() === b.getMonth()
    && a.getFullYear() === b.getFullYear();
}

export class EditListingAvailabilityFormComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentMonth: monthString(today),
      availabilityCalendarChanges: {...props.availabilityCalendar},
    };

    this.onDayAllowed = this.onDayAllowed.bind(this);
    this.onDayBlocked = this.onDayBlocked.bind(this);
  }

  onDayAllowed(day) {
    console.log('unblocked', day.format());
    this.setState(prevState => {
      const monthData = prevState.availabilityCalendarChanges[prevState.currentMonth] || [];
      const blockedDaysCurrent = monthData.blockedDaysCurrent || [];
      const newBlockedDays = blockedDaysCurrent.filter(d => {
        return !isSameDay(d, day.toDate());
      });
      return {
        availabilityCalendarChanges: {
          ...prevState.availabilityCalendarChanges,
          [this.state.currentMonth]: {
            ...prevState.availabilityCalendarChanges[this.state.currentMonth],
            blockedDaysCurrent: newBlockedDays,
          },
        },
      };
    });
  }
  onDayBlocked(day) {
    console.log('blocked', day.format());
    this.setState(prevState => {
      const monthData = prevState.availabilityCalendarChanges[prevState.currentMonth] || {};
      const blockedDaysCurrent = monthData.blockedDaysCurrent || [];
      const newBlockedDays = [...blockedDaysCurrent, day.toDate()];
      return {
        availabilityCalendarChanges: {
          ...prevState.availabilityCalendarChanges,
          [this.state.currentMonth]: {
            ...prevState.availabilityCalendarChanges[this.state.currentMonth],
            blockedDaysCurrent: newBlockedDays,
          },
        },
      };
    });
  }

  render(){
    return (
      <FinalForm
        {...this.props}
        render={fieldRenderProps => {
          const {
            className,
            rootClassName,
            disabled,
            handleSubmit,
            onMonthChanged,
            //intl,
            invalid,
            pristine,
            saveActionMsg,
            updated,
            updateError,
            updateInProgress,
            availabilityCalendar,
          } = fieldRenderProps;

          const errorMessage = updateError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingAvailabilityForm.updateFailed" />
            </p>
          ) : null;

          const classes = classNames(rootClassName || css.root, className);
          const submitReady = updated && pristine;
          const submitInProgress = updateInProgress;
          const submitDisabled = invalid || disabled || submitInProgress;

          return (
            <Form className={classes} onSubmit={handleSubmit}>
              {errorMessage}
              <div className={css.calendarWrapper}>
                <ManageAvailabilityCalendar
                  availabilityCalendar={availabilityCalendar}
                  availabilityCalendarChanges={this.state.availabilityCalendarChanges}
                  currentMonth={this.state.currentMonth}
                  onDayAllowed={this.onDayAllowed}
                  onDayBlocked={this.onDayBlocked}
                  onMonthChanged={month => {
                    console.log(month);
                    this.setState({ currentMonth: month });
                    onMonthChanged(month);
                  }}
                />
              </div>

              <Button
                className={css.submitButton}
                type="submit"
                inProgress={submitInProgress}
                disabled={submitDisabled}
                ready={submitReady}
              >
                {saveActionMsg}
              </Button>
            </Form>
          );
        }}
      />
    );
  }
};

EditListingAvailabilityFormComponent.defaultProps = {
  updateError: null,
  availabilityCalendar: {},
};

EditListingAvailabilityFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  updated: bool.isRequired,
  updateError: propTypes.error,
  updateInProgress: bool.isRequired,
  availabilityCalendar: object.isRequired,
};

export default compose(injectIntl)(EditListingAvailabilityFormComponent);
