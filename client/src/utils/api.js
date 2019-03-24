import React from "react"

export const projectColumns = [
  {
    columns: [
      {
        Header: "Name",
        accessor: "name"
      },
      {
        Header: "Start date",
        Cell: row => row.original.startDate.slice(0, 10)
      },
      {
        Header: "End date",
        Cell: row => row.original.endDate.slice(0, 10)
      },
      {
        Header: "Manager",
        Cell: row =>
          `${row.original.manager.firstName} ${
            row.original.manager.lastName
          }`
      },
      {
        Header: "Superintendent",
        Cell: row => {
          if (row.original.superintendent.length) {
            return `${row.original.superintendent[0].firstName} ${
              row.original.superintendent[0].lastName
            }`
          }
          return "Unassigned"
        }
      }
    ]
  }
]

export const contactColumns = [
  {
    columns: [
      {
        Header: "Name",
        accessor: "firstName"
      },
      {
        Header: "Email",
        Cell: row => {
          const link = `mailto:${row.original.email}`
          return (
            (row.original.email && <a href={link}>{row.original.email}</a>) ||
            "not specified"
          )
        }
      },
      {
        Header: "Phone",
        Cell: row => row.original.phone || "not specified"
      },
      {
        Header: "Role",
        accessor: "role"
      }
    ]
  }
]

export const unassignedColumns = [
  {
    label: "#",
    field: "id"
  },
  {
    label: "Name",
    field: "heading0"
  },
  {
    label: "Start date",
    field: "heading1"
  },
  {
    label: "End date",
    field: "heading2"
  },
  {
    label: "Manager",
    field: "heading3"
  },
  {
    label: "Superintendent",
    field: "heading4"
  }
]

export const days = {
  yearShort: "YY",
  yearLong: "YYYY",
  monthShort: "MM",
  monthMedium: "MMM",
  monthLong: "MMMM",
  dayShort: "D",
  dayMedium: "dd D",
  dayMediumLong: "ddd, Do",
  dayLong: "dddd, Do",
  hourShort: "HH",
  hourLong: "HH:00",
  minuteShort: "mm",
  minuteLong: "HH:mm"
}

export const weeks = {
  yearShort: "YY",
  yearLong: "YYYY",
  monthShort: "MM",
  monthMedium: "MMM",
  monthLong: "MMMM",
  dayShort: "D",
  dayMedium: "dd D",
  dayMediumLong: "ddd, Do",
  dayLong: "VVеек (MM.D)",
  hourShort: "HH",
  hourLong: "HH:00",
  minuteShort: "mm",
  minuteLong: "HH:mm"
}

export const steps = [
  { title: "Negotiation" },
  { title: "Submittals" },
  { title: "In Progress" },
  { title: "Punchlist" },
  { title: "Completed" }
]
