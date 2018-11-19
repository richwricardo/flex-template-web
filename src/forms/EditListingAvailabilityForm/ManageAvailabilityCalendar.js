import React, { Component } from 'react';
import { func, object, string } from 'prop-types';
import { DayPickerSingleDateController, isSameDay, isInclusivelyBeforeDay, isInclusivelyAfterDay } from 'react-dates';
import classNames from 'classnames';
import moment from 'moment';
import { IconArrowHead } from '../../components';

import css from './ManageAvailabilityCalendar.css';

export const HORIZONTAL_ORIENTATION = 'horizontal';

const isPast = day => {
  const today = moment();
  return !isSameDay(day, today) && isInclusivelyBeforeDay(day, today);
};

const isReserved = (reservedDays, day) => {
  return !!reservedDays.find((d) => isSameDay(moment(d), day));
}

const isBlocked = (blockedDays, day) => {
  return !!blockedDays.find((d) => isSameDay(moment(d), day));
}

const handleDayClickWithProps = props => {
  const { availabilityCalendarChanges, currentMonth, onDayAllowed, onDayBlocked } = props;

  const { blockedDaysCurrent = [], blockedDaysAdded = [], reservedDays = [] } = availabilityCalendarChanges[currentMonth] || {};
  const blockedDays = [...blockedDaysCurrent, ...blockedDaysAdded];

  return day => {
    if (isReserved(reservedDays, day) || isPast(day)) {
      // Cannot allow or block a reserved or a past day
      return;
    } else if (isBlocked(blockedDays, day)) {
      onDayAllowed(day);
    } else {
      onDayBlocked(day);
    }
  };
};

class ManageAvailabilityCalendar extends Component {
  constructor(props) {
    super(props);
    this.dayPickerWrapper = null;
    this.dayPicker = null;

    this.state = {
      focused: true,
      date: null,
    };

    this.onDateChange = this.onDateChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
  }

  onDateChange(date) {
    this.setState({ date });

    const handleDayClick = handleDayClickWithProps(this.props);
    handleDayClick(date);
  }

  onFocusChange() {
    // Force the focused states to always be truthy so that date is always selectable
    this.setState({ focused: true });
  }

  render() {
    const {
      className,
      rootClassName,
      currentMonth,
      availabilityCalendar,
      availabilityCalendarChanges,
      onMonthChanged,
      onDayAllowed,
      onDayBlocked,
      ...rest,
    } = this.props;
    const { focused, date } = this.state;

    const { clientWidth: width, clientHeight: height } = this.dayPickerWrapper || { clientWidth: 0, clientHeight: 0 };
    const daySize = width > 744
      ? 100
      : width > 344
        ? Math.floor((width - 44) / 7)
        : 42;

    const { blockedDaysCurrent = [], blockedDaysAdded = [], reservedDays = [] } = availabilityCalendarChanges[currentMonth] || {};
    const blockedDays = [...blockedDaysCurrent, ...blockedDaysAdded];

    const renderDayContents = day => {
      const dayClasses = classNames(css.default, {
        [css.past]: isPast(day),
        [css.today]: isSameDay(moment(), day),
        [css.blocked]: isBlocked(blockedDays, day),
        [css.reserved]: isReserved(reservedDays, day),
      });

      return (
        <div className={css.dayWrapper}>
          <span className={dayClasses}>
            <span className={css.dayNumber}>{day.format('DD')}</span>
          </span>
        </div>
      );
    };

    const currentMontMoment = moment(currentMonth, 'YYYY-MM');
    const classes = classNames(rootClassName || css.root, className);

    return (
      <div className={classes} ref={c => { this.dayPickerWrapper = c; }}>
        {width > 0 ? (
          <DayPickerSingleDateController
            {...rest}
            ref={c => { this.dayPicker = c; }}
            numberOfMonths={1}
            navPrev={<IconArrowHead direction="left" />}
            navNext={<IconArrowHead direction="right" />}
            daySize={daySize}
            initialVisibleMonth={() => moment(currentMonth, 'YYYY-MM')}
            renderDayContents={renderDayContents}
            focused={focused}
            date={date}
            onDateChange={this.onDateChange}
            onFocusChange={this.onFocusChange}
            onPrevMonthClick={() => {
              onMonthChanged(currentMontMoment.subtract(1, 'months').format('YYYY-MM'));
            }}
            onNextMonthClick={() => {
              onMonthChanged(currentMontMoment.add(1, 'months').format('YYYY-MM'));
            }}
            hideKeyboardShortcutsPanel={width < 400}
          />
          ):null}
      </div>
    );
  }
};

ManageAvailabilityCalendar.defaultProps = {
  className: null,
  rootClassName: null,

  // day presentation and interaction related props
  renderCalendarDay: undefined,
  renderDayContents: null,
  isDayBlocked: () => false,
  isOutsideRange: day => !isInclusivelyAfterDay(day, moment()),
  isDayHighlighted: () => false,
  enableOutsideDays: true,

  // calendar presentation and interaction related props
  orientation: HORIZONTAL_ORIENTATION,
  withPortal: false,
  initialVisibleMonth: null,
  numberOfMonths: 2,
  onOutsideClick() {},
  keepOpenOnDateSelect: false,
  renderCalendarInfo: null,
  isRTL: false,

  // navigation related props
  navPrev: null,
  navNext: null,
  onPrevMonthClick() {},
  onNextMonthClick() {},

  // internationalization
  monthFormat: 'MMMM YYYY',
};

ManageAvailabilityCalendar.propTypes = {
  className: string,
  rootClassName: string,
  availabilityCalendar: object.isRequired,
  availabilityCalendarChanges: object.isRequired,
  onDayAllowed: func.isRequired,
  onDayBlocked: func.isRequired,
  onMonthChanged: func.isRequired,
};

export default ManageAvailabilityCalendar;
