import { http } from "../utils/http"

const getAllNotes = async (patientId: number) => {
  return await http('api/patients/' + patientId + '/notes');
}

const addNote = async (patientId: number, data: object) => {
  return await http(
    'api/patients/' + patientId + '/notes', 
    {
        method: 'POST',
        data,
    }
  )
}

const noteService = {
  getAllNotes,
  addNote
}

export default noteService
