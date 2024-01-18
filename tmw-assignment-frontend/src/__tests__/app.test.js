import {cleanup, fireEvent, render, waitFor} from '@testing-library/react';
import App from '../App'

afterEach(cleanup);

test('should render app',() => {
    const tree = render(<App/>);
    // console.log(tree);
    const firstName = tree.getByTestId("first-name");
    const lastName = tree.getByTestId("last-name");
    const dob = tree.getByTestId("dob");
    
    fireEvent.change(firstName, {'target': {'value': 'diksha12nt'}});
    fireEvent.change(lastName, {'target': {'value': 'pratap sin2gh'}});
    fireEvent.change(dob, {'target': {'value': '2000-03-29'}});
    fireEvent.c
    console.log(firstName.value,lastName.value,dob.value,"lol");
    exp
})