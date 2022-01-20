import { Link } from 'react-router-dom';
import { IPatient } from '../../interfaces.js';

type Props = {
  patient: IPatient,
  onSelectPatient: Function
}

const PatientRow =  (props: Props) => {
  const patient = props.patient

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
            onClick={ () => props.onSelectPatient(patient)  }
            className="py-1 px-6 rounded bg-green-400 text-lg mr-3 cursor-pointer">
              Edit
          </button>
          <Link to={{pathname: `${patient.id}`}} 
            className="py-1 px-6 rounded bg-green-400 text-lg inline-block">
            Details
          </Link>
        </td>
      </tr>
    )
}

export default PatientRow;
