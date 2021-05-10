import { apiClient } from '../api';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { useRouteMatch } from 'react-router-dom';
import { Patient } from '../types.jsx';

type Props = {
  data: Patient
}

export default function PatientListItem (props: Props) {
    const [ patient, setPatient ] = useState<Patient>({...props.data});
    const [ isEditing, setIsEditing ] = useState(false);
    const [ name, setName ] = useState(patient.name);
    const [ gender, setGender ] = useState(patient.gender);
    const [ mobile, setMobile ] = useState(patient.mobile);
    const [ email, setEmail ] = useState(patient.email);

    let { url } = useRouteMatch();
  
    const editPatient = () => {
      apiClient.get('/sanctum/csrf-cookie')
        .then(() => {
            apiClient.put('/api/patients/' + patient.id, {
              name, gender, mobile, email
            }).then(response => {
              if (response.status === 200) {
                setPatient({...response.data});
                setIsEditing(false);
              }
            }).catch(error => {
                console.error(error);
            });
        });
    }

    if (Object.keys(patient).length === 0) {
      return null;
    }

    return (
      <tr>
        <td className="py-3">{ patient.name }</td>
        <td>{ patient.gender }</td>
        <td>
          { patient.mobile }
        </td>
        <td>
          { patient.email }
        </td>
        <td className="text-center">
          <button 
            onClick={ () => { setPatient({...patient}); setIsEditing(true); } }
            className="py-1 px-6 rounded bg-green-400 text-lg mr-3 cursor-pointer">Edit</button>
          <Link to={`${url}/${patient.id}/notes`} className="py-1 px-6 rounded bg-green-400 text-lg">
            Notes
          </Link>
        </td>

        <Modal
          isOpen={isEditing}
          onRequestClose={() => setIsEditing(false)}
          className="text-left z-50 overflow-auto bg-white w-1/2 px-10 py-5 inset-1/4 border-green-200 border-2 absolute"
          contentLabel="Add New Note Patient"
        >
            <h3>Edit { patient.name }</h3>
            <form>
              <div className="my-5">
                <input
                  className="w-full border-2 rounded p-3 border-green-500"
                  name="name"
                  onChange={ (e) => setName(e.target.value) }
                  value={name}
                  required
                  />
              </div>
              <div className="my-5">
                <select onChange={ (e) => setGender(e.target.value) } value={gender} className="w-full border-2 rounded p-3 border-green-500">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="rather not say">Rather Not Say</option>
                </select>
              </div>
              <div className="my-5">
                <input
                    className="w-full border-2 rounded p-3 border-green-500"
                    name="mobile"
                    onChange={ (e) => setMobile(e.target.value) }
                    value={mobile}
                />
              </div>
              <div className="my-5">
                <input
                    className="w-full border-2 rounded p-3 border-green-500"
                    name="email"
                    onChange={ (e) => setEmail(e.target.value) }
                    value={email}
                />
              </div>
            </form>

            <div>
              <button onClick={editPatient} className="py-3 px-5 rounded bg-green-500 text-lg right">Submit</button>
              <button onClick={() => setIsEditing(false)} className="py-3 px-5 ml-3 rounded bg-gray-200 text-lg right">Cancel</button>
            </div>
        </Modal>
      </tr>
    )
}
