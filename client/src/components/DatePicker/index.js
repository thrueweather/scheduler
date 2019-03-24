import React, { memo } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = memo(({ title, selected, onChange }, props) => (
  <div className="center">
    <div>
      <label>{title}</label>
    </div>
    <DatePicker
      className="form-control"
      selected={selected}
      onChange={onChange}
      {...props}
    />
  </div>
));

export default CustomDatePicker;
