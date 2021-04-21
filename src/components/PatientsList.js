import Patient from './Patient'
import { apiClient } from '../api.js'
import { useEffect, useState } from 'react';
import Modal from 'react-modal';

export default function PatientsList(props) {

    const [ patients, setPatients ] = useState([]);
    const [ keywords, setKeywords ] = useState('');
    const [ patient, setPatient ] = useState({});
    const [ showModal, setModalStatus ] = useState();
    const [ isLoading, setLoadingStatus ] = useState(true);

    useEffect(() => {
        apiClient.get('/api/patients')
          .then(response => {
            if (response.status === 200) {
              setPatients(response.data);
              // setLoadingStatus(false);
              
            }
          })
          .catch(error => console.error(error));
    }, [])

    const filteredPatients = () => {
        return patients.filter(patient => {
          let haystack = patient.name.toLowerCase();
          return haystack.includes(keywords.toLowerCase())
        })
    }

    const setPatientAttribute = (attribute, value) => {
      patient[attribute] = value;
    }

    const addNewPatient = () => {
        apiClient.get('/sanctum/csrf-cookie')
          .then(() => {
              apiClient.post('/api/patients/', patient).then(response => {
                if (response.status === 201) {
                  patients.unshift(response.data);
                  setModalStatus(false);
                }
              }).catch(error => {
                  console.error(error);
              });
          });
    }

    return (
      <div>
        <div className="text-left mt-5">
          <button onClick={() => setModalStatus(true)} className="py-2 px-4 rounded bg-green-500 text-lg mr-3">Add New Patient</button>
          <input onChange={(e) => setKeywords(e.target.value)}
              placeholder="Search by name"
              className="border-2 border-green-500 rounded w-1/4 py-2 px-4" />
        </div>

        <table className="mt-3 mx-auto w-full table-auto">
          <thead>
            <tr className="border-b border-green-500 pb-3">
              <th className="text-left py-3 text-lg">Name</th>
              <th className="text-left text-lg">Gender</th>
              <th className="text-left text-lg">Mobile</th>
              <th className="text-left text-lg">Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-left">
            {filteredPatients().map(function(patient){
              return <Patient key={patient.id} data={patient} />
            })}
          </tbody>
        </table>

        <Modal 
          isOpen={showModal}
          onRequestClose={() => setModalStatus(false)}
          className="text-left z-50 overflow-auto bg-white w-1/2 px-10 py-5 inset-1/4 border-green-200 border-2 absolute"
          contentLabel="Add New Note Patient"
        >
            <h3 className="text-xl">Add New Patient</h3>
            <form slot="body">
              <div className="my-5">
                <input
                  className="w-full border-2 rounded p-3 border-green-500"
                  name="name"
                  placeholder="Name"
                  onChange={(e) => setPatientAttribute('name', e.target.value)}
                  required
                  />
              </div>
              <div className="my-5">
                <input
                  className="w-full border-2 rounded p-3 border-green-500"
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={(e) => setPatientAttribute('email', e.target.value)}
                  required
                  />
              </div>
              <div className="my-5">
                <select onChange={(e) => setPatientAttribute('gender', e.target.value)} value="" className="w-full border-2 rounded p-3 border-green-500">
                  <option disabled value="">Please select a gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="rather not say">Rather Not Say</option>
                </select>
              </div>
              <div className="my-5">
                <input
                    className="w-full border-2 rounded p-3 border-green-500"
                    name="mobile"
                    placeholder="Mobile"
                    onChange={(e) => setPatientAttribute('mobile', e.target.value)}
                />
              </div>
            </form>

            <div slot="footer">
              <button onClick={addNewPatient} className="py-3 px-5 rounded bg-green-500 text-lg right">Submit</button>
              <button onClick={() => setModalStatus(false)} className="py-3 px-5 rounded bg-gray-200 ml-3 text-lg right">Cancel</button>
            </div>
        </Modal>
      </div>
    )
}
