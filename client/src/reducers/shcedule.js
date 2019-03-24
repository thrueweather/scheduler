import * as types from "../constants"

import { days, weeks } from "../utils/api"

const initialState = {
  visibleTime: "Weeks",
  defaultSubHeaderLabelFormats: {
    yearShort: "YY",
    yearLong: "YYYY",
    monthShort: "MM",
    monthMedium: "MMM",
    monthLong: "MMMM",
    dayShort: "D",
    dayMedium: "dd D",
    dayMediumLong: "ddd, Do",
    dayLong: "VVеек (D.MM)",
    hourShort: "HH",
    hourLong: "HH:00",
    minuteShort: "mm",
    minuteLong: "HH:mm"
  },
  timeSteps: {
    second: 1,
    minute: 1,
    hour: 1,
    day: 7,
    month: 1,
    year: 1
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.CHANGE_SHOW_TIME:
      switch (action.visibleTime) {
        case "Days":
          return {
            ...state,
            visibleTime: action.visibleTime,
            defaultSubHeaderLabelFormats: days,
            timeSteps: {
              ...state.timeSteps,
              day: 1
            }
          }
        case "Weeks":
          return {
            ...state,
            visibleTime: action.visibleTime,
            defaultSubHeaderLabelFormats: weeks,
            timeSteps: {
              ...state.timeSteps,
              day: 7
            }
          }
        default:
          return {
            ...state,
            visibleTime: action.visibleTime
          }
      }
    default:
      return state
  }
}
