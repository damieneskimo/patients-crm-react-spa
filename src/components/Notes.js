import { apiClient } from '../api.js'
import Modal from 'react-modal';
import Timeline from './Timeline'
import Loader from './Loader'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export default function Notes(props) {
    const [patient, setPatient] = useState({});
    const [showModal, setModalStatus] = useState(false);
    const [content, setContent] = useState('');
    const [isLoading, setLoadingStatus] = useState(true);

    const { patientId } = useParams();

    useEffect(() => {
        apiClient.get('/sanctum/csrf-cookie')
            .then(() => {
                apiClient.get('/api/patients/' + patientId)
                    .then(response => {
                        if (response.status == 200) {
                            setPatient(response.data);
                            setLoadingStatus(false);
                        }
                    }).catch(error => {
                        console.error(error);
                    });
            });
    }, [])

    const addNote = () => {
        apiClient.get('/sanctum/csrf-cookie')
            .then(() => {
                apiClient.post('/api/patients/' + patient.id + '/notes', {
                    content: content,
                }).then(response => {
                    if (response.status == 201) {
                        patient.notes.unshift(response.data);
                        setModalStatus(false);
                    }
                }).catch(error => {
                    console.error(error);
                });
            });
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
                {! isLoading && patient.notes.length > 0 &&
                    <Timeline data={patient.notes} />
                }
                {! isLoading && patient.notes.length === 0 &&
                    <p>No notes found for { patient.name }</p>
                }
            </div>

            <Modal
                isOpen={showModal}
                onRequestClose={() => setModalStatus(false)}
                className="text-left z-50 overflow-auto bg-white w-1/2 px-10 py-5 inset-1/4 border-green-200 border-2 absolute"
                contentLabel="Add New Note Modal"
            >
                <h3 className="text-xl">Add New Note for { patient.name }</h3>
                <form>
                    <div className="my-5">
                        <textarea 
                            className="w-full border-2 rounded p-3 border-green-500"
                            name="content"
                            rows="4"
                            placeholder="Please enter the content"
                            onChange={(e) => setContent(e.target.value)}
                            required>
                        </textarea>
                    </div>
                </form>

                <div>
                    <button onClick={addNote} className="py-3 px-5 rounded bg-green-500 text-lg right">Submit</button>
                    <button onClick={() => setModalStatus(false)} className="py-3 px-5 ml-3 rounded bg-gray-200 text-lg right">Cancel</button>
                </div>
            </Modal>
        </div>
    )
}