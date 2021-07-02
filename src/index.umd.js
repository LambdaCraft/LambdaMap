import ReactDOM from 'react-dom'
import { LambdaMap } from './index'
export const renderTo = (domEl, props) => ReactDOM.render(<LambdaMap {...props} />, domEl)