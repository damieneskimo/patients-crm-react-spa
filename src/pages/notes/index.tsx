import { apiClient } from '../../api'
import Modal from 'react-modal';
import Timeline from '../../components/Timeline'
import Loader from '../../components/Loader'
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Note } from '../../types';
import { useMountedRef } from '../../hooks/useMountedRef';

type LocationState = {
    patientName: string
}

export default function Notes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [showModal, setModalStatus] = useState(false);
    const [content, setContent] = useState('');
    const [isLoading, setLoadingStatus] = useState(true);
    const mountedRef = useMountedRef();
    const { patientId } = useParams<{patientId: string}>();
    const location = useLocation();
    const locationState = location.state as LocationState;
    
    useEffect(() => {
        apiClient.get('/api/patients/' + patientId + '/notes')
            .then(response => {
                if (response.status === 200) {
                    if (! mountedRef.current) return null;
                    setNotes(response.data.data);
                    setLoadingStatus(false);
                }
            }).catch(error => {
                if (! mountedRef.current) return null;
                console.error(error);
            });
    })

    const addNote = () => {
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
    }

    if (isLoading) {
        return <Loader />
    }

    return (
        <div>
            <h1 className="text-2xl text-left">
                Notes for
                <Link to='/patients' className="text-green-500">
                     { ' ' + locationState.patientName }
                </Link>
            </h1>
            <button onClick={() => setModalStatus(true)} className="py-2 px-4 rounded bg-green-500 text-lg mt-3 float-left">Add New Note</button>

            <div className="clear-both mt-20">
                {! isLoading && notes.length > 0 &&
                    <Timeline data={notes} />
                }
                {! isLoading && notes.length === 0 &&
                    <p>No notes found for { locationState.patientName }</p>
                }
            </div>

            <Modal
                isOpen={showModal}
                onRequestClose={() => setModalStatus(false)}
                className="text-left z-50 overflow-auto bg-white w-1/2 px-10 py-5 inset-1/4 border-green-200 border-2 absolute"
                contentLabel="Add New Note Modal"
            >
                <h3 className="text-xl">Add New Note for { locationState.patientName }</h3>
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