import Yup from "yup"

export const ProjectSchema = Yup.object().shape({
  name: Yup.string().required("Name is required!"),
  value: Yup.string().required("Value is required and should be a number!"),
  number: Yup.string().matches(
    /[A-Z]{3} [\d]{4}\.[\d]{3}/,
    "Should match format: 'ABC 1234.567'"
  ).required("Number is required and should match format: 'ABC 1234.567'!")
})