import { apiClient } from '../api';
import { useState, ChangeEvent } from 'react';
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
    const [ newPatient, setNewPatient ] = useState({name: patient.name, gender: patient.gender, mobile: patient.mobile, email: patient.email});
    
    let { url } = useRouteMatch();

    const editPatient = () => {
      const formData = new FormData();
      for (const [key, value] of Object.entries(newPatient)) {
        formData.append(key, value);
      }
      formData.append('_method', 'put')
      const file = document.getElementById('profile_photo') as HTMLInputElement;
      formData.append('profile_photo', file!.files![0], file!.files![0].name)

      apiClient(
        {
          method: 'post',
          url: '/api/patients/' + patient.id,
          headers: { 'content-type': 'multipart/form-data' },
          data: formData,
        }
      ).then(response => {
        if (response.status === 200) {
          setPatient({...response.data});
          setIsEditing(false);
        }
      }).catch(error => {
          console.error(error);
      });
    }

    if (Object.keys(patient).length === 0) {
      return null;
    }

    return (
      <tr>
        <td><img src={ patient.profile_photo } alt="profile" className="h-16" /></td>
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
          <Link to={{pathname: `${url}/${patient.id}/notes`, state: {patientName: patient.name}}} 
            className="py-1 px-6 rounded bg-green-400 text-lg inline-block">
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
              <div className="my-5 flex">
                <img src={patient.profile_photo} alt="profile" className="h-32" />
                <div className="w-full pl-3">
                  <p className="mb-3">Update profile photo</p>
                  <input
                    type="file"
                    className="w-full border-2 rounded p-3 border-green-500"
                    name="profile_photo"
                    id="profile_photo"
                  />
                </div>
              </div>
              <div className="my-5">
                <input
                  className="w-full border-2 rounded p-3 border-green-500"
                  name="name"
                  onChange={ (e) => setNewPatient({...newPatient, name: e.target.value}) }
                  value={newPatient.name}
                  required
                  />
              </div>
              <div className="my-5">
                <select onChange={ (e) => setNewPatient({...newPatient, gender: e.target.value}) } value={newPatient.gender} className="w-full border-2 rounded p-3 border-green-500">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="rather not say">Rather Not Say</option>
                </select>
              </div>
              <div className="my-5">
                <input
                    className="w-full border-2 rounded p-3 border-green-500"
                    name="mobile"
                    onChange={ (e) => setNewPatient({...newPatient, mobile: e.target.value}) }
                    value={newPatient.mobile}
                />
              </div>
              <div className="my-5">
                <input
                    className="w-full border-2 rounded p-3 border-green-500"
                    name="email"
                    onChange={ (e) => setNewPatient({...newPatient, email: e.target.value}) }
                    value={newPatient.email}
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
