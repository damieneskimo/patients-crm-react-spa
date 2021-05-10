import { Note } from '../types';

type Props = {
    data: Note[]
}

export default function Timeline(props: Props) {
    return (
        <div className="w-full px-20 py-8 bg-gray-200 overflow-hidden">
            <ul className="list-none">
                {
                    props.data.map((item) => {
                        return (
                            <li key={item.id}>
                                <div className="flex items-center">
                                    <div className="border-r-2 border-green-400 py-8 px-4 h-full w-1/4 relative flex items-center justify-end">
                                        <p className="mr-5">{ item.created_at }</p>
                                        <div className="bg-green-500 rounded-full h-8 w-8 absolute -right-4"></div>
                                    </div>
                                    <div className="text-left w-3/4 ml-10">
                                        { item.content }
                                    </div>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}
