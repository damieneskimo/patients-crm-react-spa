import PatientListItem from './PatientListItem'
import { apiClient } from '../api';
import { useRef, useState, useEffect } from 'react';
import Modal from 'react-modal';
import Loader from './Loader';
import ReactPaginate from 'react-paginate';
import { useFetchDataListApi } from '../hooks/useFetchDataListApi';
import { useMountedRef } from '../hooks/useMountedRef';
import { useDebouncedCallback } from 'use-debounce';
import { Patient } from '../types';

export default function PatientsList() {
    const [ newPatient, setNewPatient ] = useState({
      name: '', email: '', gender: '', mobile: '', profile_photo: ''
    });
    const [ showModal, setModalStatus ] = useState(false);
    const mountedRef = useMountedRef();
    const [
      { pageCount, currentPage, dataList, keywords, isLoading, isError }, 
      setKeywords, setCurrentPage
    ] = useFetchDataListApi<Patient>('/api/patients', mountedRef);

    const debounced = useDebouncedCallback(
      (value) => {
        setKeywords(value);
        setCurrentPage(1);

        // update url query string
        const url = new URL(window.location.href);
        url.searchParams.delete('page');
        if (keywords.length) {
          url.searchParams.set('keywords', value);
        }
        window.history.pushState({}, '', url.toString());
      },
      800
    );

    const addNewPatient = () => {
      apiClient.post('/api/patients/', newPatient).then(response => {
        if (response.status === 201) {
          dataList.unshift(response.data);
          setModalStatus(false);
          // reset patient state
          setNewPatient({
            name: '', email: '', gender: '', mobile: '', profile_photo: ''
          })
        }
      }).catch(error => {
          console.error(error);
      });
    }

    const handlePageClick = (selectedItem: {selected: number}) => {
      let pageNum = selectedItem.selected + 1;
      const url = new URL(window.location.href);

      setCurrentPage(pageNum);
      url.searchParams.set('page', pageNum.toString());
      window.history.pushState({}, '', url.toString());
    }

    if (isLoading) {
      return <Loader />
    }

    return (
      <div>
        <div className="text-left mt-5">
          <button onClick={() => setModalStatus(true)} className="py-2 px-4 rounded bg-green-500 text-lg mr-3">Add New Patient</button>
          <input onChange={ (e) => debounced(e.target.value) }
              defaultValue={keywords}
              placeholder="Search by name or email"
              className="border-2 border-green-500 rounded w-1/4 py-2 px-4" />
        </div>

        <table className="mt-3 mx-auto w-full table-auto">
          <thead>
            <tr className="border-b border-green-500 pb-3">
              <th className="py-3"></th>
              <th className="text-left py-3 text-lg">Name</th>
              <th className="text-left text-lg">Gender</th>
              <th className="text-left text-lg">Mobile</th>
              <th className="text-left text-lg">Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-left">
            {dataList.map(function(patient: Patient){
              return <PatientListItem key={patient.id} data={patient} />
            })}
          </tbody>
        </table>
        
        {/* Pagination */}
        <ReactPaginate
          previousLabel={'prev'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          initialPage={currentPage - 1}
          disableInitialCallback={true}
          onPageChange={handlePageClick}
          containerClassName={'pagination my-5 flex justify-center text-2xl'}
          activeClassName={'bg-green-400 rounded-full h-8 w-8 text-center'}
        />

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
                  onChange={(e) => setNewPatient({...newPatient, name: e.target.value}) }
                  value={newPatient.name}
                  autoFocus
                  required
                  />
              </div>
              <div className="my-5">
                <input
                  className="w-full border-2 rounded p-3 border-green-500"
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                  value={newPatient.email}
                  required
                  />
              </div>
              <div className="my-5">
                <select onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})} value={newPatient.gender?? ''} className="w-full border-2 rounded p-3 border-green-500">
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
                    onChange={(e) => setNewPatient({...newPatient, mobile: e.target.value})}
                    value={newPatient.mobile}
                />
              </div>
              <div className="my-5">
                <input
                    type="file"
                    className="w-full border-2 rounded p-3 border-green-500"
                    name="profile_photo"
                    placeholder="Upload a profile photo"
                    onChange={(e) => setNewPatient({...newPatient, profile_photo: e.target.value})}
                    value={newPatient.profile_photo}
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
