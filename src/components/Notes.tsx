import { apiClient } from '../api'
import Modal from 'react-modal';
import Timeline from './Timeline'
import Loader from './Loader'
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Note } from '../types';

export default function Notes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [patientName, setPatientName] = useState('');
    const [showModal, setModalStatus] = useState(false);
    const [content, setContent] = useState('');
    const [isLoading, setLoadingStatus] = useState(true);
    const mountedRef = useRef(true);
    const { patientId } = useParams<{patientId: string}>();

    useEffect(() => {
        apiClient.get('/sanctum/csrf-cookie')
            .then(() => {
                apiClient.get('/api/patients/' + patientId + '/notes')
                    .then(response => {
                        if (response.status === 200) {
                    if (! mountedRef.current) return null;
                            setNotes(response.data.data);
                            setPatientName(response.data.meta.patient_name);
                            setLoadingStatus(false);
                        }
                    }).catch(error => {
                if (! mountedRef.current) return null;
                        console.error(error);
                    });
        
        return () => {
            mountedRef.current = false;
        }
    })

    const addNote = () => {
        apiClient.get('/sanctum/csrf-cookie')
            .then(() => {
                apiClient.post('/api/patients/' + patientId + '/notes', {
                    content: content,
                }).then(response => {
                    if (response.status === 201) {
                        notes.unshift(response.data);
                        setModalStatus(false);
                        setContent('');
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
                     { ' ' + patientName }
                </Link>
            </h1>
            <button onClick={() => setModalStatus(true)} className="py-2 px-4 rounded bg-green-500 text-lg mt-3 float-left">Add New Note</button>

            <div className="clear-both mt-20">
                {! isLoading && notes.length > 0 &&
                    <Timeline data={notes} />
                }
                {! isLoading && notes.length === 0 &&
                    <p>No notes found for { patientName }</p>
                }
            </div>

            <Modal
                isOpen={showModal}
                onRequestClose={() => setModalStatus(false)}
                className="text-left z-50 overflow-auto bg-white w-1/2 px-10 py-5 inset-1/4 border-green-200 border-2 absolute"
                contentLabel="Add New Note Modal"
            >
                <h3 className="text-xl">Add New Note for { patientName }</h3>
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
                    <button onClick={addNote} className="py-3 px-5 rounded bg-green-500 text-lg right">Submit</button>
                    <button onClick={() => setModalStatus(false)} className="py-3 px-5 ml-3 rounded bg-gray-200 text-lg right">Cancel</button>
                </div>
            </Modal>
        </div>
    )
}