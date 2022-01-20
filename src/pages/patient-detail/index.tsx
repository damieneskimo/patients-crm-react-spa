import Modal from 'react-modal';
import Timeline from '../../components/Timeline'
import Loader from '../../components/Loader'
import { useState } from 'react';
import { Link} from 'react-router-dom';
import { useParams } from 'react-router-dom';
import noteService from '../../services/note';
import patientService from '../../services/patient';
import { useAsync } from '../../utils/useAsync';

export default function PatientDetail() {
    const [showModal, setModalStatus] = useState(false);
    const [content, setContent] = useState('');
    const { patientId } = useParams();

    const getPatient = async () => {
      if (patientId === undefined) {
        throw new Error("Cannot find patient");
      }
      const patient = await patientService.getPatient(parseInt(patientId))
      return patient;
    }

    const getNotes = async () => {
      if (patientId === undefined) {
        throw new Error("Cannot find patient");
      }
      const notes = await noteService.getAllNotes(parseInt(patientId))
      return notes;
    }

    const [{ data: patient }] = useAsync(getPatient, [patientId])
    const [{ isLoading, data: notes }, setState] = useAsync(getNotes, [patientId])

    const addNote = async () => {
      if (patientId === undefined) {
        throw new Error("Cannot find patient");
      }

      const res = await noteService.addNote(parseInt(patientId), { data: content })
      const notesList = [...notes];
      notesList.unshift(res);
      setState((prevState) => ({ ...prevState, data: notesList }))

      setModalStatus(false);
      setContent('');
    }

    if (isLoading) {
        return <Loader />
    }

    return (
        <div>
            <h1 className="text-2xl text-left">
                Notes for
                <Link to='/patients' className="text-green-500">
                     { ' ' + patient.name }
                </Link>
            </h1>
            <button onClick={() => setModalStatus(true)} className="py-2 px-4 rounded bg-green-500 text-lg mt-3 float-left">Add New Note</button>

            <div className="clear-both mt-20">
                {! isLoading && notes.length > 0 &&
                    <Timeline data={notes} />
                }
                {! isLoading && notes.length === 0 &&
                    <p>No notes found</p>
                }
            </div>

            <Modal
                isOpen={showModal}
                onRequestClose={() => setModalStatus(false)}
                className="text-left z-50 overflow-auto bg-white w-1/2 px-10 py-5 inset-1/4 border-green-200 border-2 absolute"
                contentLabel="Add New Note Modal"
            >
                <h3 className="text-xl">Add New Note for</h3>
                <form>
                    <div className="my-5">
                        <textarea 
                            className="w-full border-2 rounded p-3 border-green-500"
                            name="content"
                            rows={4}
                            placeholder="Please enter the content"
                            onChange={(e) => setContent(e.target.value)}
                            value={content}
                            autoFocus
                            required>
                        </textarea>
                    </div>
                </form>

                <div>
                    <button onClick={addNote} className="py-3 px-5 rounded bg-green-500 text-lg right">Save</button>
                    <button onClick={() => setModalStatus(false)} className="py-3 px-5 ml-3 rounded bg-gray-200 text-lg right">Cancel</button>
                </div>
            </Modal>
        </div>
    )
}
