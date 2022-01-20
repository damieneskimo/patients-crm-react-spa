import React, { useState, FC, FormEvent } from "react";

export interface ISearchBox {
  searchTerm?: string,
  placeholder?: string,
  className?: string,
  searchBtnText?: string,
  onSearch: (value: string) => void,
}

const SearchBox: FC<ISearchBox> = (props: ISearchBox) => {
  const [value, setValue] = useState(props.searchTerm || '')

  const handleSearchTermChanged = (e: FormEvent) => {
    e.preventDefault()
    props.onSearch(value)
  }

  const handleClear = () => {
    setValue('')
    props.onSearch('')
  }

  return (
      <div className={props.className} data-testid="search-box">
        <form onSubmit={ (e) => handleSearchTermChanged(e) } className="relative">
          <input
            onChange={ e => setValue(e.target.value) }
            defaultValue={props.searchTerm}
            placeholder={props.placeholder}
            name="keywords"
            className="border-2 border-green-500 rounded py-2 px-4 mr-1" />
          {value.length > 0 &&
            <span className="absolute right-2 top-2.5 cursor-pointer" onClick={handleClear}>X</span>
          }
        </form>
        <button onClick={ (e) => handleSearchTermChanged(e) }>{props.searchBtnText?? 'Search'}</button>
      </div>
  )
}

export default SearchBox;