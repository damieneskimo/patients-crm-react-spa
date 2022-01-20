import PatientRow from './PatientRow'
import { useState } from 'react';
import Modal from 'react-modal';
import Loader from '../../components/Loader';
import ReactPaginate from 'react-paginate';
import { usePaginatedDataList } from '../../utils/usePaginatedDataList';
import { IPatient } from '../../interfaces';
import SearchBox from "../../components/SearchBox";
import patientService from '../../services/patient';

type PatientDto = {
  name?: string,
  email?: string,
  gender?: string,
  mobile?: string
}

export default function PatientsList() {
    const [ patientDto, setPatientDto ] = useState<PatientDto>({});
    const [ modalOpen, setModalOpen ] = useState(false);
    const [ selectedPatient, setSelectedPatient ] = useState<IPatient | null>(null);
    const [
      { pageCount, currentPage, dataList, keywords, isLoading }, 
      setKeywords, setCurrentPage, setDataList
    ] = usePaginatedDataList<IPatient>('api/patients');
    
    const handleSearch = (value: string) => {
      setKeywords(value);
      setCurrentPage(1);
    }

    const savePatient = async () => {
      let res;
      if (selectedPatient) {
        res = await patientService.updatePatient(selectedPatient.id, patientDto)
        let index = dataList.findIndex(p => p.id == selectedPatient.id)
        let list = [...dataList]
        list[index] = res

        setDataList(list)
      } else {
        res = await patientService.addPatient(patientDto)
        if (res) {
          dataList.unshift(res);
        }
      }

      setModalOpen(false);
      // reset patientDto
      setPatientDto({})
    }

    const handlePageClick = (selectedItem: {selected: number}) => {
      let pageNum = selectedItem.selected + 1;
      const url = new URL(window.location.href);

      setCurrentPage(pageNum);
      url.searchParams.set('page', pageNum.toString());
      window.history.pushState({}, '', url.toString());
    }

    const selectPatient = (patient: IPatient) => {
      setSelectedPatient(patient);
      setModalOpen(true)
    }

    const onModalClose = () => {
      setModalOpen(false)
      setSelectedPatient(null)
    }

    if (isLoading) {
      return <Loader />
    }

    return (
      <div>
        <div className="flex justify-between mt-4">
          <div className="search-and-filters w-3/4">
            <SearchBox className="w-1/3 flex" placeholder="Search by name or email" searchTerm={keywords} onSearch={handleSearch} />
          </div>
          <button onClick={() => setModalOpen(true)} className="py-2 px-4 rounded bg-green-500 text-lg">Add New Patient</button>
        </div>

        <table className="mt-2 mx-auto w-full table-auto">
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
            {dataList.map(function(patient: IPatient) {
              return <PatientRow key={patient.id} patient={patient} onSelectPatient={selectPatient} />
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

        {/* Modal for adding or editing patient */}
        <Modal
          isOpen={modalOpen}
          onRequestClose={onModalClose}
          className="text-left z-50 overflow-auto bg-white w-1/2 px-10 py-5 inset-1/4 border-green-200 border-2 absolute"
        >
            <h3 className="text-xl">{selectedPatient? `Edit ${selectedPatient.name}` : 'Add New Patient'}</h3>
            <form slot="body">
              <div className="my-5">
                <input
                  className="w-full border-2 rounded p-3 border-green-500"
                  name="name"
                  placeholder="Name"
                  onChange={(e) => setPatientDto({...patientDto, name: e.target.value}) }
                  defaultValue={selectedPatient?.name}
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
                  onChange={(e) => setPatientDto({...patientDto, email: e.target.value})}
                  defaultValue={selectedPatient?.email}
                  required
                  />
              </div>
              <div className="my-5">
                <select onChange={(e) => setPatientDto({...patientDto, gender: e.target.value})} defaultValue={selectedPatient?.gender?? ''} className="w-full border-2 rounded p-3 border-green-500">
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
                    onChange={(e) => setPatientDto({...patientDto, mobile: e.target.value})}
                    defaultValue={selectedPatient?.mobile}
                />
              </div>
            </form>

            <div slot="footer">
              <button onClick={savePatient} className="py-3 px-5 rounded bg-green-500 text-lg right">Save</button>
              <button onClick={() => setModalOpen(false)} className="py-3 px-5 rounded bg-gray-200 ml-3 text-lg right">Cancel</button>
            </div>
        </Modal>
      </div>
    )
}
