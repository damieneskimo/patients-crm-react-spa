import { render, fireEvent } from '@testing-library/react'
import SearchBox, { ISearchBox } from './SearchBox'

const defaultProps = {
  onSearch: jest.fn()
}

const testProps: ISearchBox = {
  placeholder: 'type to search',
  className: 'test-class',
  onSearch: jest.fn()
}

describe('test SearchBox component', () => {
  it('should render the correct default search box', () => {
    const wrapper = render(<SearchBox {...defaultProps} />)
    const element = wrapper.getByTestId('search-box') as HTMLButtonElement
    expect(element).toBeInTheDocument()
    
    const btn = wrapper.getByRole('button')
    expect(btn).toHaveTextContent('Search')
    fireEvent.click(btn)
    expect(defaultProps.onSearch).toHaveBeenCalled()
  })
  it('should render the correct component based on different props', () => {
    const wrapper = render(<SearchBox {...testProps} />)
    const element = wrapper.getByTestId('search-box') as HTMLButtonElement
    expect(element).toBeInTheDocument()
    expect(element).toHaveClass('test-class')
    
    const input = wrapper.getByPlaceholderText('type to search')
    expect(input).toBeInTheDocument()
  })
})