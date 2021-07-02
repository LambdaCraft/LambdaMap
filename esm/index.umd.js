import ReactDOM from 'react-dom';
import { LambdaMap } from './index';
export var renderTo = function renderTo(domEl, props) {
  return ReactDOM.render( /*#__PURE__*/React.createElement(LambdaMap, props), domEl);
};