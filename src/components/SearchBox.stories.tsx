import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import SearchBox from './SearchBox'

const defaultSearchBox = () => (
  <SearchBox onSearch={action('clicked')} />
)

const searchBoxWithCustomProps = () => (
  <>
    <SearchBox className="test-class" onSearch={action('clicked')} />
    <SearchBox searchBtnText="Go" onSearch={action('clicked')} />
    <SearchBox placeholder="search by name" onSearch={action('clicked')} />
  </>
)

const searchBoxWithExistingKeywords = () => (
  <>
    <SearchBox searchTerm="mike" onSearch={action('clicked')} />
    <SearchBox searchBtnText="Go" onSearch={action('clicked')} />
  </>
)

storiesOf('SearchBox Component', module)
  .add('SearchBox', defaultSearchBox)
  .add('SearchBox with custom props', searchBoxWithCustomProps)
  .add('SearchBox with existing search term', searchBoxWithExistingKeywords)
