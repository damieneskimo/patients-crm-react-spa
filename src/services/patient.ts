import { http } from "../utils/http"

const getPatients = async (queryString: string) => {
  return await http('api/patients' + (queryString? `?${queryString}` : ''))
}

const getPatient = async (id: number) => {
  return await http(`api/patients/${id}`)
}

const addPatient = async (data: object) => {
  return await http(
    'api/patients',
    {
      method: "POST",
      data,
    }
  )
}

const updatePatient = async (patientId: number, data: object) => {
  return await http(
    `api/patients/${patientId}`,
    {
      method: "PATCH",
      data,
    }
  )
}

const patientService = {
  getPatients,
  getPatient,
  addPatient,
  updatePatient
}

export default patientService
